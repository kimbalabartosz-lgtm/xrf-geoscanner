import {
  DetectedElement,
  MatchScore,
  MineralDefinition,
  ElementComparisonResult,
  PolymorphInfo,
  TechnicalAlloyMatch,
  ToleranceConfig,
  ToleranceMode,
  MatrixInclusion,
  IsomorphicSubstitution
} from '@/types';
import { MINERALS_DATABASE } from '@/data/minerals';
import { getAtomicMass, isLightElement } from '@/data/elements';

export const DEFAULT_TOLERANCE_CONFIG: ToleranceConfig = {
  mode: 'field',
  fixedValue: 4.0
};

/**
 * Oblicza dopuszczalny margines błędu (+- %) dla danego stężenia pierwiastka:
 * - Tryb terenowy geologiczny ('field' - zalecany):
 *   > 40% masy -> ±4.0% (składnik główny, efekty chropowatości powierzchni skały)
 *   5% do 40% -> ±3.0% (składnik średni)
 *   0% do 5%   -> ±2.0% (śladowy / zanieczyszczenia polowe)
 * - Tryb adaptacyjny laboratoryjny ('adaptive' - dla monokryształów):
 *   > 40% masy -> ±3.0%
 *   5% do 40% -> ±2.0%
 *   0% do 5%   -> ±1.0%
 * - Tryb stały ('fixed'):
 *   Wartość wybrana suwakiem (np. 1.0%, 2.0%, 3.0%, 4.0%, 5.0%, 6.0%, 8.0%)
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

  if (config.mode === 'field') {
    if (c > 40.0) {
      return { tolerance: 4.0, tierLabel: `>40% (±4.0%)` };
    }
    if (c >= 5.0) {
      return { tolerance: 3.0, tierLabel: `5-40% (±3.0%)` };
    }
    return { tolerance: 2.0, tierLabel: `<5% (±2.0%)` };
  }

  // mode === 'adaptive'
  if (c > 40.0) {
    return { tolerance: 3.0, tierLabel: `>40% (±3.0%)` };
  }
  if (c >= 5.0) {
    return { tolerance: 2.0, tierLabel: `5-40% (±2.0%)` };
  }
  return { tolerance: 1.0, tierLabel: `<5% (±1.0%)` };
}

/**
 * Powszechne domieszki skały macierzystej (matrycy) w naturalnych próbkach geologicznych
 */
const FIELD_MATRIX_ELEMENTS: Record<string, { maxPercent: number; source: string }> = {
  Si: { maxPercent: 12.0, source: 'Kwarc / krzemionka skały macierzystej (SiO₂)' },
  Ca: { maxPercent: 10.0, source: 'Kalcyt / dolomit skały węglanowej (CaCO₃)' },
  Fe: { maxPercent: 8.0, source: 'Tlenki / wodorotlenki żelaza (hematyt, getyt, limonite, gossan)' },
  Al: { maxPercent: 6.0, source: 'Minerały ilaste / skała płonna' },
  Mg: { maxPercent: 5.0, source: 'Krzemiany lub węglany magnezowe matrycy' },
  K: { maxPercent: 4.0, source: 'Skalenie potasowe skały macierzystej' }
};

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
 * Prawidłowo traktuje tlenki: w tlenkach tlen jest stechiometrycznie związany,
 * więc nie jest liczony jako brakujące pierwiastki lekkie!
 */
export function normalizeSampleElements(
  elements: DetectedElement[]
): {
  normalized: Record<string, number>;
  rawMap: Record<string, number>;
  rawTotal: number;
  visibleTotal: number;
  sampleLightPercent: number;
  isOxideConverted: boolean;
} {
  const isOxideConverted = elements.some((e) => e.isOxideConverted || e.symbol.toUpperCase() === 'LOI');
  const loiElement = elements.find((e) => e.symbol.toUpperCase() === 'LOI');

  const visibleElements = elements.filter(
    (e) => e.value > 0 && !isLightElement(e.symbol) && e.symbol.toUpperCase() !== 'LOI'
  );

  const rawMap: Record<string, number> = {};
  elements.forEach((e) => {
    if (e.value > 0 && e.symbol.toUpperCase() !== 'LOI') {
      rawMap[e.symbol] = Number(e.value);
    }
  });

  const rawTotal = elements.reduce((sum, e) => sum + (Number(e.value) || 0), 0);
  const visibleTotal = visibleElements.reduce((sum, e) => sum + (Number(e.value) || 0), 0);

  // W trybie tlenkowym (Mining Oxides) tlen jest stechiometrycznie związany w tlenkach (SiO2, Al2O3, CaO itd.).
  // Tlenki to związki pierwiastków Z >= 11 z tlenem, a nie brakujące pierwiastki lekkie!
  // Jedynym prawdziwym udziałem pierwiastków lekkich w analizie tlenkowej jest LOI (Loss on Ignition), jeśli podano.
  let sampleLightPercent = 0;
  if (isOxideConverted) {
    sampleLightPercent = loiElement ? Number(loiElement.value.toFixed(2)) : 0;
  } else {
    sampleLightPercent = loiElement
      ? Number(loiElement.value.toFixed(2))
      : (rawTotal > 0 && rawTotal < 95.0 ? Number((100 - rawTotal).toFixed(2)) : 0);
  }

  const normalized: Record<string, number> = {};

  if (visibleTotal > 0) {
    visibleElements.forEach((e) => {
      normalized[e.symbol] = Number(((e.value / visibleTotal) * 100).toFixed(2));
    });
  }

  return { normalized, rawMap, rawTotal, visibleTotal, sampleLightPercent, isOxideConverted };
}

/**
 * Oblicza liczby moli n = m / M dla widzialnych pierwiastków
 */
export function calculateMoles(
  weights: Record<string, number>
): Record<string, number> {
  const moles: Record<string, number> = {};

  for (const [sym, weight] of Object.entries(weights)) {
    const mass = getAtomicMass(sym);
    if (mass > 0) {
      moles[sym] = weight / mass;
    }
  }

  return moles;
}

/**
 * Generuje unikalny odcisk stechiometryczny minerału, aby wykrywać polimorfy
 */
function getStoichiometryFingerprint(min: MineralDefinition): string {
  return Object.entries(min.totalWeightPercent)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([sym, pct]) => `${sym}:${Math.round(pct * 2) / 2}`)
    .join('|');
}

/**
 * Główny algorytm porównujący próbkę ze wszystkimi minerałami w bazie.
 * Obsługuje:
 * 1. Pomiary bezwzględne XRF (np. Turkus: Al 19.82%, P 15.24%, Cu 7.85%)
 * 2. Pomiary znormalizowane do 100% (stopy, minerały bezwodny)
 * 3. Przeliczone tlenki (Mining Oxides) - nie nalicza fałszywych 53% błędu Z<11
 * 4. Powszechne domieszki skały macierzystej (matryca kwarcowa Si, kalcytowa Ca, tlenki żelaza Fe)
 * 5. Podstawienia izomorficzne (np. Fe3+ za Al3+ w turkusie)
 * 6. Automatyczne wykrywanie polimorfów i stopów technicznych
 */
export function identifyMinerals(
  detectedElements: DetectedElement[],
  toleranceConfig: ToleranceConfig = DEFAULT_TOLERANCE_CONFIG,
  database: MineralDefinition[] = MINERALS_DATABASE
): MatchScore[] {
  const { normalized: sampleNorm, rawMap: sampleRaw, rawTotal, visibleTotal, sampleLightPercent, isOxideConverted } =
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
    const diagSymbols = Object.keys(minVisible);

    // Sprawdź czy próbka jest mierzona bezwzględnie (np. spektrometr podał Al: 19.82%, P: 15.24%, Cu: 7.85%)
    // W takim trybie zmierzone wartości odpowiadają bezpośrednio mineral.totalWeightPercent
    const isDirectMassCandidate =
      rawTotal < 92.0 &&
      diagSymbols.length > 0 &&
      diagSymbols.every((sym) => {
        const s = sampleRaw[sym] || 0;
        const theoTotal = mineral.totalWeightPercent[sym] || 0;
        return s > 0 && theoTotal > 0 && Math.abs(s - theoTotal) <= 8.0;
      });

    // Wybór zestawu wartości próbki i wzorca do porównania:
    // Wzorzec wzorcowy: jeśli kandydat na masę bezpośrednią, porównujemy do totalWeightPercent
    const useDirectMass = isDirectMassCandidate;

    const sampleToCompare: Record<string, number> = useDirectMass ? sampleRaw : sampleNorm;
    const mineralToCompare: Record<string, number> = useDirectMass ? mineral.totalWeightPercent : minVisible;

    // Wszystkie pierwiastki do porównania
    const allSymbols = Array.from(
      new Set([...Object.keys(sampleToCompare), ...Object.keys(mineralToCompare)])
    );

    let sumSquaredDiff = 0;
    let diagElementsWithinTolerance = 0;
    let diagTotalCompared = 0;
    let maxElementDifference = 0;
    let maxDiffSymbol = '';
    let totalExcessError = 0;

    const matrixInclusions: MatrixInclusion[] = [];
    const isomorphicSubstitutions: IsomorphicSubstitution[] = [];
    const elementComparison: ElementComparisonResult[] = [];

    // Sprawdź specjalne podstawienie izomorficzne Fe za Al w turkusie (seria turkus - chalcosyderyt)
    let hasFeForAlSubstitution = false;
    if (mineral.id.includes('turquoise') && sampleToCompare['Fe'] && sampleToCompare['Fe'] > 0 && sampleToCompare['Fe'] <= 5.0) {
      hasFeForAlSubstitution = true;
      isomorphicSubstitutions.push({
        substitutedElement: 'Fe',
        targetElement: 'Al',
        percent: sampleToCompare['Fe'],
        seriesName: 'Szereg turkus – chalcosyderyt (podstawienie Fe³⁺ za Al³⁺)'
      });
    }

    allSymbols.forEach((sym) => {
      // Ignorujemy pierwiastki lekkie w porównaniu bezpośrednim metali
      if (isLightElement(sym)) return;

      const sVal = sampleToCompare[sym] || 0;
      const mVal = mineralToCompare[sym] || 0;
      const diff = Math.abs(sVal - mVal);

      // Sprawdź czy to pierwiastek diagnostyczny minerału
      const isDiagnostic = (mineralToCompare[sym] || 0) > 0;

      // Oblicz dynamiczną widełkę tolerancji
      const refConcentration = Math.max(sVal, mVal);
      const { tolerance: tolPct, tierLabel } = getElementTolerance(refConcentration, toleranceConfig);

      const toleranceMin = Math.max(0, mVal - tolPct);
      const toleranceMax = Math.min(100, mVal + tolPct);

      let withinTolerance = diff <= tolPct;

      // Obsługa matrycy geologicznej w trybie polowym ('field')
      let isMatrixComponent = false;
      if (toleranceConfig.mode === 'field' && !isDiagnostic && sVal > 0) {
        if (sym === 'Fe' && hasFeForAlSubstitution) {
          withinTolerance = true;
        } else if (FIELD_MATRIX_ELEMENTS[sym] && sVal <= FIELD_MATRIX_ELEMENTS[sym].maxPercent) {
          withinTolerance = true;
          isMatrixComponent = true;
          matrixInclusions.push({
            symbol: sym,
            percent: sVal,
            mineralSource: FIELD_MATRIX_ELEMENTS[sym].source
          });
        }
      }

      if (sVal > 0 || mVal > 0) {
        if (isDiagnostic) {
          diagTotalCompared++;
          if (withinTolerance) diagElementsWithinTolerance++;
          sumSquaredDiff += Math.pow(diff, 2);
        } else if (!isMatrixComponent && !(sym === 'Fe' && hasFeForAlSubstitution)) {
          sumSquaredDiff += Math.pow(diff, 2);
        }

        if (!withinTolerance) {
          totalExcessError += (diff - tolPct);
          if (diff > maxElementDifference) {
            maxElementDifference = diff;
            maxDiffSymbol = sym;
          }
        }

        elementComparison.push({
          symbol: sym,
          samplePercent: Number(sVal.toFixed(2)),
          theoreticalPercent: Number(mVal.toFixed(2)),
          difference: Number(diff.toFixed(2)),
          withinTolerance,
          toleranceMin: Number(toleranceMin.toFixed(2)),
          toleranceMax: Number(toleranceMax.toFixed(2)),
          appliedTolerance: tolPct,
          tierLabel: isMatrixComponent ? `${tierLabel} [Matryca]` : tierLabel
        });
      }
    });

    const euclideanDist = Math.sqrt(sumSquaredDiff);

    // Sprawdzenie bilansu pierwiastków lekkich:
    // W trybie tlenkowym (isOxideConverted) tlen nie jest brakującym pierwiastkiem lekkim!
    const { tolerance: lightTol } = getElementTolerance(mineral.lightElementsPercent, toleranceConfig);
    const lightDiff = Math.abs(sampleLightPercent - mineral.lightElementsPercent);
    const lightWithinTolerance = isOxideConverted || sampleLightPercent === 0 || lightDiff <= (lightTol + 3.0);

    if (!isOxideConverted && sampleLightPercent > 0 && !lightWithinTolerance) {
      const excessLight = lightDiff - lightTol;
      if (excessLight > maxElementDifference) {
        maxElementDifference = lightDiff;
        maxDiffSymbol = 'Lekkie (Z<11)';
      }
      totalExcessError += excessLight;
    }

    // Minerał jest zweryfikowany, gdy wszystkie składniki diagnostyczne mieszczą się w tolerancji
    // oraz nie ma niewyjaśnionych obcych pierwiastków poza matrycą
    const allDiagWithinTolerance = diagTotalCompared > 0 && diagElementsWithinTolerance === diagTotalCompared;
    const isVerified = allDiagWithinTolerance && lightWithinTolerance && totalExcessError === 0;

    // Punktacja
    let score = 0;
    let confidenceTier: MatchScore['confidenceTier'] = 'unlikely';

    if (isVerified) {
      score = Math.max(90.0, 99.8 - euclideanDist * 1.5);
      confidenceTier = 'high';
    } else {
      if (allDiagWithinTolerance && totalExcessError <= 6.0) {
        score = Math.max(68.0, 88.0 - totalExcessError * 3.0);
        confidenceTier = 'medium';
      } else if (maxElementDifference > 15 || totalExcessError > 20) {
        score = Math.max(5.0, Math.min(25.0, 35 - maxElementDifference * 0.8));
        confidenceTier = 'unlikely';
      } else if (maxElementDifference > 6 || totalExcessError > 10) {
        score = Math.max(15.0, Math.min(45.0, 55 - maxElementDifference * 1.8));
        confidenceTier = 'unlikely';
      } else {
        score = Math.max(48.0, Math.min(68.0, 78 - maxElementDifference * 3.0));
        confidenceTier = 'low';
      }
    }

    // Stosunki molowe
    const molarRatioDetails: MatchScore['molarRatioDetails'] = [];
    if (mineral.keyMolarRatios && (isVerified || confidenceTier === 'medium')) {
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

    score = Math.max(0, Math.min(99.8, score));

    // Generowanie zwięzłego opisu analitycznego
    let explanation = '';
    if (isVerified) {
      explanation = `Zweryfikowano! Wszystkie wykryte pierwiastki diagnostyczne mieszczą się w dopuszczalnym marginesie błędu od wzorca ${mineral.namePl}!`;
      if (matrixInclusions.length > 0) {
        const matStr = matrixInclusions.map((m) => `${m.symbol} (${m.percent}% - ${m.mineralSource})`).join(', ');
        explanation += ` Wykryto zgodną domieszkę matrycy skały macierzystej: ${matStr}.`;
      }
      if (isomorphicSubstitutions.length > 0) {
        const isoStr = isomorphicSubstitutions.map((i) => `${i.seriesName} (${i.substitutedElement}: ${i.percent}%)`).join(', ');
        explanation += ` Wykryto naturalne podstawienie izomorficzne: ${isoStr}.`;
      }
    } else {
      explanation = `Nie można zweryfikować jako ${mineral.namePl}: odchylenie składu przekracza dopuszczalny limit (największa różnica na ${maxDiffSymbol}: ${maxElementDifference.toFixed(1)}%). Minerał odrzucony.`;
    }

    if (mineral.lightElementsPercent > 0 && !isOxideConverted) {
      const lightBreakdownStr = Object.entries(mineral.lightElementsBreakdown)
        .map(([sym, pct]) => `${sym}: ${pct}%`)
        .join(', ');
      explanation += ` Wzór wymaga ${mineral.lightElementsPercent}% pierwiastków lekkich (${lightBreakdownStr}) niewidocznych dla XRF.`;
    }

    return {
      mineral,
      score: Number(score.toFixed(1)),
      confidenceTier,
      allElementsWithin2Percent: isVerified,
      isVerified,
      maxElementDifference: Number(maxElementDifference.toFixed(2)),
      maxDiffSymbol: maxDiffSymbol || 'Brak',
      appliedToleranceConfig: toleranceConfig,
      molarRatioDetails,
      matrixInclusions: matrixInclusions.length > 0 ? matrixInclusions : undefined,
      isomorphicSubstitutions: isomorphicSubstitutions.length > 0 ? isomorphicSubstitutions : undefined,
      isDirectMassMatch: useDirectMass,
      isOxideMode: isOxideConverted,
      elementComparison: elementComparison.sort((a, b) => b.samplePercent - a.samplePercent),
      lightElementInfo: {
        sampleLightPercent,
        theoreticalLightPercent: isOxideConverted ? 0 : mineral.lightElementsPercent,
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

  // Przypisz informacje o polimorfach i stopach
  sorted.forEach((match) => {
    match.technicalAlloyHint = technicalAlloyHint;

    const fg = getStoichiometryFingerprint(match.mineral);
    const group = fingerprintGroups.get(fg);

    if (group && group.length > 1) {
      const currentBaseName = match.mineral.namePl.split('(')[0].trim().toLowerCase();
      const currentBaseEn = match.mineral.nameEn.split('(')[0].trim().toLowerCase();

      const partnerNamesPl = group
        .filter((m) => m.namePl.split('(')[0].trim().toLowerCase() !== currentBaseName)
        .map((m) => m.namePl.split('(')[0].trim());

      const partnerNamesEn = group
        .filter((m) => m.nameEn.split('(')[0].trim().toLowerCase() !== currentBaseEn)
        .map((m) => m.nameEn.split('(')[0].trim());

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
        partnerNamesPl,
        partnerNamesEn,
        formula: match.mineral.formula,
        members,
        distinctionTip: `Minerał ${match.mineral.namePl} posiada polimorfa o identycznym składzie chemicznym w XRF (${match.mineral.formula}): ${partnerNamesPl.join(', ')}. Aby ustalić, który z nich masz w dłoni, sprawdź pokrój kryształów, twardość lub rysę.`
      };

      match.polymorphInfo = polymorphInfo;
    }
  });

  // 4. Inteligentna deduplikacja minerałów:
  // W bazie danych IMA/RRUFF występują warianty lub duble o tej samej nazwie polskiej
  // (np. pyroxmangite i pyroxmangite_759).
  // Usuwamy TYLKO techniczne duble tego samego minerału.
  // POLIMORFY O RÓŻNYCH NAZWACH (np. Piryt i Markasyt, Rodonit i Piroksmangit, Kalcyt i Aragonit)
  // SĄ ZACHOWYWANE I PREZENTOWANE JEDEN PO DRUGIM (EX-AEQUO)!
  const deduplicated: MatchScore[] = [];
  const seenMineralNames = new Set<string>();

  sorted.forEach((match) => {
    // Normalizowana nazwa główna minerału (bez nawiasów odmianowych)
    const baseName = match.mineral.namePl
      .split('(')[0]
      .trim()
      .toLowerCase();

    // Klucz deduplikacji uniemożliwia powtórzenie tego samego minerału (np. Piroksmangit dwukrotnie)
    if (!seenMineralNames.has(baseName)) {
      seenMineralNames.add(baseName);
      deduplicated.push(match);
    }
  });

  // 5. Przypisanie pozycji rankingowych oraz oznaczenie miejsc ex-aequo:
  // Jeśli dwa minerały mają ten sam skład chemiczny (polimorfy) lub identyczny wynik w tolerancji,
  // pojawiają się jeden po drugim z tą samą pozycją ex-aequo!
  let currentRank = 1;
  for (let i = 0; i < deduplicated.length; i++) {
    const current = deduplicated[i];
    const prev = i > 0 ? deduplicated[i - 1] : null;
    const next = i < deduplicated.length - 1 ? deduplicated[i + 1] : null;

    const sameScoreAsPrev = prev && Math.abs(prev.score - current.score) < 0.05;
    const isPolymorphWithPrev = prev && Boolean(
      current.polymorphInfo?.isPolymorph &&
      prev.polymorphInfo?.isPolymorph &&
      prev.polymorphInfo?.formula === current.polymorphInfo?.formula
    );

    const sameScoreAsNext = next && Math.abs(next.score - current.score) < 0.05;
    const isPolymorphWithNext = next && Boolean(
      current.polymorphInfo?.isPolymorph &&
      next.polymorphInfo?.isPolymorph &&
      next.polymorphInfo?.formula === current.polymorphInfo?.formula
    );

    const isExAequoWithPrev = sameScoreAsPrev || isPolymorphWithPrev;
    const isExAequoWithNext = sameScoreAsNext || isPolymorphWithNext;

    if (isExAequoWithPrev && prev) {
      current.rank = prev.rank;
      current.isExAequo = true;
      prev.isExAequo = true;
    } else {
      current.rank = currentRank;
      current.isExAequo = Boolean(isExAequoWithNext);
    }

    currentRank++;
  }

  return deduplicated;
}
