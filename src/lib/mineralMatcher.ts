import {
  DetectedElement,
  MatchScore,
  MineralDefinition,
  ElementComparisonResult,
  PolymorphInfo,
  TechnicalAlloyMatch,
  ToleranceConfig,
  ToleranceMode
} from '@/types';
import { MINERALS_DATABASE } from '@/data/minerals';
import { getAtomicMass, isLightElement } from '@/data/elements';

export const DEFAULT_TOLERANCE_CONFIG: ToleranceConfig = {
  mode: 'adaptive',
  fixedValue: 2.0
};

/**
 * Oblicza dopuszczalny margines błędu (+- %) dla danego stężenia pierwiastka:
 * - Tryb adaptacyjny (domyślny geochemiczny):
 *   > 40% masy -> ±3.0% (składnik główny, efekty matrycy i chropowatości)
 *   5% do 40% -> ±2.0% (składnik średni)
 *   0% do 5%   -> ±1.0% (śladowy / pierwiastek obcy - bardzo ostra selekcja zanieczyszczeń)
 * - Tryb stały:
 *   Wartość wybrana suwakiem (np. 1.0%, 2.0%, 3.0%, 4.0%, 5.0%)
 */
export function getElementTolerance(
  concentrationPercent: number,
  config: ToleranceConfig = DEFAULT_TOLERANCE_CONFIG
): { tolerance: number; tierLabel: string } {
  if (config.mode === 'fixed') {
    return {
      tolerance: config.fixedValue,
      tierLabel: `Stała (±${config.fixedValue.toFixed(1)}%)`
    };
  }

  const c = Math.max(0, concentrationPercent);
  if (c > 40.0) {
    return { tolerance: 3.0, tierLabel: `>40% (±3.0%)` };
  }
  if (c >= 5.0) {
    return { tolerance: 2.0, tierLabel: `5-40% (±2.0%)` };
  }
  return { tolerance: 1.0, tierLabel: `<5% (±1.0%)` };
}

/**
 * Wykrywa powszechne stopy przemysłowe i próbki kalibracyjne XRF (np. stal SS-316),
 * gdy próbka nie jest naturalnym minerałem.
 */
export function detectTechnicalAlloy(
  sampleNorm: Record<string, number>
): TechnicalAlloyMatch | null {
  const fe = sampleNorm['Fe'] || 0;
  const cr = sampleNorm['Cr'] || 0;
  const ni = sampleNorm['Ni'] || 0;
  const mo = sampleNorm['Mo'] || 0;
  const cu = sampleNorm['Cu'] || 0;
  const zn = sampleNorm['Zn'] || 0;
  const sn = sampleNorm['Sn'] || 0;
  const ti = sampleNorm['Ti'] || 0;
  const al = sampleNorm['Al'] || 0;
  const pb = sampleNorm['Pb'] || 0;

  // Stal nierdzewna kwasoodporna AISI 316 / SS-316 (Fe ~60-74%, Cr ~16-19%, Ni ~9-14%, Mo ~2-3.5%)
  if (fe >= 55 && fe <= 75 && cr >= 14 && cr <= 22 && ni >= 7 && ni <= 16 && mo >= 1.2) {
    return {
      name: 'Stal nierdzewna kwasoodporna AISI 316 (SS-316)',
      grade: 'SS-316 / 1.4401 / 1.4404',
      description: 'Austenityczna stal kwasoodporna Fe-Cr-Ni-Mo. Bardzo częsty wzorzec testowy i kalibracyjny spektrometrów XRF. Materiał metalurgiczny (stop przemysłowy), nie występuje w przyrodzie jako minerał naturalny.'
    };
  }

  // Stal nierdzewna AISI 304 / SS-304 (Fe ~65-75%, Cr ~17-20%, Ni ~8-12%, bez Mo)
  if (fe >= 58 && fe <= 76 && cr >= 15 && cr <= 22 && ni >= 7 && ni <= 14 && mo < 1.2) {
    return {
      name: 'Stal nierdzewna austenityczna AISI 304 (SS-304)',
      grade: 'SS-304 / 1.4301',
      description: 'Powszechna stal nierdzewna 18/8 (stop Fe-Cr-Ni). Stop techniczny, nie jest minerałem naturalnym.'
    };
  }

  // Mosiądz przemysłowy (Cu-Zn)
  if (cu >= 55 && cu <= 85 && zn >= 15 && zn <= 45 && (fe + cr + ni) < 5) {
    return {
      name: 'Mosiądz przemysłowy (stop Cu-Zn)',
      grade: 'Mosiądz / Brass',
      description: 'Stop techniczny miedzi i cynku. W naturze miedź i cynk tworzą odrębne fazy mineralne.'
    };
  }

  // Brąz cynowy (Cu-Sn)
  if (cu >= 75 && cu <= 95 && sn >= 4 && sn <= 20) {
    return {
      name: 'Brąz cynowy (stop Cu-Sn)',
      grade: 'Brąz / Bronze',
      description: 'Stop techniczny miedzi z cyną. Występuje jako wyrób metalurgiczny lub archeologiczny.'
    };
  }

  // Stop tytanu lotniczego (Ti-6Al-4V)
  if (ti >= 80 && al >= 3 && al <= 8) {
    return {
      name: 'Stop tytanu lotniczego (Ti-6Al-4V)',
      grade: 'Grade 5',
      description: 'Wysokowytrzymały stop tytanu z glinem i wanadem.'
    };
  }

  // Lutowie Sn-Pb
  if (sn >= 25 && sn <= 75 && pb >= 25 && pb <= 75) {
    return {
      name: 'Stop lutowniczy ołowiowo-cynowy (Sn-Pb)',
      grade: 'Lutowie Sn-Pb',
      description: 'Stop techniczny ołowiu i cyny używany w elektronice i hydraulice.'
    };
  }

  return null;
}

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
  toleranceConfig: ToleranceConfig = DEFAULT_TOLERANCE_CONFIG,
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

      // Oblicz dynamiczną widełkę tolerancji dla danego pierwiastka (adaptacyjną lub stałą)
      const refConcentration = Math.max(sVal, mVal);
      const { tolerance: tolPct, tierLabel } = getElementTolerance(refConcentration, toleranceConfig);

      const toleranceMin = Math.max(0, mVal - tolPct);
      const toleranceMax = Math.min(100, mVal + tolPct);
      const withinTolerance = diff <= tolPct;

      if (sVal > 0 || mVal > 0) {
        totalComparedCount++;
        if (withinTolerance) elementsWithinToleranceCount++;

        elementComparison.push({
          symbol: sym,
          samplePercent: Number(sVal.toFixed(2)),
          theoreticalPercent: Number(mVal.toFixed(2)),
          difference: Number(diff.toFixed(2)),
          withinTolerance,
          toleranceMin: Number(toleranceMin.toFixed(2)),
          toleranceMax: Number(toleranceMax.toFixed(2)),
          appliedTolerance: tolPct,
          tierLabel
        });
      }
    });

    const allElementsWithin2Percent =
      totalComparedCount > 0 && elementsWithinToleranceCount === totalComparedCount;

    let maxElementDifference = 0;
    let maxDiffSymbol = '';
    let totalExcessError = 0;

    elementComparison.forEach((ec) => {
      if (ec.difference > maxElementDifference) {
        maxElementDifference = ec.difference;
        maxDiffSymbol = ec.symbol;
      }
      if (!ec.withinTolerance) {
        totalExcessError += (ec.difference - ec.appliedTolerance);
      }
    });

    const euclideanDist = Math.sqrt(sumSquaredDiff);

    // Weryfikacja bilansu pierwiastków lekkich z dynamiczną tolerancją
    const { tolerance: lightTol } = getElementTolerance(mineral.lightElementsPercent, toleranceConfig);
    const lightDiff = Math.abs(sampleLightPercent - mineral.lightElementsPercent);
    const lightWithinTolerance = sampleLightPercent === 0 || lightDiff <= lightTol;
    if (sampleLightPercent > 0 && !lightWithinTolerance) {
      const excessLight = lightDiff - lightTol;
      if (excessLight > maxElementDifference) {
        maxElementDifference = lightDiff;
        maxDiffSymbol = 'Lekkie (Z<11)';
      }
      totalExcessError += excessLight;
    }

    // Minerał jest zweryfikowany TYLKO wtedy, gdy każdy pierwiastek mieści się w wyznaczonych widełkach
    const isVerified = allElementsWithin2Percent && lightWithinTolerance;

    // Punktacja oparta na ścisłej tolerancji błędu:
    let score = 0;
    let confidenceTier: MatchScore['confidenceTier'] = 'unlikely';

    if (isVerified) {
      // IDEALNA ZGODNOŚĆ: Wszystkie pierwiastki mieszczą się w wyznaczonych widełkach
      score = Math.max(92.0, 99.8 - euclideanDist * 2.0);
      confidenceTier = 'high';
    } else {
      // Skład przekracza limit w którymkolwiek kierunku
      if (maxElementDifference > 15 || totalExcessError > 20) {
        score = Math.max(5.0, Math.min(25.0, 35 - maxElementDifference * 0.8));
        confidenceTier = 'unlikely';
      } else if (maxElementDifference > 6 || totalExcessError > 10) {
        score = Math.max(15.0, Math.min(42.0, 52 - maxElementDifference * 1.8));
        confidenceTier = 'unlikely';
      } else if (maxElementDifference > 1.0) {
        score = Math.max(45.0, Math.min(65.0, 75 - maxElementDifference * 4.0));
        confidenceTier = 'low';
      }
    }

    // Weryfikacja stosunków molowych (obliczana jako dodatkowa informacja)
    const molarRatioDetails: MatchScore['molarRatioDetails'] = [];

    if (mineral.keyMolarRatios && isVerified) {
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
        }
      }
    }

    // Normalizacja do zakresu [0, 99.8%]
    score = Math.max(0, Math.min(99.8, score));

    // Generowanie zwięzłego wyjaśnienia analitycznego
    let explanation = '';
    if (isVerified) {
      explanation = `Zweryfikowano! Wszystkie wykryte pierwiastki mieszczą się w dopuszczalnym marginesie błędu od wzorca ${mineral.namePl}!`;
    } else {
      explanation = `Nie można zweryfikować jako ${mineral.namePl}: odchylenie składu przekracza dopuszczalny limit (największa różnica na ${maxDiffSymbol}: ${maxElementDifference.toFixed(1)}%). Minerał odrzucony.`;
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
      isVerified,
      maxElementDifference: Number(maxElementDifference.toFixed(2)),
      maxDiffSymbol,
      appliedToleranceConfig: toleranceConfig,
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

  // Wykryj czy próbka odpowiada znanemu stopowi technicznemu (np. SS-316)
  const technicalAlloyHint = detectTechnicalAlloy(sampleNorm);

  // Sortuj od najwyższego dopasowania
  const sorted = rawResults.sort((a, b) => b.score - a.score);

  // 3. Przypisz informacje o polimorfach i stopach
  sorted.forEach((match) => {
    match.technicalAlloyHint = technicalAlloyHint;

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
