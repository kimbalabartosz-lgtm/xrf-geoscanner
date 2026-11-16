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
  isOxideConverted?: boolean; // Czy wartość powstała z przeliczenia tlenku (np. SiO2 -> Si)
  originalOxideSymbol?: string; // np. "SiO2"
  originalOxideValue?: number; // np. 64.6
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

export type ToleranceMode = 'field' | 'adaptive' | 'fixed';

export interface ToleranceConfig {
  mode: ToleranceMode; // 'field' (terenowy geologiczny) | 'adaptive' (ścisły laboratoryjny) | 'fixed' (suwak)
  fixedValue: number; // 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0%
}

export interface ElementComparisonResult {
  symbol: string;
  samplePercent: number; // Zmierzony udział w próbce (%)
  theoreticalPercent: number; // Wzorzec teoretyczny (%)
  difference: number; // Odchylenie bezwzględne (%)
  withinTolerance: boolean; // Czy mieści się w wyznaczonych widełkach
  toleranceMin: number;
  toleranceMax: number;
  appliedTolerance: number; // Obliczona widełka (+- %) dla tego składnika
  tierLabel: string; // Etykieta progu np. ">40% (±3%)", "5-40% (±2%)", "<5% (±1%)"
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

export interface TechnicalAlloyMatch {
  name: string;
  grade: string;
  description: string;
}

export interface MatrixInclusion {
  symbol: string;
  percent: number;
  mineralSource: string; // np. "Kwarc / Krzemionka (SiO₂)", "Kalcyt / Skała węglanowa (CaCO₃)", "Tlenki żelaza / Gossan"
}

export interface IsomorphicSubstitution {
  substitutedElement: string; // np. "Fe"
  targetElement: string; // np. "Al"
  percent: number;
  seriesName: string; // np. "Szereg turkus - chalcosyderyt"
}

export interface MatchScore {
  mineral: MineralDefinition;
  score: number; // 0 - 100%
  confidenceTier: 'high' | 'medium' | 'low' | 'unlikely';
  allElementsWithin2Percent: boolean; // Czy WSZYSTKIE pierwiastki mieszczą się w widełkach +-2%
  isVerified: boolean; // Czy minerał jest zweryfikowany w wyznaczonym oknie tolerancji (wszystkie pierwiastki + bilans lekkich)
  maxElementDifference: number; // Największe odchylenie w % spośród porównywanych pierwiastków
  maxDiffSymbol: string; // Symbol pierwiastka z największym odchyleniem
  appliedToleranceConfig?: ToleranceConfig; // Konfiguracja tolerancji użyta do obliczeń
  polymorphInfo?: PolymorphInfo;
  technicalAlloyHint?: TechnicalAlloyMatch | null;
  matrixInclusions?: MatrixInclusion[];
  isomorphicSubstitutions?: IsomorphicSubstitution[];
  isDirectMassMatch?: boolean;
  isOxideMode?: boolean;
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
