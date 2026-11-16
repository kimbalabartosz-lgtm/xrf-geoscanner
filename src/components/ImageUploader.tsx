'use client';

import React, { useRef } from 'react';
import { Camera, Upload, Sparkles, Image as ImageIcon, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '@/data/samplePresets';

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string) => void;
  onPresetSelected: (preset: SamplePreset) => void;
  hasActiveImage: boolean;
  currentImage?: string;
  onClearImage?: () => void;
  onRescan?: () => void;
  isScanning?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onPresetSelected,
  hasActiveImage,
  currentImage,
  onClearImage,
  onRescan,
  isScanning = false
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onImageSelected(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          onImageSelected(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="notebook-sheet rounded-lg p-5">
      {/* NAGŁÓWEK SEKCJI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-stone-900 text-stone-100 px-2 py-0.5 rounded">
              SEKCJA 01
            </span>
            <h2 className="text-base font-black text-stone-900 uppercase font-mono tracking-tight flex items-center gap-2">
              <Camera className="w-4 h-4 text-stone-700" />
              Zdjęcie ekranu spektrometru XRF
            </h2>
            {currentImage && (
              <span className="stamp-green text-[10px] py-0.5 px-2">
                Zdjęcie załadowane
              </span>
            )}
          </div>
          <p className="text-xs text-stone-600 font-serif italic mt-0.5">
            Zrób zdjęcie aparatem, wklej ze schowka (Ctrl+V) lub wgraj zrzut ekranu
          </p>
        </div>

        {/* Wzorce testowe */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono font-semibold text-stone-600">
            Wzorce testowe:
          </span>
          <select
            onChange={(e) => {
              const preset = SAMPLE_PRESETS.find((p) => p.id === e.target.value);
              if (preset) onPresetSelected(preset);
              e.target.value = '';
            }}
            defaultValue=""
            className="bg-[#faf8f3] text-xs text-stone-900 border-2 border-stone-700 rounded px-2.5 py-1 font-mono font-medium hover:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer shadow-sm"
          >
            <option value="" disabled>Wybierz próbkę testową...</option>
            {SAMPLE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ukryte inputy systemowe */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* JEŚLI ZDJĘCIE JEST ZAŁADOWANE: WYŚWIETLAJ JE NA STAŁE W FORMULARZU         */}
      {/* ========================================================================= */}
      {currentImage ? (
        <div className="flex flex-col items-center justify-center p-4 bg-[#fbfaf5] border-2 border-stone-800 rounded-lg">
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2 font-mono text-xs text-stone-800 border-b border-stone-300 pb-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-stone-700" />
                Podgląd ujęcia (Ekran spektrometru):
              </span>
              <span className="text-[11px] text-stone-500 font-serif italic">
                Zdjęcie aktywne w analizie
              </span>
            </div>

            {/* Wyświetlane zdjęcie – ZAWSZE WIDOCZNE! */}
            <div className="p-2 bg-[#ffffff] border-2 border-stone-800 rounded shadow-md max-w-full flex items-center justify-center">
              <img
                src={currentImage}
                alt="Ekran spektrometru XRF"
                className="max-h-80 w-auto object-contain rounded"
              />
            </div>

            {/* Przyciski operacyjne pod zdjęciem */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 w-full">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.3)] active:translate-x-0.5 active:translate-y-0.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Zrób inne zdjęcie (aparat)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-[#ffffff] hover:bg-stone-100 text-stone-900 border-2 border-stone-800 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.15)] active:translate-x-0.5 active:translate-y-0.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Wybierz inny plik</span>
              </button>

              {onRescan && (
                <button
                  type="button"
                  onClick={onRescan}
                  disabled={isScanning}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border-2 border-stone-700 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>Przeskanuj ponownie</span>
                </button>
              )}

              {onClearImage && (
                <button
                  type="button"
                  onClick={onClearImage}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-rose-800 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Wyczyść zdjęcie"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Usuń</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* JEŚLI BRAK ZDJĘCIA: OBSZAR PRZECIĄGANIA I WYBORU                          */
        /* ========================================================================= */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-stone-400 hover:border-stone-800 rounded-lg p-6 bg-[#fbfaf5] transition-colors flex flex-col items-center justify-center text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 rounded-full bg-stone-200 border border-stone-400 flex items-center justify-center text-stone-700 mb-3 shadow-inner">
            <ImageIcon className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-stone-900 font-mono">
            Przeciągnij zdjęcie tutaj lub kliknij, aby wybrać z dysku
          </p>
          <p className="text-xs text-stone-500 font-serif italic mt-1">
            Obsługuje zrzuty ekranu, zdjęcia pod kątem i wklejanie bezpośrednio ze schowka (Ctrl+V)
          </p>

          <div className="flex flex-wrap gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.3)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Camera className="w-4 h-4" />
              <span>Zrób zdjęcie aparatem</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#ffffff] hover:bg-stone-100 text-stone-900 border-2 border-stone-800 rounded text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.15)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              <span>Wybierz plik z dysku</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
