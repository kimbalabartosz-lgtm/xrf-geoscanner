export interface ChemicalElement {
  symbol: string;
  namePl: string;
  nameEn: string;
  atomicNumber: number; // Z
  atomicMass: number; // g/mol
  isLightElement: boolean; // Z < 11 (niewidoczne dla XRF: H, He, Li, Be, B, C, N, O, F, Ne)
}

export interface DetectedElement {
  id: string;
  symbol: string;
  value: number; // w % wagowych
  errorMargin?: number; // +/- niepewność pomiarowa
  rawDetectedSymbol?: string;
}

export interface MineralDiagnostic {
  hardness: string; // Skala Mohsa (np. "6.0 - 6.5")
  streak: string; // Rysa (np. "wiśniowoczerwona")
  luster: string; // Połysk (np. "metaliczny")
  color: string; // Barwa (np. "mosiężnożółta, złocista")
  cleavage: string; // Łupliwość (np. "doskonała, kostkowa")
  fracture: string; // Przełam (np. "muszlowy, nierówny")
  density: string; // Gęstość g/cm³ (np. "4.95 - 5.10 g/cm³")
  tests: string; // Cechy diagnostyczne / próby terenowe (np. "Iskrzy przy uderzeniu, brak reakcji z zimnym HCl")
  occurrence: string; // Występowanie i środowisko geologiczne
}

export interface ToleranceWindow {
  expected: number; // Wartość wzorcowa %
  min: number; // Wzorzec - 2.0%
  max: number; // Wzorzec + 2.0%
}

export interface MineralDefinition {
  id: string;
  namePl: string;
  nameEn: string;
  formula: string;
  mineralGroup: string; // np. "Siarczki", "Krzemiany", "Węglany", "Tlenki", "Siarczany", "Pierwiastki rodzime"
  // Pełny skład stechiometryczny (symbol -> liczba atomów we wzorze)
  stoichiometry: Record<string, number>;
  // Teoretyczny całkowity skład wagowy (%)
  totalWeightPercent: Record<string, number>;
  // Udział pierwiastków lekkich (Z < 11: H, Li, Be, B, C, N, O, F) niewidocznych dla XRF
  lightElementsPercent: number;
  lightElementsBreakdown: Record<string, number>;
  lightElementsToleranceWindow: ToleranceWindow;
  // Teoretyczny udział pierwiastków widzialnych przez XRF (Z >= 11, znormalizowany do 100%)
  xrfVisibleWeightPercent: Record<string, number>;
  // Widełki tolerancji +-2% dla każdego widzialnego pierwiastka w XRF
  toleranceWindows: Record<string, ToleranceWindow>;
  // Kluczowe stosunki molowe (np. Fe/S: 0.5)
  keyMolarRatios?: Record<string, number>;
  diagnostics: MineralDiagnostic;
  notes?: string;
}

export interface ElementComparisonResult {
  symbol: string;
  samplePercent: number; // Zmierzony udział w próbce (%)
  theoreticalPercent: number; // Wzorzec teoretyczny (%)
  difference: number; // Odchylenie bezwzględne (%)
  withinTolerance: boolean; // Czy mieści się w widełkach +-2%
  toleranceMin: number;
  toleranceMax: number;
}

export interface PolymorphMember {
  id: string;
  namePl: string;
  nameEn: string;
  hardness: string;
  streak: string;
  color: string;
  cleavage: string;
  tests: string;
}

export interface PolymorphInfo {
  isPolymorph: boolean;
  combinedNamePl: string; // np. "Piryt / Markasyt" lub "Kalcyt / Aragonit"
  combinedNameEn: string; // np. "Pyrite / Marcasite"
  formula: string;
  members: PolymorphMember[];
  distinctionTip: string;
}

export interface MatchScore {
  mineral: MineralDefinition;
  score: number; // 0 - 100%
  confidenceTier: 'high' | 'medium' | 'low' | 'unlikely';
  allElementsWithin2Percent: boolean; // Czy WSZYSTKIE pierwiastki mieszczą się w widełkach +-2%
  polymorphInfo?: PolymorphInfo;
  molarRatioDetails: {
    ratioName: string;
    sampleRatio: number;
    theoreticalRatio: number;
    differencePercent: number;
  }[];
  elementComparison: ElementComparisonResult[];
  lightElementInfo: {
    sampleLightPercent: number; // Szacowany bilans pierwiastków lekkich w próbce
    theoreticalLightPercent: number;
    difference: number;
    withinTolerance: boolean; // Czy bilans lekkich mieści się w widełkach +-2%
  };
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
