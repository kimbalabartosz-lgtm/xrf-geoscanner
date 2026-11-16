import { DetectedElement, MatchScore, MineralDefinition, ElementComparisonResult, PolymorphInfo } from '@/types';
import { MINERALS_DATABASE } from '@/data/minerals';
import { getAtomicMass, isLightElement } from '@/data/elements';

const TOLERANCE_WINDOW_PCT = 2.0; // Widełki błędu +-2.0%

/**
 * Normalizuje wykryte pierwiastki do 100% widzialnej masy XRF
 * Odrzuca pierwiastki lekkie (Z < 11: H, Li, Be, B, C, N, O, F)
 */
export function normalizeSampleElements(
  elements: DetectedElement[]
): {
  normalized: Record<string, number>;
  rawTotal: number;
  visibleTotal: number;
  sampleLightPercent: number;
} {
  const visibleElements = elements.filter(
    (e) => e.value > 0 && !isLightElement(e.symbol)
  );

  const rawTotal = elements.reduce((sum, e) => sum + (Number(e.value) || 0), 0);
  const visibleTotal = visibleElements.reduce((sum, e) => sum + (Number(e.value) || 0), 0);

  // Szacowany bilans pierwiastków lekkich (jeśli suma surowa < 100%)
  const sampleLightPercent = rawTotal > 0 && rawTotal < 99.0
    ? Number((100 - rawTotal).toFixed(2))
    : 0;

  const normalized: Record<string, number> = {};

  if (visibleTotal > 0) {
    visibleElements.forEach((e) => {
      normalized[e.symbol] = Number(((e.value / visibleTotal) * 100).toFixed(2));
    });
  }

  return { normalized, rawTotal, visibleTotal, sampleLightPercent };
}

/**
 * Oblicza liczby moli n = m / M dla widzialnych pierwiastków
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
 * Generuje unikalny odcisk stechiometryczny minerału, aby wykrywać polimorfy
 * (minerały o identycznym składzie chemicznym, np. Piryt i Markasyt, Kalcyt i Aragonit)
 */
function getStoichiometryFingerprint(min: MineralDefinition): string {
  return Object.entries(min.totalWeightPercent)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([sym, pct]) => `${sym}:${Math.round(pct * 2) / 2}`)
    .join('|');
}

/**
 * Główny algorytm porównujący próbkę ze wszystkimi minerałami w bazie.
 * Uwzględnia:
 * - Widełki tolerancji +-2.0%
 * - Bilans pierwiastków lekkich
 * - Automatyczne wykrywanie polimorfów i łączenie ich w pary "Nazwa X / Nazwa Y (albo to, albo to)"
 */
export function identifyMinerals(
  detectedElements: DetectedElement[],
  database: MineralDefinition[] = MINERALS_DATABASE
): MatchScore[] {
  const { normalized: sampleNorm, visibleTotal, sampleLightPercent } =
    normalizeSampleElements(detectedElements);

  if (visibleTotal <= 0 || Object.keys(sampleNorm).length === 0) {
    return [];
  }

  const sampleMoles = calculateMoles(sampleNorm);

  // 1. Zbuduj mapę polimorfów w bazie danych
  const fingerprintGroups = new Map<string, MineralDefinition[]>();
  database.forEach((min) => {
    const fg = getStoichiometryFingerprint(min);
    const existing = fingerprintGroups.get(fg) || [];

    // Deduplikacja po rdzennej nazwie (np. unikaj dublowania "Markasyt / Markasyt")
    const baseName = min.namePl.split('(')[0].trim().toLowerCase();
    const alreadyPresent = existing.some(
      (ex) => ex.namePl.split('(')[0].trim().toLowerCase() === baseName
    );
    if (!alreadyPresent) {
      existing.push(min);
      fingerprintGroups.set(fg, existing);
    }
  });

  // 2. Oblicz dopasowanie dla każdego minerału
  const rawResults: MatchScore[] = database.map((mineral) => {
    const minVisible = mineral.xrfVisibleWeightPercent;
    const allSymbols = Array.from(
      new Set([...Object.keys(sampleNorm), ...Object.keys(minVisible)])
    );

    let sumSquaredDiff = 0;
    let dotProduct = 0;
    let normSample = 0;
    let normMineral = 0;
    let elementsWithinToleranceCount = 0;
    let totalComparedCount = 0;

    const elementComparison: ElementComparisonResult[] = [];

    allSymbols.forEach((sym) => {
      const sVal = sampleNorm[sym] || 0;
      const mVal = minVisible[sym] || 0;
      const diff = Math.abs(sVal - mVal);

      sumSquaredDiff += Math.pow(sVal - mVal, 2);
      dotProduct += sVal * mVal;
      normSample += Math.pow(sVal, 2);
      normMineral += Math.pow(mVal, 2);

      const toleranceWindow = mineral.toleranceWindows[sym] || {
        expected: mVal,
        min: Math.max(0, mVal - TOLERANCE_WINDOW_PCT),
        max: Math.min(100, mVal + TOLERANCE_WINDOW_PCT)
      };

      // Czy mieści się w widełkach +-2%
      const withinTolerance = diff <= TOLERANCE_WINDOW_PCT;

      if (sVal > 0 || mVal > 0) {
        totalComparedCount++;
        if (withinTolerance) elementsWithinToleranceCount++;

        elementComparison.push({
          symbol: sym,
          samplePercent: Number(sVal.toFixed(2)),
          theoreticalPercent: Number(mVal.toFixed(2)),
          difference: Number(diff.toFixed(2)),
          withinTolerance,
          toleranceMin: toleranceWindow.min,
          toleranceMax: toleranceWindow.max
        });
      }
    });

    const allElementsWithin2Percent =
      totalComparedCount > 0 && elementsWithinToleranceCount === totalComparedCount;

    // Podobieństwo cosinusowe
    const cosineSim =
      normSample > 0 && normMineral > 0
        ? dotProduct / (Math.sqrt(normSample) * Math.sqrt(normMineral))
        : 0;

    const euclideanDist = Math.sqrt(sumSquaredDiff);

    // Wynik bazowy
    let score = cosineSim * 100 * (1 - Math.min(1, euclideanDist / 120));

    // BONUS za idealne dopasowanie w widełkach +-2%:
    if (allElementsWithin2Percent) {
      score = Math.max(score, 94.0 + (1 - euclideanDist / 5) * 5.5);
    } else if (elementsWithinToleranceCount > 0) {
      score += (elementsWithinToleranceCount / totalComparedCount) * 8;
    }

    // Kary za brakujące kluczowe pierwiastki minerału (>15%)
    for (const [sym, theoWeight] of Object.entries(minVisible)) {
      if (theoWeight >= 15 && (!sampleNorm[sym] || sampleNorm[sym] < 2)) {
        score -= theoWeight * 0.7;
      }
    }

    // Kary za nadmiarowe zanieczyszczenia obce dla minerału
    for (const [sym, sampleWeight] of Object.entries(sampleNorm)) {
      if (!minVisible[sym] && sampleWeight > 4) {
        score -= sampleWeight * 0.5;
      }
    }

    // Weryfikacja stosunków molowych
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

          if (diffPct <= 5.0) {
            score += 5;
          } else if (diffPct > 35) {
            score -= Math.min(15, (diffPct - 35) * 0.3);
          }
        }
      }
    }

    // Weryfikacja bilansu pierwiastków lekkich
    const lightDiff = Math.abs(sampleLightPercent - mineral.lightElementsPercent);
    const lightWithinTolerance = sampleLightPercent > 0 && lightDiff <= TOLERANCE_WINDOW_PCT;

    if (sampleLightPercent > 0) {
      if (lightWithinTolerance) {
        score += 8;
      } else if (lightDiff > 20) {
        score -= Math.min(20, (lightDiff - 20) * 0.4);
      }
    }

    // Normalizacja do zakresu [0, 99.8%]
    score = Math.max(0, Math.min(99.8, score));

    // Poziom pewności
    let confidenceTier: MatchScore['confidenceTier'] = 'unlikely';
    if (score >= 85 || allElementsWithin2Percent) confidenceTier = 'high';
    else if (score >= 62) confidenceTier = 'medium';
    else if (score >= 35) confidenceTier = 'low';

    // Generowanie zwięzłego wyjaśnienia analitycznego
    let explanation = '';
    if (allElementsWithin2Percent) {
      explanation = `Wszystkie wykryte pierwiastki mieszczą się w ścisłych widełkach błędu ±2.0% od teoretycznego wzorca ${mineral.namePl}!`;
    } else if (confidenceTier === 'high') {
      explanation = `Bardzo wysoka zgodność składu pierwiastkowego z wzorcem minerału ${mineral.namePl}.`;
    } else if (confidenceTier === 'medium') {
      explanation = `Zgodność głównych faz pierwiastkowych z umiarkowanymi odchyleniami stechiometrycznymi.`;
    } else {
      explanation = `Częściowe podobieństwo lub obecność obcych domieszek mineralnych.`;
    }

    if (mineral.lightElementsPercent > 0) {
      const lightBreakdownStr = Object.entries(mineral.lightElementsBreakdown)
        .map(([sym, pct]) => `${sym}: ${pct}%`)
        .join(', ');
      explanation += ` Wzór wymaga ${mineral.lightElementsPercent}% pierwiastków lekkich (${lightBreakdownStr}) niewidocznych dla XRF.`;
    }

    return {
      mineral,
      score: Number(score.toFixed(1)),
      confidenceTier,
      allElementsWithin2Percent,
      molarRatioDetails,
      elementComparison: elementComparison.sort((a, b) => b.samplePercent - a.samplePercent),
      lightElementInfo: {
        sampleLightPercent,
        theoreticalLightPercent: mineral.lightElementsPercent,
        difference: Number(lightDiff.toFixed(2)),
        withinTolerance: lightWithinTolerance
      },
      explanation
    };
  });

  // Sortuj od najwyższego dopasowania
  const sorted = rawResults.sort((a, b) => b.score - a.score);

  // 3. Przypisz informacje o polimorfach (np. "Piryt / Markasyt", "Kalcyt / Aragonit")
  sorted.forEach((match) => {
    const fg = getStoichiometryFingerprint(match.mineral);
    const group = fingerprintGroups.get(fg);

    if (group && group.length > 1) {
      const combinedPl = group.map((m) => m.namePl.split('(')[0].trim()).join(' / ');
      const combinedEn = group.map((m) => m.nameEn.split('(')[0].trim()).join(' / ');

      const members = group.map((m) => ({
        id: m.id,
        namePl: m.namePl,
        nameEn: m.nameEn,
        hardness: m.diagnostics.hardness,
        streak: m.diagnostics.streak,
        color: m.diagnostics.color,
        cleavage: m.diagnostics.cleavage || 'wyraźna',
        tests: m.diagnostics.tests
      }));

      const polymorphInfo: PolymorphInfo = {
        isPolymorph: true,
        combinedNamePl: combinedPl,
        combinedNameEn: combinedEn,
        formula: match.mineral.formula,
        members,
        distinctionTip: `Minerały ${combinedPl} mają identyczny skład chemiczny dla spektrometru XRF (${match.mineral.formula}). Aby rozstrzygnąć, który z nich masz w dłoni, sprawdź pokrój kryształów, twardość lub łupliwość podane poniżej.`
      };

      match.polymorphInfo = polymorphInfo;
    }
  });

  return sorted;
}
