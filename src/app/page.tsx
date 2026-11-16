'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageCanvasPreprocessor } from '@/components/ImageCanvasPreprocessor';
import { EditableElementsTable } from '@/components/EditableElementsTable';
import { RawOcrViewer } from '@/components/RawOcrViewer';
import { MineralResults } from '@/components/MineralResults';
import { DetectedElement, MatchScore, ToleranceConfig } from '@/types';
import { SamplePreset } from '@/data/samplePresets';
import { recognizeTextFromImage, OcrProgress } from '@/lib/ocr';
import { parseXrfOcrText } from '@/lib/regexParser';
import { autoPreprocessImage } from '@/lib/imageProcessing';
import { identifyMinerals, DEFAULT_TOLERANCE_CONFIG } from '@/lib/mineralMatcher';
import { CheckCircle2, AlertCircle, Sparkles, Loader2, RefreshCw, Sliders } from 'lucide-react';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [isOcrRunning, setIsOcrRunning] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<OcrProgress | null>(null);
  const [rawOcrText, setRawOcrText] = useState<string>('');
  const [detectedElements, setDetectedElements] = useState<DetectedElement[]>([]);
  const [results, setResults] = useState<MatchScore[]>([]);
  const [toleranceConfig, setToleranceConfig] = useState<ToleranceConfig>(DEFAULT_TOLERANCE_CONFIG);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [showAdvancedManual, setShowAdvancedManual] = useState<boolean>(false);

  // Obsługa wklejania ze schowka (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              if (dataUrl) {
                setOriginalImage(dataUrl);
                showNotification('Wklejono zdjęcie ze schowka! Uruchamiam automatyczną ekstrakcję...', 'info');
                runAutoScanPipeline(dataUrl, toleranceConfig);
              }
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [toleranceConfig]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 5000);
  };

  /**
   * AUTOMATYCZNY PIPELINE EKSTRAKCJI (Auto-Levels + Super-Resolution + Multi-Pass OCR)
   */
  const runAutoScanPipeline = async (imageSrc: string, tolCfg: ToleranceConfig = toleranceConfig) => {
    setIsOcrRunning(true);
    setResults([]);
    setOcrProgress({ status: 'Automatyczna optymalizacja histogramu (Auto-Levels)...', progress: 10 });

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Nie udało się załadować zdjęcia'));
        img.src = imageSrc;
      });

      // Przebieg 1: Auto-Levels Grayscale z Super-Resolution
      setOcrProgress({ status: 'Skanowanie spektrogramu XRF (Przebieg 1: Auto-Grayscale)...', progress: 30 });
      const pass1 = autoPreprocessImage(img, 'auto-levels', 0);

      const textPass1 = await recognizeTextFromImage(pass1.canvas, (p) => {
        setOcrProgress({
          status: `Rozpoznawanie tekstu Tesseract OCR: ${p.progress}%`,
          progress: 30 + Math.round(p.progress * 0.45)
        });
      });

      let parsed = parseXrfOcrText(textPass1);
      let finalText = textPass1;

      // Przebieg 2 fallback w razie trudnych warunków
      if (parsed.length < 2) {
        setOcrProgress({ status: 'Przebieg 2: Adaptacyjna binaryzacja Otsu...', progress: 75 });
        const pass2 = autoPreprocessImage(img, 'auto-otsu', 0);
        const textPass2 = await recognizeTextFromImage(pass2.canvas, (p) => {
          setOcrProgress({
            status: `Skanowanie OCR (Przebieg 2): ${p.progress}%`,
            progress: 75 + Math.round(p.progress * 0.2)
          });
        });
        const parsed2 = parseXrfOcrText(textPass2);
        if (parsed2.length > parsed.length) {
          parsed = parsed2;
          finalText = textPass2;
        }
      }

      setRawOcrText(finalText);
      setDetectedElements(parsed);

      if (parsed.length > 0) {
        showNotification(
          `Sukces: Wyodrębniono ${parsed.length} pierwiastków (${parsed.map((e) => e.symbol).join(', ')})`,
          'success'
        );
        const matches = identifyMinerals(parsed, tolCfg);
        setResults(matches);
      } else {
        showNotification(
          'OCR nie wykrył pierwiastków automatycznie. Sprawdź ręczny panel regulacji poniżej.',
          'info'
        );
        setShowAdvancedManual(true);
      }
    } catch (err: unknown) {
      console.error('Błąd automatycznego OCR:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      showNotification(`Błąd rozpoznawania: ${errMsg}`, 'error');
      setShowAdvancedManual(true);
    } finally {
      setIsOcrRunning(false);
      setOcrProgress(null);
    }
  };

  // Wybór obrazu z aparatu lub pliku
  const handleImageSelected = (dataUrl: string) => {
    setOriginalImage(dataUrl);
    runAutoScanPipeline(dataUrl, toleranceConfig);
  };

  // Wybór gotowej próbki testowej
  const handlePresetSelected = (preset: SamplePreset) => {
    setDetectedElements(preset.elements);
    setRawOcrText(`[Wzorzec testowy]: ${preset.name}\n${preset.description}`);
    const matches = identifyMinerals(preset.elements, toleranceConfig);
    setResults(matches);
    showNotification(`Załadowano wzorzec: ${preset.name}`, 'success');
  };

  // Ręczna zmiana konfiguracji tolerancji (w locie przelicza minerały!)
  const handleToleranceConfigChange = (newConfig: ToleranceConfig) => {
    setToleranceConfig(newConfig);
    if (detectedElements.length > 0) {
      const matches = identifyMinerals(detectedElements, newConfig);
      setResults(matches);
      showNotification(
        newConfig.mode === 'adaptive'
          ? 'Zastosowano adaptacyjne widełki stężeniowe (>40%: ±3%, 5-40%: ±2%, <5%: ±1%)'
          : `Zastosowano stały margines błędu ±${newConfig.fixedValue}%`,
        'info'
      );
    }
  };

  // Ręczne ponowne uruchomienie OCR po manualnych zmianach w Canvasie
  const handleStartOcrManual = async (processedDataUrl: string) => {
    setIsOcrRunning(true);
    setOcrProgress({ status: 'Przygotowanie Tesseract.js...', progress: 0 });

    try {
      const text = await recognizeTextFromImage(processedDataUrl, (progress) => {
        setOcrProgress(progress);
      });

      setRawOcrText(text);
      const parsed = parseXrfOcrText(text);
      setDetectedElements(parsed);

      if (parsed.length > 0) {
        showNotification(`Wyodrębniono ${parsed.length} pierwiastków!`, 'success');
        const matches = identifyMinerals(parsed, toleranceConfig);
        setResults(matches);
      } else {
        showNotification('Nie wykryto pierwiastków. Sprawdź podgląd surowego tekstu.', 'info');
      }
    } catch (err: unknown) {
      console.error('Błąd OCR:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      showNotification(`Błąd rozpoznawania: ${errMsg}`, 'error');
    } finally {
      setIsOcrRunning(false);
      setOcrProgress(null);
    }
  };

  // Ręczne ponowne przetworzenie surowego tekstu Regexem
  const handleReparseRawText = (text: string) => {
    setRawOcrText(text);
    const parsed = parseXrfOcrText(text);
    setDetectedElements(parsed);
    if (parsed.length > 0) {
      const matches = identifyMinerals(parsed, toleranceConfig);
      setResults(matches);
      showNotification(`Wyodrębniono ${parsed.length} pierwiastków z tekstu.`, 'success');
    }
  };

  // Identyfikacja minerału z tabeli
  const handleIdentify = () => {
    if (detectedElements.length === 0) {
      showNotification('Tabela pierwiastków jest pusta. Dodaj pierwiastki.', 'error');
      return;
    }
    const matches = identifyMinerals(detectedElements, toleranceConfig);
    setResults(matches);
    showNotification('Identyfikacja zakończona!', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {/* Powiadomienie w stylu laboratoryjnej fiszki */}
        {notification && (
          <div
            className={`mb-4 p-3 rounded border-2 flex items-center gap-2.5 text-xs font-mono font-bold animate-in fade-in duration-150 shadow-sm ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-800 text-emerald-950'
                : notification.type === 'error'
                ? 'bg-rose-50 border-rose-800 text-rose-950'
                : 'bg-stone-100 border-stone-800 text-stone-900'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Krok 1: Wgrywanie zdjęcia / Wybór próbki */}
        <ImageUploader
          onImageSelected={handleImageSelected}
          onPresetSelected={handlePresetSelected}
          hasActiveImage={Boolean(originalImage)}
        />

        {/* Status skanowania OCR */}
        {isOcrRunning && ocrProgress && (
          <div className="mt-4 p-4 rounded-lg bg-[#ffffff] border-2 border-stone-800 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-stone-900 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-stone-700" />
                {ocrProgress.status}
              </span>
              <span className="text-stone-900 text-sm">
                {ocrProgress.progress}%
              </span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded overflow-hidden border border-stone-400">
              <div
                className="bg-stone-900 h-full transition-all duration-200"
                style={{ width: `${ocrProgress.progress}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500 font-serif italic">
              Super-Resolution + Auto-Levels analizuje kontrast, podbija kropki dziesiętne i rekonstruuje układ tabelaryczny.
            </p>
          </div>
        )}

        {/* Pasek narzędziowy po załadowaniu zdjęcia */}
        {originalImage && !isOcrRunning && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-[#ffffff] border-2 border-stone-400 p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-800">
              <Sparkles className="w-4 h-4 text-stone-700" />
              <span>
                {detectedElements.length > 0
                  ? `Wyodrębniono ${detectedElements.length} pierwiastków z ujęcia.`
                  : 'Zdjęcie załadowane.'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => runAutoScanPipeline(originalImage, toleranceConfig)}
                className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-mono font-bold rounded border border-stone-400 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Przeskanuj ponownie</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAdvancedManual(!showAdvancedManual)}
                className="px-3 py-1 bg-[#ffffff] hover:bg-stone-100 text-stone-800 text-xs font-mono font-bold rounded border border-stone-400 transition-colors"
              >
                {showAdvancedManual ? 'Ukryj filtry optyczne' : 'Ręczne suwaki i obrót'}
              </button>
            </div>
          </div>
        )}

        {/* Krok 2: Zaawansowane narzędzia Canvas */}
        {originalImage && showAdvancedManual && (
          <ImageCanvasPreprocessor
            originalImageSrc={originalImage}
            onProcessedReadyForOcr={handleStartOcrManual}
            isOcrRunning={isOcrRunning}
            ocrProgress={ocrProgress}
          />
        )}

        {/* Surowy tekst OCR */}
        {rawOcrText && (
          <RawOcrViewer
            rawText={rawOcrText}
            onReparse={handleReparseRawText}
          />
        )}

        {/* Krok 3: Edytowalna tabela pośrednia pierwiastków + kontrola tolerancji */}
        <EditableElementsTable
          elements={detectedElements}
          onChange={(newElems) => {
            setDetectedElements(newElems);
            if (newElems.length > 0) {
              setResults(identifyMinerals(newElems, toleranceConfig));
            } else {
              setResults([]);
            }
          }}
          onIdentify={handleIdentify}
          rawOcrText={rawOcrText}
          toleranceConfig={toleranceConfig}
          onToleranceConfigChange={handleToleranceConfigChange}
        />

        {/* Krok 4: Wyniki i protokół minerałów */}
        {results.length > 0 && <MineralResults results={results} />}
      </main>

      {/* Stopka w stylu metryki archiwalnej */}
      <footer className="border-t-2 border-stone-800 bg-[#fdfcf7] py-6 text-center text-xs font-mono text-stone-600 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">XRF GeoScanner</span>
            <span>//</span>
            <span>Dziennik Identyfikacji Minerałów</span>
          </div>
          <p className="text-[11px] text-stone-500 font-serif italic">
            Fizyka XRF: pierwiastki Z &ge; 11 • Baza 1022 taksonów mineralnych • Dynamiczne widełki stężeniowe
          </p>
        </div>
      </footer>
    </div>
  );
}
