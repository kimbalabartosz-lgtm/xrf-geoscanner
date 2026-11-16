const userRawText = `User
20kv Ou 13220
z Result
AFCA TI% 640
L7 85316
Test completed I
Element Result
Fe% 67.87
or% 17.08
Ni% 1038
Mo% 245
M0% 115
Col% 0.52
Result TheTestMap The Test Statistic
. 54
0 2 0
ps Re dpatrg gs`;

const OCR_TYPO_MAP = {
  'OR': 'Cr', '0R': 'Cr', 'CR': 'Cr', 'CR%': 'Cr', 'OR%': 'Cr',
  'M0': 'Mn', 'M0%': 'Mn', 'MO0': 'Mn', 'MN': 'Mn', 'MN%': 'Mn',
  'COL': 'Co', 'COL%': 'Co', 'C0': 'Co', 'CO': 'Co',
  '5I': 'Si', '5i': 'Si', 'S1': 'Si', 's1': 'Si', 'SI': 'Si',
  'A1': 'Al', 'AI': 'Al', 'AL': 'Al',
  'T1': 'Ti', 'TI': 'Ti',
  'FE': 'Fe', 'NI': 'Ni', 'CU': 'Cu', 'ZN': 'Zn', 'PB': 'Pb', 'MO': 'Mo'
};

const ELEMENTS = {
  H: true, He: true, Li: true, Be: true, B: true, C: true, N: true, O: true, F: true,
  Na: true, Mg: true, Al: true, Si: true, P: true, S: true, Cl: true, K: true, Ca: true,
  Sc: true, Ti: true, V: true, Cr: true, Mn: true, Fe: true, Co: true, Ni: true, Cu: true,
  Zn: true, Ga: true, Ge: true, As: true, Se: true, Br: true, Rb: true, Sr: true, Y: true,
  Zr: true, Nb: true, Mo: true, Ru: true, Rh: true, Pd: true, Ag: true, Cd: true, In: true,
  Sn: true, Sb: true, Te: true, I: true, Cs: true, Ba: true, La: true, Ce: true, Pr: true,
  Nd: true, Sm: true, Eu: true, Gd: true, Tb: true, Dy: true, Ho: true, Er: true, Tm: true,
  Yb: true, Lu: true, Hf: true, Ta: true, W: true, Re: true, Os: true, Ir: true, Pt: true,
  Au: true, Hg: true, Tl: true, Pb: true, Bi: true, Th: true, U: true
};

const NOISE_WORDS = ['ELEMENT', 'RESULT', 'TEST', 'COMPLETED', 'STATISTIC', 'THETESTMAP', 'USER', '20KV', 'OU', 'SETTINGS'];

function normalizeElementSymbol(raw) {
  const clean = raw.trim().replace(/[\(\)\[\]%:|\-=_,\.]/g, '');
  if (!clean || clean.length > 5) return null;
  const upper = clean.toUpperCase();
  if (NOISE_WORDS.includes(upper)) return null;
  if (OCR_TYPO_MAP[clean]) return OCR_TYPO_MAP[clean];
  if (OCR_TYPO_MAP[upper]) return OCR_TYPO_MAP[upper];
  const titleCase = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  if (ELEMENTS[titleCase]) return titleCase;
  const singleUpper = clean.charAt(0).toUpperCase();
  if (clean.length === 1 && ELEMENTS[singleUpper]) return singleUpper;
  return null;
}

function reconstructMissingDecimal(valStr, numVal, hasPpm) {
  if (hasPpm) return parseFloat((numVal / 10000).toFixed(4));
  if (valStr.includes('.') || valStr.includes(',')) return numVal;
  if (numVal >= 100 && numVal <= 9999) {
    const fixed = numVal / 100.0;
    if (fixed <= 100.0) return parseFloat(fixed.toFixed(2));
  }
  return numVal;
}

const regexRow = /^([A-Za-z0-9\(\)\[\]%:_|\-]{1,10})\s*[:\t\-|=]?\s*([0-9]+[.,][0-9]+|[0-9]+)\s*(?:%|pct|ppm)?(?:\s*(?:\+\/-|±)\s*([0-9]+[.,][0-9]+))?/i;

const results = [];
for (const line of userRawText.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed) continue;
  const match = regexRow.exec(trimmed);
  if (!match) continue;
  const rawSym = match[1];
  const valStr = match[2];
  const norm = normalizeElementSymbol(rawSym);
  if (norm) {
    const val = reconstructMissingDecimal(valStr, parseFloat(valStr), false);
    results.push({ symbol: norm, value: val, rawDetected: rawSym, rawValue: valStr });
  }
}

console.log('Wyniki ekstrakcji ze skanu użytkownika:');
console.table(results);
