import { DetectedElement } from '@/types';
import { ELEMENTS } from '@/data/elements';

// Typowe pomyłki OCR dla wyświetlaczy spektrometrów i LCD
const OCR_TYPO_MAP: Record<string, string> = {
  '5I': 'Si',
  '5i': 'Si',
  'S1': 'Si',
  's1': 'Si',
  'SI': 'Si',
  'FE': 'Fe',
  'CA': 'Ca',
  'MG': 'Mg',
  'AL': 'Al',
  'A1': 'Al',
  'TI': 'Ti',
  'T1': 'Ti',
  'MN': 'Mn',
  'CU': 'Cu',
  'ZN': 'Zn',
  'PB': 'Pb',
  'Pb': 'Pb',
  'AS': 'As',
  'BA': 'Ba',
  'SR': 'Sr',
  'ZR': 'Zr',
  'MO': 'Mo',
  'AG': 'Ag',
  'AU': 'Au',
  'HG': 'Hg',
  'SN': 'Sn',
  'SB': 'Sb',
  'CR': 'Cr',
  'NI': 'Ni',
  'CO': 'Co'
};

// Masy molowe do ewentualnego przeliczenia tlenków na czysty pierwiastek
const OXIDE_FACTORS: Record<string, { element: string; factor: number }> = {
  SIO2: { element: 'Si', factor: 28.085 / 60.083 }, // ~0.4674
  AL2O3: { element: 'Al', factor: (28.085 * 2) / 101.96 }, // ~0.5292
  FE2O3: { element: 'Fe', factor: (55.845 * 2) / 159.69 }, // ~0.6994
  FEO: { element: 'Fe', factor: 55.845 / 71.844 }, // ~0.7773
  CAO: { element: 'Ca', factor: 40.078 / 56.077 }, // ~0.7147
  MGO: { element: 'Mg', factor: 24.305 / 40.304 }, // ~0.6030
  TIO2: { element: 'Ti', factor: 47.867 / 79.866 }, // ~0.5993
  MNO: { element: 'Mn', factor: 54.938 / 70.937 }, // ~0.7745
  K2O: { element: 'K', factor: (39.098 * 2) / 94.2 }, // ~0.8301
  NA2O: { element: 'Na', factor: (22.99 * 2) / 61.98 } // ~0.7419
};

/**
 * Normalizuje symbol pierwiastka (koryguje wielkość liter oraz błędy OCR)
 */
export function normalizeElementSymbol(raw: string): string | null {
  const clean = raw.trim().replace(/[^a-zA-Z0-9]/g, '');
  if (!clean) return null;

  // 1. Sprawdź mapę literówek OCR
  if (OCR_TYPO_MAP[clean]) {
    return OCR_TYPO_MAP[clean];
  }
  if (OCR_TYPO_MAP[clean.toUpperCase()]) {
    return OCR_TYPO_MAP[clean.toUpperCase()];
  }

  // 2. Normalna konwersja (Pierwsza wielka, druga mała: np. "fe" -> "Fe", "AL" -> "Al")
  const standardSymbol = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  if (ELEMENTS[standardSymbol]) {
    return standardSymbol;
  }

  // 3. Sprawdź pojedynczą wielką literę (np. "K", "S", "P", "W")
  const singleUpper = clean.charAt(0).toUpperCase();
  if (clean.length === 1 && ELEMENTS[singleUpper]) {
    return singleUpper;
  }

  return null;
}

/**
 * Główna funkcja wyciągająca pierwiastki i ich zawartości procentowe ze skanu OCR
 */
export function parseXrfOcrText(rawText: string): DetectedElement[] {
  const resultsMap = new Map<string, DetectedElement>();

  // Dzielimy tekst na linie dla analizy wierszowej
  const lines = rawText.split(/\r?\n/);

  // Wzorce regex:
  // Wzorzec 1: [Symbol lub Tlenek] ... [wartość liczbowa]% (+/- błąd)
  // Np. "Fe 45.2 % +/- 0.3" lub "Fe: 45,2%" lub "5i 28.1%"
  const regexStandard = /([A-Za-z0-9]{1,5})\s*[:\t\-|=]?\s*([0-9]+[.,][0-9]+|[0-9]+)\s*(?:%|pct)?(?:\s*(?:\+\/-|±)\s*([0-9]+[.,][0-9]+))?/gi;

  // Wzorzec 2: Liczba z % na początku, potem symbol: "45.2% Fe"
  const regexInverted = /([0-9]+[.,][0-9]+|[0-9]+)\s*%\s*(?:of\s+)?([A-Za-z0-9]{1,4})/gi;

  // Wzorzec 3: Wartości w ppm: "Fe 45200 ppm"
  const regexPpm = /([A-Za-z0-9]{1,4})\s*[:\t\-|=]?\s*([0-9]+(?:[.,][0-9]+)?)\s*ppm/gi;

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Najpierw sprawdzamy ppm
    let matchPpm: RegExpExecArray | null;
    while ((matchPpm = regexPpm.exec(trimmed)) !== null) {
      const rawSym = matchPpm[1];
      const ppmVal = parseFloat(matchPpm[2].replace(',', '.'));
      const normSym = normalizeElementSymbol(rawSym);
      if (normSym && !isNaN(ppmVal) && ppmVal > 0) {
        const percentVal = parseFloat((ppmVal / 10000).toFixed(4));
        resultsMap.set(normSym, {
          id: `elem-${normSym}-${lineIdx}`,
          symbol: normSym,
          value: percentVal,
          rawDetectedSymbol: rawSym
        });
      }
    }

    // Wzorzec 1: Symbol -> Wartość
    let matchStd: RegExpExecArray | null;
    while ((matchStd = regexStandard.exec(trimmed)) !== null) {
      const rawSym = matchStd[1];
      const valStr = matchStd[2].replace(',', '.');
      const errStr = matchStd[3] ? matchStd[3].replace(',', '.') : undefined;
      const numVal = parseFloat(valStr);

      if (isNaN(numVal) || numVal < 0) continue;

      // Sprawdź czy to nie tlenek (np. SiO2)
      const upperSym = rawSym.toUpperCase();
      if (OXIDE_FACTORS[upperSym]) {
        const oxide = OXIDE_FACTORS[upperSym];
        const converted = parseFloat((numVal * oxide.factor).toFixed(2));
        resultsMap.set(oxide.element, {
          id: `elem-${oxide.element}-${lineIdx}`,
          symbol: oxide.element,
          value: converted,
          errorMargin: errStr ? parseFloat(errStr) : undefined,
          rawDetectedSymbol: rawSym
        });
        continue;
      }

      const normSym = normalizeElementSymbol(rawSym);
      if (normSym) {
        resultsMap.set(normSym, {
          id: `elem-${normSym}-${lineIdx}`,
          symbol: normSym,
          value: numVal,
          errorMargin: errStr ? parseFloat(errStr) : undefined,
          rawDetectedSymbol: rawSym
        });
      }
    }

    // Wzorzec 2: Wartość -> Symbol
    let matchInv: RegExpExecArray | null;
    while ((matchInv = regexInverted.exec(trimmed)) !== null) {
      const valStr = matchInv[1].replace(',', '.');
      const rawSym = matchInv[2];
      const numVal = parseFloat(valStr);
      if (isNaN(numVal) || numVal < 0) continue;

      const normSym = normalizeElementSymbol(rawSym);
      if (normSym) {
        resultsMap.set(normSym, {
          id: `elem-${normSym}-${lineIdx}`,
          symbol: normSym,
          value: numVal,
          rawDetectedSymbol: rawSym
        });
      }
    }
  });

  return Array.from(resultsMap.values()).sort((a, b) => b.value - a.value);
}
