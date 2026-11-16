'use client';

import React from 'react';
import { X, CheckCircle2, AlertTriangle, BookOpen, Atom, Activity, Sparkles, Feather } from 'lucide-react';
import { MatchScore } from '@/types';

interface MineralDetailModalProps {
  match: MatchScore | null;
  onClose: () => void;
}

export const MineralDetailModal: React.FC<MineralDetailModalProps> = ({ match, onClose }) => {
  if (!match) return null;

  const { mineral, score, allElementsWithin2Percent, isVerified, elementComparison, lightElementInfo, explanation } = match;
  const d = mineral.diagnostics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#ffffff] border-2 border-stone-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[4px_6px_0px_rgba(0,0,0,0.3)] text-stone-900">
        {/* NAGŁÓWEK KARTOTEKI */}
        <div className="sticky top-0 bg-[#fdfcf7] px-6 py-4 border-b-2 border-stone-800 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-stone-500">
                KARTA MINERAŁU #{mineral.id} //
              </span>
              <h2 className="text-xl font-black font-mono text-stone-900">{mineral.namePl}</h2>
              <span className="text-xs text-stone-500 font-mono italic">({mineral.nameEn})</span>
              {isVerified ? (
                <span className="stamp-green text-[10px] py-0.5">Zweryfikowany</span>
              ) : (
                <span className="stamp-red text-[10px] py-0.5">Odrzucony</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 font-mono text-xs">
              <span className="px-2 py-0.5 bg-stone-900 text-stone-100 rounded font-bold">
                {mineral.formula}
              </span>
              <span className="text-stone-600">
                Grupa: <b className="text-stone-900">{mineral.mineralGroup}</b>
              </span>
              <span className="text-stone-400">|</span>
              <span className="text-stone-700 font-bold">Dopasowanie: {score}%</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded border border-stone-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ZAWARTOŚĆ METRYKI */}
        <div className="p-6 space-y-5 font-mono text-xs">
          {/* Wyjaśnienie */}
          <div className="p-3.5 rounded border border-stone-300 bg-stone-50 text-stone-800 font-serif leading-relaxed italic">
            {explanation}
          </div>

          {/* CECHY FIZYCZNE I DIAGNOSTYCZNE */}
          <div>
            <span className="font-mono text-xs font-black uppercase text-stone-900 tracking-wider block mb-2 border-b border-stone-300 pb-1">
              Właściwości fizyczne i próby polowe:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded border border-stone-300 bg-stone-50">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Twardość Mohsa</span>
                <span className="font-bold text-stone-900 text-sm">{d.hardness}</span>
              </div>
              <div className="p-2.5 rounded border border-stone-300 bg-stone-50">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Rysa</span>
                <span className="font-bold text-stone-900">{d.streak}</span>
              </div>
              <div className="p-2.5 rounded border border-stone-300 bg-stone-50">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Połysk</span>
                <span className="font-bold text-stone-900">{d.luster}</span>
              </div>
              <div className="p-2.5 rounded border border-stone-300 bg-stone-50">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Barwa</span>
                <span className="font-bold text-stone-900">{d.color}</span>
              </div>
              <div className="p-2.5 rounded border border-stone-300 bg-stone-50">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Gęstość</span>
                <span className="font-bold text-stone-900">{d.density}</span>
              </div>
              <div className="p-2.5 rounded border border-stone-300 bg-stone-50">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Łupliwość</span>
                <span className="font-bold text-stone-900">{d.cleavage || 'Wyraźna'}</span>
              </div>
            </div>
          </div>

          {/* PRÓBY DIAGNOSTYCZNE I WYSTĘPOWANIE */}
          <div className="space-y-3 pt-2">
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold mb-1">
                Kluczowe próby identyfikacyjne:
              </span>
              <p className="font-serif italic text-stone-800 bg-[#fdfcf7] p-3 rounded border border-stone-300 leading-relaxed">
                {d.tests}
              </p>
            </div>

            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold mb-1">
                Typowe środowisko występowania:
              </span>
              <p className="font-serif italic text-stone-800 bg-[#fdfcf7] p-3 rounded border border-stone-300 leading-relaxed">
                {d.occurrence}
              </p>
            </div>
          </div>

          {/* BILANS PIERWIASTKÓW LEKKICH */}
          <div className="p-3.5 rounded border border-stone-300 bg-stone-50 flex items-center justify-between flex-wrap gap-2 text-[11px]">
            <div>
              <span className="font-bold text-stone-900 block">Pierwiastki lekkie (Z &lt; 11):</span>
              <span className="text-stone-600">
                Teoretyczna zawartość H, Li, Be, B, C, N, O, F: <b>{mineral.lightElementsPercent}%</b>
              </span>
            </div>
            <span className="px-2 py-1 rounded bg-[#ffffff] border border-stone-400 font-bold">
              {lightElementInfo.withinTolerance ? 'Bilans zgodny' : 'Niezgodność bilansu'}
            </span>
          </div>
        </div>

        {/* STOPKA */}
        <div className="p-4 border-t-2 border-stone-800 bg-[#fdfcf7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 font-mono font-bold rounded text-xs transition-colors shadow-sm"
          >
            Zamknij kartę
          </button>
        </div>
      </div>
    </div>
  );
};
