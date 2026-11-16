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
import { identifyMinerals } from '@/lib/mineralMatcher';
import { Microscope, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [isOcrRunning, setIsOcrRunning] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<OcrProgress | null>(null);
  const [rawOcrText, setRawOcrText] = useState<string>('');
  const [detectedElements, setDetectedElements] = useState<DetectedElement[]>([]);
  const [results, setResults] = useState<MatchScore[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

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
                showNotification('Wklejono zdjęcie ze schowka!', 'success');
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
    }, 4000);
  };

  // Wybór obrazu z aparatu lub pliku
  const handleImageSelected = (dataUrl: string) => {
    setOriginalImage(dataUrl);
    setResults([]);
    showNotification('Zdjęcie załadowane. Dostosuj podgląd i uruchom OCR.', 'info');
  };

  // Wybór gotowej próbki testowej
  const handlePresetSelected = (preset: SamplePreset) => {
    setDetectedElements(preset.elements);
    setRawOcrText(`[Załadowano próbkę wzorcową]: ${preset.name}\n${preset.description}`);
    const matches = identifyMinerals(preset.elements);
    setResults(matches);
    showNotification(`Załadowano wzorzec: ${preset.name}`, 'success');
  };

  // Uruchomienie OCR Tesseract.js po przetworzeniu w Canvasie
  const handleStartOcr = async (processedDataUrl: string) => {
    setIsOcrRunning(true);
    setOcrProgress({ status: 'Przygotowanie Tesseract.js...', progress: 0 });

    try {
      const text = await recognizeTextFromImage(processedDataUrl, (progress) => {
        setOcrProgress(progress);
      });

      setRawOcrText(text);

      // Parsowanie tekstu za pomocą Regex
      const parsed = parseXrfOcrText(text);
      setDetectedElements(parsed);

      if (parsed.length > 0) {
        showNotification(`Pomyślnie wyodrębniono ${parsed.length} pierwiastków ze zdjęcia!`, 'success');
        // Automatyczna wstępna identyfikacja
        const matches = identifyMinerals(parsed);
        setResults(matches);
      } else {
        showNotification(
          'OCR nie wykrył symboli pierwiastków z liczbami. Sprawdź suwak Threshold lub podgląd surowego tekstu.',
          'info'
        );
      }
    } catch (err: unknown) {
      console.error('Błąd OCR:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      showNotification(`Błąd rozpoznawania tekstu: ${errMsg}`, 'error');
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

        {/* Krok 2: Wstępne przetwarzanie Canvas (High-Contrast B&W) & OCR */}
        {originalImage && (
          <ImageCanvasPreprocessor
            originalImageSrc={originalImage}
            onProcessedReadyForOcr={handleStartOcr}
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
            Fizyka XRF: pierwiastki Z &ge; 11 | Silnik stechiometryczny z bazą 63 minerałów
          </p>
        </div>
      </footer>
    </div>
  );
}
