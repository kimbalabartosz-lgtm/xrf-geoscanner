import { DetectedElement } from '@/types';
import { ELEMENTS } from '@/data/elements';

// Typowe pomyłki OCR dla wyświetlaczy spektrometrów i LCD
const OCR_TYPO_MAP: Record<string, string> = {
  // Cr (Chrom) - 'Cr' często mylone z 'or', '0r', 'Gr', 'Dr', 'CR'
  OR: 'Cr',
  '0R': 'Cr',
  CR: 'Cr',
  'CR%': 'Cr',
  'OR%': 'Cr',
  GR: 'Cr',

  // Mn (Mangan) - 'Mn' z nawiasem 'Mn(' mylone z 'M0', 'MO', 'MN'
  M0: 'Mn',
  'M0%': 'Mn',
  MO0: 'Mn',
  MN: 'Mn',
  'MN%': 'Mn',

  // Co (Kobalt) - 'Co(' mylone z 'Col', 'C0', 'COL'
  COL: 'Co',
  'COL%': 'Co',
  C0: 'Co',
  'C0%': 'Co',
  CO: 'Co',
  'CO%': 'Co',

  // Si (Krzem) - 'Si' mylone z '5i', '5I', 'S1', 's1', 'SI'
  '5I': 'Si',
  '5i': 'Si',
  S1: 'Si',
  s1: 'Si',
  SI: 'Si',
  'SI%': 'Si',

  // Al (Glin) - 'Al' mylone z 'A1', 'a1', 'AI', 'AL'
  A1: 'Al',
  a1: 'Al',
  AI: 'Al',
  AL: 'Al',
  'AL%': 'Al',

  // Ti (Tytan) - 'Ti' mylone z 'T1', 't1', 'TI'
  T1: 'Ti',
  t1: 'Ti',
  TI: 'Ti',
  'TI%': 'Ti',

  // Fe (Żelazo)
  FE: 'Fe',
  'FE%': 'Fe',

  // Ni (Nikiel)
  NI: 'Ni',
  'NI%': 'Ni',

  // Cu (Miedź)
  CU: 'Cu',
  'CU%': 'Cu',

  // Zn (Cynk)
  ZN: 'Zn',
  'ZN%': 'Zn',

  // Pb (Ołów)
  PB: 'Pb',
  'PB%': 'Pb',

  // Mo (Molibden)
  MO: 'Mo',
  'MO%': 'Mo',

  // Inne częste pierwiastki
  CA: 'Ca',
  'CA%': 'Ca',
  MG: 'Mg',
  'MG%': 'Mg',
  BA: 'Ba',
  SR: 'Sr',
  ZR: 'Zr',
  AS: 'As',
  SB: 'Sb',
  SN: 'Sn',
  BI: 'Bi',
  AU: 'Au',
  AG: 'Ag',
  PT: 'Pt',
  PD: 'Pd',
  W0: 'W',
  WO: 'W',
  V0: 'V',
  CL: 'Cl',
  C1: 'Cl',
  NA: 'Na',
  NB: 'Nb',
  TA: 'Ta',
  TH: 'Th',
  U0: 'U'
};

// Masy molowe i współczynniki stechiometryczne do przeliczenia tlenków na czyste pierwiastki
const OXIDE_FACTORS: Record<string, { element: string; factor: number; formulaLabel: string }> = {
  SIO2: { element: 'Si', factor: 28.085 / 60.083, formulaLabel: 'SiO₂' },
  AL2O3: { element: 'Al', factor: (26.9815 * 2) / 101.96, formulaLabel: 'Al₂O₃' },
  FE2O3: { element: 'Fe', factor: (55.845 * 2) / 159.69, formulaLabel: 'Fe₂O₃' },
  FEO: { element: 'Fe', factor: 55.845 / 71.844, formulaLabel: 'FeO' },
  CAO: { element: 'Ca', factor: 40.078 / 56.077, formulaLabel: 'CaO' },
  MGO: { element: 'Mg', factor: 24.305 / 40.304, formulaLabel: 'MgO' },
  TIO2: { element: 'Ti', factor: 47.867 / 79.866, formulaLabel: 'TiO₂' },
  MNO: { element: 'Mn', factor: 54.938 / 70.937, formulaLabel: 'MnO' },
  K2O: { element: 'K', factor: (39.0983 * 2) / 94.2, formulaLabel: 'K₂O' },
  NA2O: { element: 'Na', factor: (22.9897 * 2) / 61.98, formulaLabel: 'Na₂O' },
  BAO: { element: 'Ba', factor: 137.33 / 153.33, formulaLabel: 'BaO' },
  P2O5: { element: 'P', factor: (30.974 * 2) / 141.94, formulaLabel: 'P₂O₅' },
  SO2: { element: 'S', factor: 32.065 / 64.06, formulaLabel: 'SO₂' },
  SO3: { element: 'S', factor: 32.065 / 80.06, formulaLabel: 'SO₃' },
  CR2O3: { element: 'Cr', factor: (51.996 * 2) / 151.99, formulaLabel: 'Cr₂O₃' },
  V2O5: { element: 'V', factor: (50.9415 * 2) / 181.88, formulaLabel: 'V₂O₅' },
  ZRO2: { element: 'Zr', factor: 91.224 / 123.22, formulaLabel: 'ZrO₂' },
  ZNO: { element: 'Zn', factor: 65.38 / 81.38, formulaLabel: 'ZnO' },
  CUO: { element: 'Cu', factor: 63.546 / 79.55, formulaLabel: 'CuO' },
  PBO: { element: 'Pb', factor: 207.2 / 223.2, formulaLabel: 'PbO' },
  NIO: { element: 'Ni', factor: 58.69 / 74.69, formulaLabel: 'NiO' },
  COO: { element: 'Co', factor: 58.93 / 74.93, formulaLabel: 'CoO' },
  SRO: { element: 'Sr', factor: 87.62 / 103.62, formulaLabel: 'SrO' },
  RB2O: { element: 'Rb', factor: (85.47 * 2) / 186.94, formulaLabel: 'Rb₂O' },
  Y2O3: { element: 'Y', factor: (88.91 * 2) / 225.81, formulaLabel: 'Y₂O₃' },
  NB2O5: { element: 'Nb', factor: (92.91 * 2) / 265.81, formulaLabel: 'Nb₂O₅' },
  MOO3: { element: 'Mo', factor: 95.95 / 143.94, formulaLabel: 'MoO₃' },
  WO3: { element: 'W', factor: 183.84 / 231.84, formulaLabel: 'WO₃' },
  AS2O3: { element: 'As', factor: (74.92 * 2) / 197.84, formulaLabel: 'As₂O₃' },
  THO2: { element: 'Th', factor: 232.04 / 264.04, formulaLabel: 'ThO₂' },
  UO2: { element: 'U', factor: 238.03 / 270.03, formulaLabel: 'UO₂' },
  U3O8: { element: 'U', factor: (238.03 * 3) / 842.08, formulaLabel: 'U₃O₈' }
};

// Słowa kluczowe nagłówków i metadanych spektrometrów do odrzucenia
const NOISE_WORDS = [
  'ELEMENT',
  'RESULT',
  'TEST',
  'COMPLETED',
  'STATISTIC',
  'STATISTICS',
  'THETESTMAP',
  'THE TEST',
  'USER',
  'SPECTRUM',
  'LIVE TIME',
  'REAL TIME',
  'CPS',
  '20KV',
  '0UA',
  'SETTING',
  'SETTINGS',
  'OPERATING',
  'GRADE',
  'MATCH',
  'MODEL',
  'CALIBRATION'
];

/**
 * Normalizuje surowy symbol pierwiastka:
 * - usuwa nawiasy, procenty i separatory: "Fe(%)" -> "Fe", "or%" -> "Cr", "M0%" -> "Mn"
 * - sprawdza tabelę typowych pomyłek OCR
 * - weryfikuje istnienie w układzie okresowym (ELEMENTS)
 */
export function normalizeElementSymbol(raw: string): string | null {
  // Usuń nawiasy, procenty, spacje i separatory
  const clean = raw.trim().replace(/[\(\)\[\]%:|\-=_,\.]/g, '');
  if (!clean || clean.length > 5) return null;

  const upper = clean.toUpperCase();

  // Sprawdź czy to nie słowo szumowe (np. "TEST", "USER")
  if (NOISE_WORDS.includes(upper)) {
    return null;
  }

  // 1. Sprawdź mapę literówek OCR
  if (OCR_TYPO_MAP[clean]) {
    return OCR_TYPO_MAP[clean];
  }
  if (OCR_TYPO_MAP[upper]) {
    return OCR_TYPO_MAP[upper];
  }

  // 2. Standardowa wielkość (np. "fe" -> "Fe", "AL" -> "Al", "CR" -> "Cr")
  const titleCase = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  if (ELEMENTS[titleCase]) {
    return titleCase;
  }

  // 3. Pojedyncza wielka litera (np. "K", "S", "P", "W", "V", "U", "Y", "B", "C", "N", "O", "F")
  const singleUpper = clean.charAt(0).toUpperCase();
  if (clean.length === 1 && ELEMENTS[singleUpper]) {
    return singleUpper;
  }

  return null;
}

/**
 * Inteligentna rekonstrukcja brakującej kropki dziesiętnej.
 * Na wyświetlaczach LCD i po binaryzacji miniaturowa 1-pikselowa kropka często znika w OCR:
 * Np. "1038" -> 10.38, "245" -> 2.45, "115" -> 1.15, "6787" -> 67.87
 */
export function reconstructMissingDecimal(valStr: string, numVal: number, hasPpm: boolean): number {
  if (hasPpm) {
    // W ppm wartości tysięczne są w 100% poprawne (np. 1038 ppm = 0.1038%)
    return parseFloat((numVal / 10000).toFixed(4));
  }

  // Jeśli wartość zawiera już kropkę lub przecinek, nic nie modyfikuj
  if (valStr.includes('.') || valStr.includes(',')) {
    return numVal;
  }

  // Jeśli brak kropki i wartość jest > 100% (co jest niemożliwe dla udziału pojedynczego pierwiastka):
  // Spektrometry wyświetlają niemal zawsze 2 miejsca po przecinku (xx.yy% lub x.yy%)
  if (numVal >= 100 && numVal <= 9999) {
    const fixed = numVal / 100.0;
    if (fixed <= 100.0) {
      return parseFloat(fixed.toFixed(2));
    }
  } else if (numVal >= 10000 && numVal <= 99999) {
    // 3 miejsca po przecinku (np. 10385 -> 10.385%)
    const fixed = numVal / 1000.0;
    if (fixed <= 100.0) {
      return parseFloat(fixed.toFixed(3));
    }
  }

  return numVal;
}

/**
 * Główna funkcja wyciągająca pierwiastki i ich zawartości procentowe ze skanu OCR.
 * Odporna na:
 * 1. Zlepione znaki procentu i nawiasów: "Fe(%) 67.87", "or% 17.08", "M0% 115"
 * 2. Zjedzone kropki dziesiętne: "Ni% 1038" -> Ni 10.38%, "Mo% 245" -> Mo 2.45%
 * 3. Zamiany liter przez OCR: "or%" -> Cr, "M0%" -> Mn, "Col%" -> Co, "5i" -> Si, "A1" -> Al
 * 4. Pomiary w ppm oraz tlenki (np. SiO2)
 */
export function parseXrfOcrText(rawText: string): DetectedElement[] {
  const resultsMap = new Map<string, DetectedElement>();
  const lines = rawText.split(/\r?\n/);

  // Wzorzec 1 (Standardowy wiersz tabeli):
  // [Symbol/Token np. Fe(%) lub or% lub Si:] ... [Wartość liczbowa np. 67.87 lub 1038] ... [opcjonalny błąd +/-]
  // Grupa 1: Token pierwiastka (może zawierać nawiasy, procent, dwukropek)
  // Grupa 2: Liczba (z kropką/przecinkiem lub bez)
  // Grupa 3: Opcjonalny błąd +/-
  const regexRow = /^([A-Za-z0-9\(\)\[\]%:_|\-]{1,10})\s*[:\t\-|=]?\s*([0-9]+[.,][0-9]+|[0-9]+)\s*(?:%|pct|ppm)?(?:\s*(?:\+\/-|±)\s*([0-9]+[.,][0-9]+))?/i;

  // Wzorzec 2 (Wartość przed symbolem): "67.87% Fe" lub "1038 ppm Ni"
  const regexInverted = /^([0-9]+[.,][0-9]+|[0-9]+)\s*(?:%|pct|ppm)?\s*(?:of\s+)?([A-Za-z0-9\(\)\[\]%]{1,10})/i;

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Sprawdź czy linia nie jest nagłówkiem
    const upperLine = trimmed.toUpperCase();
    if (upperLine.startsWith('ELEMENT') && upperLine.includes('RESULT')) return;
    if (upperLine.includes('TEST COMPLETED') || upperLine.includes('THE TEST STATISTIC')) return;

    const hasPpm = /\bppm\b/i.test(trimmed);

    // Próba dopasowania Wzorca 1 (Symbol -> Wartość)
    let match = regexRow.exec(trimmed);
    let rawSym = '';
    let valStr = '';
    let errStr: string | undefined = undefined;

    if (match) {
      rawSym = match[1];
      valStr = match[2];
      errStr = match[3];
    } else {
      // Próba dopasowania Wzorca 2 (Wartość -> Symbol)
      const matchInv = regexInverted.exec(trimmed);
      if (matchInv) {
        valStr = matchInv[1];
        rawSym = matchInv[2];
      }
    }

    // Jeśli regex na początku linii nie złapał, przeszukaj linię token po tokenie
    if (!rawSym || !valStr) {
      const tokens = trimmed.split(/[\s\t|]+/);
      if (tokens.length >= 2) {
        // Sprawdź czy pierwszy token wygląda jak pierwiastek, a drugi jak liczba
        const cleanFirst = tokens[0].replace(/[\(\)\[\]%:|\-=_,\.]/g, '');
        if (cleanFirst.length >= 1 && cleanFirst.length <= 5 && /^[0-9]+[.,]?[0-9]*$/.test(tokens[1])) {
          rawSym = tokens[0];
          valStr = tokens[1];
          if (tokens[2] && /^[0-9]+[.,]?[0-9]*$/.test(tokens[2])) {
            errStr = tokens[2];
          }
        }
      }
    }

    if (!rawSym || !valStr) return;

    const rawNum = parseFloat(valStr.replace(',', '.'));
    if (isNaN(rawNum) || rawNum < 0) return;

    // Rekonstrukcja brakującej kropki dziesiętnej
    const finalValue = reconstructMissingDecimal(valStr, rawNum, hasPpm);

    // Sprawdź czy to nie tlenek (np. SiO2, Al2O3, Fe2O3, CaO, K2O, BaO...)
    const cleanSymUpper = rawSym.replace(/[\(\)\[\]%:|\-=_,\.]/g, '').toUpperCase();

    // Specjalna obsługa LOI (Loss on Ignition - straty prażenia / pierwiastki lekkie H2O + CO2)
    if (cleanSymUpper === 'LOI') {
      return;
    }

    if (OXIDE_FACTORS[cleanSymUpper]) {
      const oxide = OXIDE_FACTORS[cleanSymUpper];
      const converted = parseFloat((finalValue * oxide.factor).toFixed(2));
      resultsMap.set(oxide.element, {
        id: `elem-${oxide.element}-${lineIdx}`,
        symbol: oxide.element,
        value: converted,
        errorMargin: errStr ? parseFloat(errStr.replace(',', '.')) : undefined,
        rawDetectedSymbol: rawSym,
        isOxideConverted: true,
        originalOxideSymbol: oxide.formulaLabel,
        originalOxideValue: finalValue
      });
      return;
    }

    // Normalizacja symbolu pierwiastka
    const normSym = normalizeElementSymbol(rawSym);
    if (normSym) {
      // Ignorujemy nierealne wartości > 100%
      if (finalValue > 100.0) return;

      resultsMap.set(normSym, {
        id: `elem-${normSym}-${lineIdx}`,
        symbol: normSym,
        value: finalValue,
        errorMargin: errStr ? parseFloat(errStr.replace(',', '.')) : undefined,
        rawDetectedSymbol: rawSym
      });
    }
  });

  return Array.from(resultsMap.values()).sort((a, b) => b.value - a.value);
}
