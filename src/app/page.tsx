'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageCanvasPreprocessor } from '@/components/ImageCanvasPreprocessor';
import { EditableElementsTable } from '@/components/EditableElementsTable';
import { RawOcrViewer } from '@/components/RawOcrViewer';
import { MineralResults } from '@/components/MineralResults';
import { DetectedElement, MatchScore } from '@/types';
import { SamplePreset } from '@/data/samplePresets';
import { recognizeTextFromImage, OcrProgress } from '@/lib/ocr';
import { parseXrfOcrText } from '@/lib/regexParser';
import { autoPreprocessImage } from '@/lib/imageProcessing';
import { identifyMinerals } from '@/lib/mineralMatcher';
import { CheckCircle2, AlertCircle, Sparkles, Loader2, RefreshCw } from 'lucide-react';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [isOcrRunning, setIsOcrRunning] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<OcrProgress | null>(null);
  const [rawOcrText, setRawOcrText] = useState<string>('');
  const [detectedElements, setDetectedElements] = useState<DetectedElement[]>([]);
  const [results, setResults] = useState<MatchScore[]>([]);
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
                runAutoScanPipeline(dataUrl);
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
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 5000);
  };

  /**
   * AUTOMATYCZNY PIPELINE EKSTRAKCJI (Auto-Levels + Super-Resolution + Multi-Pass OCR)
   * Uruchamia się natychmiast po zrobieniu zdjęcia aparatem lub wgraniu pliku.
   */
  const runAutoScanPipeline = async (imageSrc: string) => {
    setIsOcrRunning(true);
    setResults([]);
    setOcrProgress({ status: '⚡ Automatyczna optymalizacja kontrastu i poziomów (Auto-Levels)...', progress: 10 });

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Nie udało się załadować zdjęcia'));
        img.src = imageSrc;
      });

      // Przebieg 1: Auto-Levels Grayscale z Super-Resolution (zachowuje kropki i antyaliasing)
      setOcrProgress({ status: '⚡ Skanowanie spektrogramu XRF (Przebieg 1: Auto-Grayscale)...', progress: 30 });
      const pass1 = autoPreprocessImage(img, 'auto-levels', 0);

      const textPass1 = await recognizeTextFromImage(pass1.canvas, (p) => {
        setOcrProgress({
          status: `Rozpoznawanie tekstu Tesseract OCR: ${p.progress}%`,
          progress: 30 + Math.round(p.progress * 0.45)
        });
      });

      let parsed = parseXrfOcrText(textPass1);
      let finalText = textPass1;

      // Jeśli Przebieg 1 wykrył mniej niż 2 pierwiastki (np. przez silne odblaski lub specyficzny ekran),
      // uruchamiamy automatyczny Przebieg 2 (Otsu Adaptive Binarization)
      if (parsed.length < 2) {
        setOcrProgress({ status: '⚡ Przebieg 2: Adaptacyjna binaryzacja Otsu...', progress: 75 });
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
          `⚡ Sukces! Automatycznie wyodrębniono ${parsed.length} pierwiastków (${parsed.map((e) => e.symbol).join(', ')})`,
          'success'
        );
        const matches = identifyMinerals(parsed);
        setResults(matches);
      } else {
        showNotification(
          'OCR nie wykrył pierwiastków automatycznie. Otwórz panel ręcznej regulacji poniżej, aby dostosować podgląd.',
          'info'
        );
        setShowAdvancedManual(true);
      }
    } catch (err: unknown) {
      console.error('Błąd automatycznego OCR:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      showNotification(`Błąd automatycznego rozpoznawania: ${errMsg}`, 'error');
      setShowAdvancedManual(true);
    } finally {
      setIsOcrRunning(false);
      setOcrProgress(null);
    }
  };

  // Wybór obrazu z aparatu lub pliku
  const handleImageSelected = (dataUrl: string) => {
    setOriginalImage(dataUrl);
    runAutoScanPipeline(dataUrl);
  };

  // Wybór gotowej próbki testowej
  const handlePresetSelected = (preset: SamplePreset) => {
    setDetectedElements(preset.elements);
    setRawOcrText(`[Załadowano próbkę wzorcową]: ${preset.name}\n${preset.description}`);
    const matches = identifyMinerals(preset.elements);
    setResults(matches);
    showNotification(`Załadowano wzorzec: ${preset.name}`, 'success');
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
        showNotification(`Pomyślnie wyodrębniono ${parsed.length} pierwiastków!`, 'success');
        const matches = identifyMinerals(parsed);
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
      const matches = identifyMinerals(parsed);
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
    const matches = identifyMinerals(detectedElements);
    setResults(matches);
    showNotification('Identyfikacja zakończona pomyślnie!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {/* Powiadomienie Toast */}
        {notification && (
          <div
            className={`mb-4 p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-medium animate-in fade-in duration-200 shadow-lg ${
              notification.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300'
                : notification.type === 'error'
                ? 'bg-red-950/80 border-red-800 text-red-300'
                : 'bg-cyan-950/80 border-cyan-800 text-cyan-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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

        {/* Status automatycznego skanowania OCR */}
        {isOcrRunning && ocrProgress && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-cyan-800/80 shadow-2xl animate-pulse">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-cyan-300 font-semibold flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                {ocrProgress.status}
              </span>
              <span className="text-cyan-400 font-mono font-bold text-sm">
                {ocrProgress.progress}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${ocrProgress.progress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Automatyczny silnik Auto-Levels analizuje histogram, wyostrza cyfry LCD i rekonstruuje kropki dziesiętne.
            </p>
          </div>
        )}

        {/* Przycisk rozwijania zaawansowanego podglądu Canvas / ręcznej regulacji */}
        {originalImage && !isOcrRunning && (
          <div className="mt-4 flex justify-between items-center bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {detectedElements.length > 0
                  ? `Automatycznie wyodrębniono ${detectedElements.length} pierwiastków.`
                  : 'Zdjęcie załadowane.'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => runAutoScanPipeline(originalImage)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Przeskanuj ponownie</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAdvancedManual(!showAdvancedManual)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
              >
                {showAdvancedManual ? 'Ukryj suwaki i podgląd' : 'Ręczne suwaki i obrót'}
              </button>
            </div>
          </div>
        )}

        {/* Krok 2: Zaawansowane narzędzia Canvas (widoczne po rozwinięciu lub przy braku odczytu) */}
        {originalImage && showAdvancedManual && (
          <ImageCanvasPreprocessor
            originalImageSrc={originalImage}
            onProcessedReadyForOcr={handleStartOcrManual}
            isOcrRunning={isOcrRunning}
            ocrProgress={ocrProgress}
          />
        )}

        {/* Surowy tekst OCR (rozwijany) */}
        {rawOcrText && (
          <RawOcrViewer
            rawText={rawOcrText}
            onReparse={handleReparseRawText}
          />
        )}

        {/* Krok 3: Edytowalna tabela pośrednia pierwiastków */}
        <EditableElementsTable
          elements={detectedElements}
          onChange={setDetectedElements}
          onIdentify={handleIdentify}
          rawOcrText={rawOcrText}
        />

        {/* Krok 4: Wyniki i ranking minerałów */}
        {results.length > 0 && <MineralResults results={results} />}
      </main>

      {/* Stopka */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">XRF GeoScanner</span>
            <span>&bull;</span>
            <span>Aplikacja Next.js &amp; Tailwind CSS</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Fizyka XRF: pierwiastki Z &ge; 11 | Silnik stechiometryczny z bazą 1022 minerałów makroskopowych i tolerancją &plusmn;2%
          </p>
        </div>
      </footer>
    </div>
  );
}
