'use client';

import React, { useRef } from 'react';
import { Camera, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '@/data/samplePresets';
import { DetectedElement } from '@/types';

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
    // Reset wartości inputu, aby można było wybrać ten sam plik ponownie
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            1. Zdjęcie ekranu spektrometru XRF
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Zrób zdjęcie ekranu spektrometru aparatem lub wgraj zrzut ekranu
          </p>
        </div>

        {/* Gotowe próbki */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Próbki testowe:
          </span>
          <select
            onChange={(e) => {
              const preset = SAMPLE_PRESETS.find((p) => p.id === e.target.value);
              if (preset) onPresetSelected(preset);
              e.target.value = '';
            }}
            defaultValue=""
            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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

      {/* Przyciski i strefa upuszczania */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500/60 transition-colors rounded-xl p-6 text-center bg-slate-950/40"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Aparat mobilny (capture="environment") */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
          >
            <Camera className="w-5 h-5" />
            <span>Zrób zdjęcie (Aparat)</span>
          </button>

          {/* Wybór z galerii / dysku */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Wybierz z pliku / galerii</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3">
          Możesz także przeciągnąć plik graficzny tutaj lub wkleić ze schowka (Ctrl+V)
        </p>
      </div>
    </div>
  );
};
