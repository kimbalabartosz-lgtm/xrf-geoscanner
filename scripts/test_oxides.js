const rawText = `Mining Oxides 2P 45kV
Today, 3:59 PM 2709

LOI: 7.1600 ± 0%
SiO2: 64.6 ± 0.3%
Al2O3: 14.4 ± 0.3%
Fe2O3: 5.50 ± 0.03%
CaO: 2.701 ± 0.024%
K2O: 2.60 ± 0.03%
MgO: 1.8 ± 0.6%
TiO2: 0.608 ± 0.012%
MnO: 0.096 ± 0.009%
BaO: 0.092 ± 0.007%
P2O5: 0.09 ± 0.07%
SO2: 0.076 ± 0.007%
Cr2O3: 0.054 ± 0.013%
V2O5: 0.031 ± 0.025%`;

const OXIDE_FACTORS = {
  SIO2: { element: 'Si', factor: 28.085 / 60.083 },
  AL2O3: { element: 'Al', factor: (26.9815 * 2) / 101.96 },
  FE2O3: { element: 'Fe', factor: (55.845 * 2) / 159.69 },
  FEO: { element: 'Fe', factor: 55.845 / 71.844 },
  CAO: { element: 'Ca', factor: 40.078 / 56.077 },
  MGO: { element: 'Mg', factor: 24.305 / 40.304 },
  TIO2: { element: 'Ti', factor: 47.867 / 79.866 },
  MNO: { element: 'Mn', factor: 54.938 / 70.937 },
  K2O: { element: 'K', factor: (39.0983 * 2) / 94.2 },
  NA2O: { element: 'Na', factor: (22.9897 * 2) / 61.98 },
  BAO: { element: 'Ba', factor: 137.33 / 153.33 },
  P2O5: { element: 'P', factor: (30.974 * 2) / 141.94 },
  SO2: { element: 'S', factor: 32.065 / 64.06 },
  SO3: { element: 'S', factor: 32.065 / 80.06 },
  CR2O3: { element: 'Cr', factor: (51.996 * 2) / 151.99 },
  V2O5: { element: 'V', factor: (50.9415 * 2) / 181.88 },
  ZRO2: { element: 'Zr', factor: 91.224 / 123.22 }
};

const regexRow = /^([A-Za-z0-9\(\)\[\]%:_|\-]{1,10})\s*[:\t\-|=]?\s*([0-9]+[.,][0-9]+|[0-9]+)\s*(?:%|pct|ppm)?(?:\s*(?:\+\/-|±)\s*([0-9]+[.,][0-9]+))?/i;

const lines = rawText.split(/\r?\n/);
const parsedElements = [];
let detectedLoi = null;

lines.forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  if (trimmed.toUpperCase().includes('MINING OXIDES') || trimmed.toUpperCase().includes('TODAY')) return;

  const match = regexRow.exec(trimmed);
  if (match) {
    const rawSym = match[1];
    const valStr = match[2];
    const errStr = match[3];
    const cleanSymUpper = rawSym.replace(/[\(\)\[\]%:|\-=_,\.]/g, '').toUpperCase();
    const val = parseFloat(valStr.replace(',', '.'));

    if (cleanSymUpper === 'LOI') {
      detectedLoi = val;
      console.log(`[LOI Wykryte]: ${val}% (Straty prażenia / pierwiastki lekkie H2O + CO2)`);
      return;
    }

    if (OXIDE_FACTORS[cleanSymUpper]) {
      const oxide = OXIDE_FACTORS[cleanSymUpper];
      const elementValue = parseFloat((val * oxide.factor).toFixed(2));
      parsedElements.push({
        rawOxide: rawSym,
        oxideVal: val,
        element: oxide.element,
        elementVal: elementValue,
        error: errStr
      });
    }
  }
});

console.log("Wyekstrahowane pierwiastki z tlenków:");
console.table(parsedElements);

const sumElements = parsedElements.reduce((s, e) => s + e.elementVal, 0);
console.log("Suma czystych pierwiastków (Z >= 11):", sumElements.toFixed(2) + "%");
console.log("Pozostały tlen + LOI (pierwiastki lekkie):", (100 - sumElements).toFixed(2) + "%");
