'use client';

import React from 'react';
import { Microscope, Sparkles, Layers, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
            <Microscope className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                XRF <span className="text-emerald-400">GeoScanner</span>
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                MineralID v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Klient OCR spektrometru XRF i silnik identyfikacji minerałów
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">100% lokalny OCR</span>
            <span className="md:hidden">WebAssembly</span>
          </div>
          <div className="flex items-center gap-1 bg-cyan-950/40 border border-cyan-800/50 rounded-lg px-2.5 py-1 text-xs text-cyan-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>63 minerały</span>
          </div>
        </div>
      </div>
    </header>
  );
};
