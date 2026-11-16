'use client';

import React, { useRef } from 'react';
import { Camera, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '@/data/samplePresets';

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string) => void;
  onPresetSelected: (preset: SamplePreset) => void;
  hasActiveImage: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onPresetSelected,
  hasActiveImage
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-stone-900 text-stone-100 px-2 py-0.5 rounded">
              SEKCJA 01
            </span>
            <h2 className="text-base font-black text-stone-900 uppercase font-mono tracking-tight">
              Zdjęcie ekranu spektrometru XRF
            </h2>
          </div>
          <p className="text-xs text-stone-600 font-serif italic mt-0.5">
            Zrób zdjęcie aparatem polowym lub wklej zrzut ekranu spektrometru (Ctrl+V)
          </p>
        </div>

        {/* Gotowe próbki */}
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

      {/* Ukryte inputy */}
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

      {/* Obszar przeciągania pliku / przyciski */}
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
          Obsługuje zrzuty ekranu, zdjęcia pod kątem i ekrany z odblaskami (automatyczna korekcja Auto-Levels)
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
            <span>Wybierz plik ze schowka/dysku</span>
          </button>
        </div>
      </div>
    </div>
  );
};
