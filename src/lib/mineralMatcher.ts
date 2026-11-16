import { DetectedElement, MatchScore, MineralDefinition } from '@/types';
import { MINERALS_DATABASE } from '@/data/minerals';
import { ELEMENTS, getAtomicMass, isLightElement } from '@/data/elements';

/**
 * Normalizuje wykryte pierwiastki do 100% widzialnej masy XRF
 * (odrzuca pierwiastki o Z < 11, bo nie są wiarygodnie mierzone przez XRF)
 */
export function normalizeSampleElements(
  elements: DetectedElement[]
): { normalized: Record<string, number>; rawTotal: number; visibleTotal: number } {
  // Filtrujemy tylko pierwiastki z wartością > 0 i nie będące pierwiastkami lekkimi
  const visibleElements = elements.filter(
    (e) => e.value > 0 && !isLightElement(e.symbol)
  );

  const rawTotal = elements.reduce((sum, e) => sum + e.value, 0);
  const visibleTotal = visibleElements.reduce((sum, e) => sum + e.value, 0);

  const normalized: Record<string, number> = {};

  if (visibleTotal > 0) {
    visibleElements.forEach((e) => {
      normalized[e.symbol] = (e.value / visibleTotal) * 100;
    });
  }

  return { normalized, rawTotal, visibleTotal };
}

/**
 * Oblicza liczby moli pierwiastków w próbce n = m / M
 */
export function calculateMoles(
  normalizedWeights: Record<string, number>
): Record<string, number> {
  const moles: Record<string, number> = {};

  for (const [sym, weight] of Object.entries(normalizedWeights)) {
    const mass = getAtomicMass(sym);
    if (mass > 0) {
      moles[sym] = weight / mass;
    }
  }

  return moles;
}

/**
 * Porównuje profil próbki z bazą minerałów i generuje ranking dopasowania
 */
export function identifyMinerals(
  detectedElements: DetectedElement[],
  database: MineralDefinition[] = MINERALS_DATABASE
): MatchScore[] {
  const { normalized: sampleNorm, visibleTotal } = normalizeSampleElements(detectedElements);

  if (visibleTotal <= 0 || Object.keys(sampleNorm).length === 0) {
    return [];
  }

  const sampleMoles = calculateMoles(sampleNorm);

  const results: MatchScore[] = database.map((mineral) => {
    const minVisible = mineral.xrfVisibleWeightPercent;
    const allSymbols = Array.from(
      new Set([...Object.keys(sampleNorm), ...Object.keys(minVisible)])
    );

    // 1. Obliczenie odległości euklidesowej wag procentowych
    let sumSquaredDiff = 0;
    let dotProduct = 0;
    let normSample = 0;
    let normMineral = 0;

    const elementComparison: MatchScore['elementComparison'] = [];

    allSymbols.forEach((sym) => {
      const sVal = sampleNorm[sym] || 0;
      const mVal = minVisible[sym] || 0;
      const diff = Math.abs(sVal - mVal);

      sumSquaredDiff += Math.pow(sVal - mVal, 2);
      dotProduct += sVal * mVal;
      normSample += Math.pow(sVal, 2);
      normMineral += Math.pow(mVal, 2);

      if (sVal > 0 || mVal > 0) {
        elementComparison.push({
          symbol: sym,
          samplePercent: Number(sVal.toFixed(2)),
          theoreticalPercent: Number(mVal.toFixed(2)),
          difference: Number(diff.toFixed(2))
        });
      }
    });

    // Podobieństwo cosinusowe
    const cosineSim =
      normSample > 0 && normMineral > 0
        ? dotProduct / (Math.sqrt(normSample) * Math.sqrt(normMineral))
        : 0;

    // Odległość euklidesowa w procentach
    const euclideanDist = Math.sqrt(sumSquaredDiff);

    // Wynik bazowy (połączenie podobieństwa kątowego i błędu bezwzględnego)
    let score = cosineSim * 100 * (1 - Math.min(1, euclideanDist / 120));

    // 2. Kary za brakujące kluczowe pierwiastki minerału
    for (const [sym, theoWeight] of Object.entries(minVisible)) {
      if (theoWeight >= 15 && (!sampleNorm[sym] || sampleNorm[sym] < 2)) {
        // Kluczowy pierwiastek minerału w ogóle nieobecny w próbce!
        score -= theoWeight * 0.7;
      }
    }

    // 3. Kary za obecność dużych zanieczyszczeń niewchodzących w skład minerału
    for (const [sym, sampleWeight] of Object.entries(sampleNorm)) {
      if (!minVisible[sym] && sampleWeight > 5) {
        score -= sampleWeight * 0.5;
      }
    }

    // 4. Analiza kluczowych stosunków molowych
    const molarRatioDetails: MatchScore['molarRatioDetails'] = [];

    if (mineral.keyMolarRatios) {
      for (const [ratioKey, theoRatio] of Object.entries(mineral.keyMolarRatios)) {
        const [elA, elB] = ratioKey.split('/');
        const molesA = sampleMoles[elA];
        const molesB = sampleMoles[elB];

        if (molesA !== undefined && molesB !== undefined && molesB > 0) {
          const sampleRatio = molesA / molesB;
          const diffPct = Math.abs((sampleRatio - theoRatio) / theoRatio) * 100;

          molarRatioDetails.push({
            ratioName: `${elA} : ${elB}`,
            sampleRatio: Number(sampleRatio.toFixed(3)),
            theoreticalRatio: Number(theoRatio.toFixed(3)),
            differencePercent: Number(diffPct.toFixed(1))
          });

          // Jeśli stosunek molowy jest bardzo bliski teoretycznemu (<10% błędu), daj bonus
          if (diffPct < 10) {
            score += (10 - diffPct) * 0.5;
          } else if (diffPct > 40) {
            score -= Math.min(15, (diffPct - 40) * 0.3);
          }
        }
      }
    }

    // Normalizacja końcowego wyniku do zakresu [0, 99.9]
    score = Math.max(0, Math.min(99.5, score));

    // Klasyfikacja poziomu pewności
    let confidenceTier: MatchScore['confidenceTier'] = 'unlikely';
    if (score >= 82) confidenceTier = 'high';
    else if (score >= 60) confidenceTier = 'medium';
    else if (score >= 35) confidenceTier = 'low';

    // Przygotowanie wyjaśnienia
    let explanation = '';
    const mainSampleEl = Object.entries(sampleNorm).sort((a, b) => b[1] - a[1])[0];
    const mainMineralEl = Object.entries(minVisible).sort((a, b) => b[1] - a[1])[0];

    if (confidenceTier === 'high') {
      if (molarRatioDetails.length > 0 && molarRatioDetails[0].differencePercent < 12) {
        const r = molarRatioDetails[0];
        explanation = `Bardzo wysoka zgodność składu pierwiastkowego. Zmierzony stosunek molowy ${r.ratioName} wynosi ${r.sampleRatio} (teoria dla ${mineral.namePl}: ${r.theoreticalRatio}, błąd zaledwie ${r.differencePercent}%).`;
      } else {
        explanation = `Wybitna zgodność widmowa XRF. Dominujący pierwiastek ${mainSampleEl?.[0]} pokrywa się z głównym składnikiem minerału.`;
      }
    } else if (confidenceTier === 'medium') {
      explanation = `Zgodne główne pierwiastki (${mainMineralEl?.[0]}), jednak występują odchylenia stechiometryczne lub domieszki innych faz mineralnych.`;
    } else if (confidenceTier === 'low') {
      explanation = `Częściowe podobieństwo chemiczne. Wymaga weryfikacji cech fizycznych (twardość Mohsa, barwa rysy).`;
    } else {
      explanation = `Niskie prawdopodobieństwo. Profil pierwiastkowy znacząco odbiega od wzorca.`;
    }

    // Specjalna adnotacja dla minerałów z niewidocznymi pierwiastkami lekkimi (np. kalcyt vs kwarc vs fluoryt)
    const hasLight = Object.keys(mineral.stoichiometry).some((s) => isLightElement(s));
    if (hasLight) {
      const invisibleEls = Object.keys(mineral.stoichiometry).filter((s) => isLightElement(s));
      explanation += ` (Uwaga: XRF nie wykrywa ${invisibleEls.join(', ')} – minerał zidentyfikowany na podstawie widzialnej matrycy).`;
    }

    return {
      mineral,
      score: Number(score.toFixed(1)),
      confidenceTier,
      molarRatioDetails,
      elementComparison: elementComparison.sort((a, b) => b.samplePercent - a.samplePercent),
      explanation
    };
  });

  // Sortowanie od najbardziej prawdopodobnego
  return results.sort((a, b) => b.score - a.score);
}
