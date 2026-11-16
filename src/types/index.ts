export interface ChemicalElement {
  symbol: string;
  namePl: string;
  nameEn: string;
  atomicNumber: number; // Z
  atomicMass: number; // g/mol
  isLightElement: boolean; // Z < 11 (invisible to standard handheld XRF: H, He, Li, Be, B, C, N, O, F, Ne)
}

export interface DetectedElement {
  id: string;
  symbol: string;
  value: number; // in weight %
  errorMargin?: number; // +/- error if available
  rawDetectedSymbol?: string;
}

export interface MineralDiagnostic {
  hardness: string; // Skala Mohsa (np. "6 - 6.5")
  streak: string; // Rysa (np. "czarnozielona do czarnej")
  luster: string; // Połysk (np. "metaliczny")
  color: string; // Barwa (np. "mosiężnożółta, złocista")
  cleavage: string; // Łupliwość (np. "wyraźna, kostkowa")
  fracture: string; // Przełam (np. "muszlowy, nierówny")
  density: string; // Gęstość g/cm³ (np. "4.95 - 5.10")
  tests: string; // Cechy diagnostyczne / próby terenowe (np. "Iszczy przy uderzeniu stalą, brak reakcji z zimnym HCl")
  occurrence: string; // Występowanie i powiązania geologiczne
}

export interface MineralDefinition {
  id: string;
  namePl: string;
  nameEn: string;
  formula: string;
  mineralGroup: string; // np. "Siarczki", "Krzemiany", "Węglany", "Tlenki", "Siarczany", "Pierwiastki rodzime"
  // Pełny skład chemiczny (symbol pierwiastka -> liczba atomów we wzorze)
  stoichiometry: Record<string, number>;
  // Teoretyczny skład wagowy całkowity (%)
  totalWeightPercent: Record<string, number>;
  // Teoretyczny skład wagowy pierwiastków widzialnych przez XRF (Z >= 11, znormalizowany do 100%)
  xrfVisibleWeightPercent: Record<string, number>;
  // Kluczowe stosunki molowe (np. { "Fe/S": 0.5, "Cu/Fe": 1.0 })
  keyMolarRatios?: Record<string, number>;
  diagnostics: MineralDiagnostic;
  notes?: string;
}

export interface MatchScore {
  mineral: MineralDefinition;
  score: number; // 0 - 100%
  confidenceTier: 'high' | 'medium' | 'low' | 'unlikely';
  molarRatioDetails: {
    ratioName: string;
    sampleRatio: number;
    theoreticalRatio: number;
    differencePercent: number;
  }[];
  elementComparison: {
    symbol: string;
    samplePercent: number;
    theoreticalPercent: number;
    difference: number;
  }[];
  explanation: string;
}

export interface PreprocessingOptions {
  contrast: number; // -100 to 100
  brightness: number; // -100 to 100
  threshold: number; // 0 to 255 (0 = off/auto)
  grayscale: boolean;
  invert: boolean;
  rotation: number; // 0, 90, 180, 270
}
