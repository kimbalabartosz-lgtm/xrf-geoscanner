'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sliders, RotateCw, Contrast, Eye, Play, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { PreprocessingOptions } from '@/types';
import { preprocessImage } from '@/lib/imageProcessing';

interface ImageCanvasPreprocessorProps {
  originalImageSrc: string;
  onProcessedReadyForOcr: (processedDataUrl: string) => void;
  isOcrRunning: boolean;
  ocrProgress: { status: string; progress: number } | null;
}

export const ImageCanvasPreprocessor: React.FC<ImageCanvasPreprocessorProps> = ({
  originalImageSrc,
  onProcessedReadyForOcr,
  isOcrRunning,
  ocrProgress
}) => {
  const [options, setOptions] = useState<PreprocessingOptions>({
    contrast: 45, // Optymalny kontrast dla cyfr i tekstu
    brightness: 0,
    threshold: 0, // 0 = płynny grayscale z zachowaniem kropek dziesiętnych
    grayscale: true,
    invert: false,
    rotation: 0
  });

  const [activeTab, setActiveTab] = useState<'processed' | 'original'>('processed');
  const [processedDataUrl, setProcessedDataUrl] = useState<string>('');
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Renderowanie canvasa przy zmianie opcji lub obrazka
  useEffect(() => {
    if (!originalImageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      try {
        const { dataUrl } = preprocessImage(img, options);
        setProcessedDataUrl(dataUrl);
      } catch (err) {
        console.error('Błąd przetwarzania obrazu:', err);
      }
    };
    img.src = originalImageSrc;
  }, [originalImageSrc, options]);

  const handleRotate = () => {
    setOptions((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  const handleAutoThreshold = () => {
    // 1 to flaga dla metody Otsu w naszym module preprocessImage
    setOptions((prev) => ({
      ...prev,
      threshold: 1,
      contrast: 50,
      grayscale: true
    }));
  };

  const handleStartOcr = () => {
    if (processedDataUrl) {
      onProcessedReadyForOcr(processedDataUrl);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            2. Wstępne przetwarzanie Canvas (High-Contrast B&W)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Eliminacja odblasków szybki spektrometru i wyostrzenie cyfrowej czcionki LCD
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Przełącznik widoku: Przetworzony vs Oryginał */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('processed')}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === 'processed'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Podgląd B&W
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('original')}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === 'original'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Oryginał
            </button>
          </div>

          {/* Obróć zdjęcie */}
          <button
            type="button"
            onClick={handleRotate}
            title="Obróć o 90 stopni"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Podgląd obrazu */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[260px] max-h-[440px]">
        {activeTab === 'processed' ? (
          processedDataUrl ? (
            <img
              src={processedDataUrl}
              alt="Przetworzony spektrogram XRF"
              className="max-h-[420px] w-auto object-contain select-none"
            />
          ) : (
            <div className="text-xs text-slate-500">Przetwarzanie w toku...</div>
          )
        ) : (
          <img
            src={originalImageSrc}
            alt="Oryginał zdjęcia"
            className="max-h-[420px] w-auto object-contain select-none"
            style={{ transform: `rotate(${options.rotation}deg)` }}
          />
        )}

        {/* Wskaźnik obrotu */}
        {options.rotation > 0 && (
          <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded">
            Obrót: {options.rotation}°
          </span>
        )}
      </div>

      {/* Suwaki i parametry regulacji */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
        {/* Suwak Threshold */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-300 font-medium">
              Próg czerni i bieli (Threshold)
            </span>
            <span className="text-emerald-400 font-mono">
              {options.threshold === 0
                ? '0 (Grayscale)'
                : options.threshold === 1
                ? 'Auto (Otsu)'
                : options.threshold}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={options.threshold === 1 ? 128 : options.threshold}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, threshold: Number(e.target.value) }))
            }
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between items-center mt-1">
            <button
              type="button"
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  threshold: 0,
                  contrast: 45,
                  grayscale: true
                }))
              }
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium underline"
            >
              ✨ Grayscale (Kropki LCD)
            </button>
            <button
              type="button"
              onClick={handleAutoThreshold}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium underline"
            >
              🏁 Auto Otsu B&W
            </button>
          </div>
        </div>

        {/* Suwak Kontrastu */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-300 font-medium">Podbicie kontrastu</span>
            <span className="text-cyan-400 font-mono">+{options.contrast}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={options.contrast}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, contrast: Number(e.target.value) }))
            }
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between mt-1 text-[10px] text-slate-500">
            <span>Naturalny</span>
            <span>Maksimum</span>
          </div>
        </div>

        {/* Opcje binarne */}
        <div className="flex flex-col justify-center gap-2">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.invert}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, invert: e.target.checked }))
              }
              className="rounded accent-emerald-500 bg-slate-800 border-slate-700"
            />
            <span>Odwróć kolory (Inwersja)</span>
          </label>
          <p className="text-[10px] text-slate-500">
            Zaznacz, jeśli ekran wyświetlacza ma jasne litery na ciemnym tle.
          </p>
        </div>
      </div>

      {/* Pasek postępu OCR */}
      {isOcrRunning && ocrProgress && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-800/60 shadow-lg">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-cyan-300 font-medium flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              {ocrProgress.status}
            </span>
            <span className="text-cyan-400 font-mono font-bold">
              {ocrProgress.progress}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full transition-all duration-200"
              style={{ width: `${ocrProgress.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Przycisk Start OCR */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          Używa lokalnego Tesseract.js w WebAssembly z filtrem znaków (Whitelist: symbole, cyfry, %)
        </p>
        <button
          type="button"
          disabled={isOcrRunning || !processedDataUrl}
          onClick={handleStartOcr}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          {isOcrRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analizowanie obrazu...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Wyodrębnij tekst (Tesseract OCR)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
