'use client';

import React from 'react';
import { Microscope, BookOpen, ShieldCheck, Layers, Sliders } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b-2 border-stone-800 bg-[#fdfcf7] sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-stone-900 text-stone-100 flex items-center justify-center font-mono font-black text-lg border-2 border-stone-900 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
            XRF
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-black text-stone-900 tracking-tight font-mono uppercase">
                GeoScanner <span className="text-stone-500 font-normal text-sm">// Dziennik Polowy</span>
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-200 text-stone-800 border border-stone-400 px-2 py-0.5 rounded">
                Baza 1022 minerałów
              </span>
            </div>
            <p className="text-xs text-stone-600 font-serif italic">
              Karta identyfikacji minerałów makroskopowych i spektrometrii rentgenowskiej
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#f5f4ef] border border-stone-400 rounded px-2.5 py-1 text-xs text-stone-800 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
            <span>100% lokalny OCR</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#f5f4ef] border border-stone-400 rounded px-2.5 py-1 text-xs text-stone-800 font-mono">
            <Sliders className="w-3.5 h-3.5 text-stone-700" />
            <span>Tolerancja stężeniowa</span>
          </div>
        </div>
      </div>
    </header>
  );
};
