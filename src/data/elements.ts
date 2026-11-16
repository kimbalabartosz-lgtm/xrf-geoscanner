import { ChemicalElement } from '@/types';

export const ELEMENTS: Record<string, ChemicalElement> = {
  H: { symbol: 'H', namePl: 'Wodór', nameEn: 'Hydrogen', atomicNumber: 1, atomicMass: 1.008, isLightElement: true },
  He: { symbol: 'He', namePl: 'Hel', nameEn: 'Helium', atomicNumber: 2, atomicMass: 4.0026, isLightElement: true },
  Li: { symbol: 'Li', namePl: 'Lit', nameEn: 'Lithium', atomicNumber: 3, atomicMass: 6.94, isLightElement: true },
  Be: { symbol: 'Be', namePl: 'Beryl', nameEn: 'Beryllium', atomicNumber: 4, atomicMass: 9.0122, isLightElement: true },
  B: { symbol: 'B', namePl: 'Bor', nameEn: 'Boron', atomicNumber: 5, atomicMass: 10.81, isLightElement: true },
  C: { symbol: 'C', namePl: 'Węgiel', nameEn: 'Carbon', atomicNumber: 6, atomicMass: 12.011, isLightElement: true },
  N: { symbol: 'N', namePl: 'Azot', nameEn: 'Nitrogen', atomicNumber: 7, atomicMass: 14.007, isLightElement: true },
  O: { symbol: 'O', namePl: 'Tlen', nameEn: 'Oxygen', atomicNumber: 8, atomicMass: 15.999, isLightElement: true },
  F: { symbol: 'F', namePl: 'Fluor', nameEn: 'Fluorine', atomicNumber: 9, atomicMass: 18.998, isLightElement: true },
  Ne: { symbol: 'Ne', namePl: 'Neon', nameEn: 'Neon', atomicNumber: 10, atomicMass: 20.18, isLightElement: true },
  
  // Pierwiastki wykrywane przez XRF (Z >= 11)
  Na: { symbol: 'Na', namePl: 'Sód', nameEn: 'Sodium', atomicNumber: 11, atomicMass: 22.9897, isLightElement: false },
  Mg: { symbol: 'Mg', namePl: 'Magnez', nameEn: 'Magnesium', atomicNumber: 12, atomicMass: 24.305, isLightElement: false },
  Al: { symbol: 'Al', namePl: 'Glin (Aluminium)', nameEn: 'Aluminium', atomicNumber: 13, atomicMass: 26.9815, isLightElement: false },
  Si: { symbol: 'Si', namePl: 'Krzem', nameEn: 'Silicon', atomicNumber: 14, atomicMass: 28.085, isLightElement: false },
  P: { symbol: 'P', namePl: 'Fosfor', nameEn: 'Phosphorus', atomicNumber: 15, atomicMass: 30.9738, isLightElement: false },
  S: { symbol: 'S', namePl: 'Siarka', nameEn: 'Sulfur', atomicNumber: 16, atomicMass: 32.06, isLightElement: false },
  Cl: { symbol: 'Cl', namePl: 'Chlor', nameEn: 'Chlorine', atomicNumber: 17, atomicMass: 35.45, isLightElement: false },
  Ar: { symbol: 'Ar', namePl: 'Argon', nameEn: 'Argon', atomicNumber: 18, atomicMass: 39.948, isLightElement: false },
  K: { symbol: 'K', namePl: 'Potas', nameEn: 'Potassium', atomicNumber: 19, atomicMass: 39.0983, isLightElement: false },
  Ca: { symbol: 'Ca', namePl: 'Wapń', nameEn: 'Calcium', atomicNumber: 20, atomicMass: 40.078, isLightElement: false },
  Sc: { symbol: 'Sc', namePl: 'Skand', nameEn: 'Scandium', atomicNumber: 21, atomicMass: 44.9559, isLightElement: false },
  Ti: { symbol: 'Ti', namePl: 'Tytan', nameEn: 'Titanium', atomicNumber: 22, atomicMass: 47.867, isLightElement: false },
  V: { symbol: 'V', namePl: 'Wanad', nameEn: 'Vanadium', atomicNumber: 23, atomicMass: 50.9415, isLightElement: false },
  Cr: { symbol: 'Cr', namePl: 'Chrom', nameEn: 'Chromium', atomicNumber: 24, atomicMass: 51.9961, isLightElement: false },
  Mn: { symbol: 'Mn', namePl: 'Mangan', nameEn: 'Manganese', atomicNumber: 25, atomicMass: 54.938, isLightElement: false },
  Fe: { symbol: 'Fe', namePl: 'Żelazo', nameEn: 'Iron', atomicNumber: 26, atomicMass: 55.845, isLightElement: false },
  Co: { symbol: 'Co', namePl: 'Kobalt', nameEn: 'Cobalt', atomicNumber: 27, atomicMass: 58.9332, isLightElement: false },
  Ni: { symbol: 'Ni', namePl: 'Nikiel', nameEn: 'Nickel', atomicNumber: 28, atomicMass: 58.6934, isLightElement: false },
  Cu: { symbol: 'Cu', namePl: 'Miedź', nameEn: 'Copper', atomicNumber: 29, atomicMass: 63.546, isLightElement: false },
  Zn: { symbol: 'Zn', namePl: 'Cynk', nameEn: 'Zinc', atomicNumber: 30, atomicMass: 65.38, isLightElement: false },
  Ga: { symbol: 'Ga', namePl: 'Gal', nameEn: 'Gallium', atomicNumber: 31, atomicMass: 69.723, isLightElement: false },
  Ge: { symbol: 'Ge', namePl: 'German', nameEn: 'Germanium', atomicNumber: 32, atomicMass: 72.63, isLightElement: false },
  As: { symbol: 'As', namePl: 'Arsen', nameEn: 'Arsenic', atomicNumber: 33, atomicMass: 74.9216, isLightElement: false },
  Se: { symbol: 'Se', namePl: 'Selen', nameEn: 'Selenium', atomicNumber: 34, atomicMass: 78.971, isLightElement: false },
  Br: { symbol: 'Br', namePl: 'Brom', nameEn: 'Bromine', atomicNumber: 35, atomicMass: 79.904, isLightElement: false },
  Rb: { symbol: 'Rb', namePl: 'Rubid', nameEn: 'Rubidium', atomicNumber: 37, atomicMass: 85.4678, isLightElement: false },
  Sr: { symbol: 'Sr', namePl: 'Stront', nameEn: 'Strontium', atomicNumber: 38, atomicMass: 87.62, isLightElement: false },
  Y: { symbol: 'Y', namePl: 'Itr', nameEn: 'Yttrium', atomicNumber: 39, atomicMass: 88.9058, isLightElement: false },
  Zr: { symbol: 'Zr', namePl: 'Cyrkon', nameEn: 'Zirconium', atomicNumber: 40, atomicMass: 91.224, isLightElement: false },
  Nb: { symbol: 'Nb', namePl: 'Niob', nameEn: 'Niobium', atomicNumber: 41, atomicMass: 92.9064, isLightElement: false },
  Mo: { symbol: 'Mo', namePl: 'Molibden', nameEn: 'Molybdenum', atomicNumber: 42, atomicMass: 95.95, isLightElement: false },
  Ru: { symbol: 'Ru', namePl: 'Ruten', nameEn: 'Ruthenium', atomicNumber: 44, atomicMass: 101.07, isLightElement: false },
  Rh: { symbol: 'Rh', namePl: 'Rod', nameEn: 'Rhodium', atomicNumber: 45, atomicMass: 102.9055, isLightElement: false },
  Pd: { symbol: 'Pd', namePl: 'Pallad', nameEn: 'Palladium', atomicNumber: 46, atomicMass: 106.42, isLightElement: false },
  Ag: { symbol: 'Ag', namePl: 'Srebro', nameEn: 'Silver', atomicNumber: 47, atomicMass: 107.8682, isLightElement: false },
  Cd: { symbol: 'Cd', namePl: 'Kadm', nameEn: 'Cadmium', atomicNumber: 48, atomicMass: 112.414, isLightElement: false },
  In: { symbol: 'In', namePl: 'Ind', nameEn: 'Indium', atomicNumber: 49, atomicMass: 114.818, isLightElement: false },
  Sn: { symbol: 'Sn', namePl: 'Cyna', nameEn: 'Tin', atomicNumber: 50, atomicMass: 118.71, isLightElement: false },
  Sb: { symbol: 'Sb', namePl: 'Antymon', nameEn: 'Antimony', atomicNumber: 51, atomicMass: 121.76, isLightElement: false },
  Te: { symbol: 'Te', namePl: 'Tellur', nameEn: 'Tellurium', atomicNumber: 52, atomicMass: 127.6, isLightElement: false },
  I: { symbol: 'I', namePl: 'Jod', nameEn: 'Iodine', atomicNumber: 53, atomicMass: 126.9045, isLightElement: false },
  Cs: { symbol: 'Cs', namePl: 'Cez', nameEn: 'Caesium', atomicNumber: 55, atomicMass: 132.9055, isLightElement: false },
  Ba: { symbol: 'Ba', namePl: 'Bar', nameEn: 'Barium', atomicNumber: 56, atomicMass: 137.327, isLightElement: false },
  La: { symbol: 'La', namePl: 'Lantan', nameEn: 'Lanthanum', atomicNumber: 57, atomicMass: 138.9055, isLightElement: false },
  Ce: { symbol: 'Ce', namePl: 'Cer', nameEn: 'Cerium', atomicNumber: 58, atomicMass: 140.116, isLightElement: false },
  Nd: { symbol: 'Nd', namePl: 'Neodym', nameEn: 'Neodymium', atomicNumber: 60, atomicMass: 144.242, isLightElement: false },
  Ta: { symbol: 'Ta', namePl: 'Tantal', nameEn: 'Tantalum', atomicNumber: 73, atomicMass: 180.9479, isLightElement: false },
  W: { symbol: 'W', namePl: 'Wolfram', nameEn: 'Tungsten', atomicNumber: 74, atomicMass: 183.84, isLightElement: false },
  Re: { symbol: 'Re', namePl: 'Ren', nameEn: 'Rhenium', atomicNumber: 75, atomicMass: 186.207, isLightElement: false },
  Os: { symbol: 'Os', namePl: 'Osm', nameEn: 'Osmium', atomicNumber: 76, atomicMass: 190.23, isLightElement: false },
  Ir: { symbol: 'Ir', namePl: 'Iryd', nameEn: 'Iridium', atomicNumber: 77, atomicMass: 192.217, isLightElement: false },
  Pt: { symbol: 'Pt', namePl: 'Platyna', nameEn: 'Platinum', atomicNumber: 78, atomicMass: 195.084, isLightElement: false },
  Au: { symbol: 'Au', namePl: 'Złoto', nameEn: 'Gold', atomicNumber: 79, atomicMass: 196.9666, isLightElement: false },
  Hg: { symbol: 'Hg', namePl: 'Rtęć', nameEn: 'Mercury', atomicNumber: 80, atomicMass: 200.592, isLightElement: false },
  Tl: { symbol: 'Tl', namePl: 'Tal', nameEn: 'Thallium', atomicNumber: 81, atomicMass: 204.38, isLightElement: false },
  Pb: { symbol: 'Pb', namePl: 'Ołów', nameEn: 'Lead', atomicNumber: 82, atomicMass: 207.2, isLightElement: false },
  Bi: { symbol: 'Bi', namePl: 'Bizmut', nameEn: 'Bismuth', atomicNumber: 83, atomicMass: 208.9804, isLightElement: false },
  Th: { symbol: 'Th', namePl: 'Tor', nameEn: 'Thorium', atomicNumber: 90, atomicMass: 232.0377, isLightElement: false },
  U: { symbol: 'U', namePl: 'Uran', nameEn: 'Uranium', atomicNumber: 92, atomicMass: 238.0289, isLightElement: false }
};

// Pomocnicza funkcja do pobrania masy atomowej
export function getAtomicMass(symbol: string): number {
  return ELEMENTS[symbol]?.atomicMass || 0;
}

// Sprawdza czy pierwiastek jest lekki (niewidoczny dla standardowego ręcznego spektrometru XRF)
export function isLightElement(symbol: string): boolean {
  return ELEMENTS[symbol]?.isLightElement ?? false;
}
