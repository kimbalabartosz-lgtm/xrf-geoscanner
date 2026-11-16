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
    contrast: 45,
    brightness: 0,
    threshold: 0,
    grayscale: true,
    invert: false,
    rotation: 0
  });

  const [activeTab, setActiveTab] = useState<'processed' | 'original'>('processed');
  const [processedDataUrl, setProcessedDataUrl] = useState<string>('');
  const imgRef = useRef<HTMLImageElement | null>(null);

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
    setOptions((prev) => ({
      ...prev,
      threshold: 1
    }));
  };

  if (!originalImageSrc) return null;

  return (
    <div className="notebook-sheet rounded-lg p-5 mt-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-stone-900 text-stone-100 px-2 py-0.5 rounded">
              MODUŁ OPTYCZNY
            </span>
            <h2 className="text-base font-black text-stone-900 uppercase font-mono tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-stone-700" />
              Podgląd i filtry obrazu spektrometru
            </h2>
          </div>
          <p className="text-xs text-stone-600 font-serif italic mt-0.5">
            Dostosuj kontrast i binaryzację w Canvasie w przypadku trudnych odblasków ekranu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('processed')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded border-2 transition-all ${
              activeTab === 'processed'
                ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-sm'
                : 'bg-[#ffffff] text-stone-700 border-stone-300 hover:border-stone-800'
            }`}
          >
            Filtr OCR (Canvas)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('original')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded border-2 transition-all ${
              activeTab === 'original'
                ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-sm'
                : 'bg-[#ffffff] text-stone-700 border-stone-300 hover:border-stone-800'
            }`}
          >
            Zdjęcie oryginalne
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Kontrolki filtrów */}
        <div className="md:col-span-5 space-y-4 font-mono text-xs">
          <div>
            <div className="flex justify-between font-bold text-stone-800 mb-1">
              <span>Próg czerni i bieli (Threshold)</span>
              <span className="text-stone-900">{options.threshold === 0 ? 'Płynny Grayscale' : options.threshold}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={options.threshold}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, threshold: parseInt(e.target.value) }))
              }
              className="w-full h-2 bg-stone-300 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
              <button
                type="button"
                onClick={handleAutoThreshold}
                className="underline hover:text-stone-900 font-bold"
              >
                Włącz Auto Otsu
              </button>
              <span>0 - 255</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold text-stone-800 mb-1">
              <span>Podbicie kontrastu</span>
              <span className="text-stone-900">+{options.contrast}%</span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              value={options.contrast}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, contrast: parseInt(e.target.value) }))
              }
              className="w-full h-2 bg-stone-300 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-200">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
              <input
                type="checkbox"
                checked={options.invert}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, invert: e.target.checked }))
                }
                className="w-4 h-4 rounded border-stone-400 text-stone-900 focus:ring-0"
              />
              <span>Odwróć kolory (Inwersja)</span>
            </label>
            <button
              type="button"
              onClick={handleRotate}
              className="p-1.5 rounded border border-stone-400 bg-stone-100 hover:bg-stone-200 text-stone-800"
              title="Obróć o 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onProcessedReadyForOcr(processedDataUrl)}
            disabled={isOcrRunning || !processedDataUrl}
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-100 font-mono font-bold rounded text-xs flex items-center justify-center gap-2 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.3)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40"
          >
            {isOcrRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analiza OCR w toku...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Wyodrębnij tekst z tego ujęcia (OCR)</span>
              </>
            )}
          </button>
        </div>

        {/* Podgląd Canvas / Zdjęcia */}
        <div className="md:col-span-7 flex flex-col items-center justify-center p-3 border-2 border-stone-300 rounded bg-[#faf9f5]">
          {activeTab === 'processed' ? (
            <img
              src={processedDataUrl || originalImageSrc}
              alt="Przetworzone dla OCR"
              className="max-h-72 object-contain rounded border border-stone-300 bg-white shadow-sm"
            />
          ) : (
            <img
              src={originalImageSrc}
              alt="Oryginał"
              className="max-h-72 object-contain rounded border border-stone-300 bg-white shadow-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};
