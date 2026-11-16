'use client';

import React from 'react';
import { X, CheckCircle2, AlertTriangle, BookOpen, Atom, Activity, Sparkles, Feather } from 'lucide-react';
import { MatchScore } from '@/types';
import { ELEMENTS } from '@/data/elements';

interface MineralDetailModalProps {
  match: MatchScore | null;
  onClose: () => void;
}

export const MineralDetailModal: React.FC<MineralDetailModalProps> = ({ match, onClose }) => {
  if (!match) return null;

  const { mineral, score, allElementsWithin2Percent, molarRatioDetails, elementComparison, lightElementInfo, explanation } = match;
  const d = mineral.diagnostics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-200">
        {/* Nagłówek modala */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-white">{mineral.namePl}</h2>
              <span className="text-xs text-slate-400 font-mono italic">
                ({mineral.nameEn})
              </span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                {score}% dopasowania
              </span>
              {allElementsWithin2Percent && (
                <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  W widełkach ±2%
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                {mineral.formula}
              </span>
              <span className="text-xs text-slate-400">
                Grupa: <span className="text-slate-200">{mineral.mineralGroup}</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zawartość modala */}
        <div className="p-6 space-y-6">
          {/* Wyjaśnienie algorytmu i widełek */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="font-semibold text-emerald-400 block mb-1">
              Ocena analityczna XRF (Tolerancja ±2.0%):
            </span>
            <p className="text-slate-300 leading-relaxed">{explanation}</p>

            {/* Bilans pierwiastków lekkich */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <Feather className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-300">
                  Niewidoczne pierwiastki lekkie (Z &lt; 11):
                </span>{' '}
                <span className="font-mono text-amber-300 font-bold">
                  {mineral.lightElementsPercent}%
                </span>{' '}
                wzoru stanowi masa pierwiastków lekkich (
                {Object.entries(mineral.lightElementsBreakdown)
                  .map(([s, p]) => `${s}: ${p}%`)
                  .join(', ')}
                ) z widełkami wzorca [{mineral.lightElementsToleranceWindow.min}% - {mineral.lightElementsToleranceWindow.max}%].
              </div>
            </div>

            {molarRatioDetails.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2.5">
                {molarRatioDetails.map((r, idx) => (
                  <div key={idx} className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px]">
                    <span className="text-slate-400">Stosunek {r.ratioName}: </span>
                    <span className="font-mono font-bold text-white">{r.sampleRatio}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-emerald-400 font-mono font-semibold">{r.theoreticalRatio} (teoria)</span>
                    <span className="text-slate-400 ml-1.5">Δ {r.differencePercent}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Porównanie składu pierwiastkowego z widełkami +-2% */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Atom className="w-4 h-4 text-cyan-400" />
                Porównanie widmowe XRF (Widełki błędu ±2.0%)
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                Zielony znacznik = w normie ±2%
              </span>
            </h3>
            <div className="space-y-2.5">
              {elementComparison.map((ec) => (
                <div key={ec.symbol} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400">
                        {ec.symbol} ({ELEMENTS[ec.symbol]?.namePl || ec.symbol})
                      </span>
                      {ec.withinTolerance ? (
                        <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> W normie (±2%)
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 rounded">
                          Δ {ec.difference}%
                        </span>
                      )}
                    </div>
                    <span className="text-slate-300 font-mono text-[11px]">
                      Próbka: <b className="text-white">{ec.samplePercent}%</b> | Wzorzec:{' '}
                      <b className="text-cyan-400">{ec.theoreticalPercent}%</b> [Zakres: {ec.toleranceMin}% - {ec.toleranceMax}%]
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 h-2">
                    <div className="bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, ec.samplePercent)}%` }}
                        title={`Próbka: ${ec.samplePercent}%`}
                      />
                    </div>
                    <div className="bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, ec.theoreticalPercent)}%` }}
                        title={`Wzorzec: ${ec.theoreticalPercent}%`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cechy diagnostyczne fizyczne */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              Właściwości fizyczne i makroskopowe
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Twardość Mohsa</span>
                <span className="font-semibold text-white mt-0.5 block">{d.hardness}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Barwa rysy</span>
                <span className="font-semibold text-white mt-0.5 block">{d.streak}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Połysk</span>
                <span className="font-semibold text-white mt-0.5 block">{d.luster}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Barwa makroskopowa</span>
                <span className="font-semibold text-white mt-0.5 block">{d.color}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Gęstość</span>
                <span className="font-semibold text-white mt-0.5 block">{d.density}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">Łupliwość</span>
                <span className="font-semibold text-white mt-0.5 block">{d.cleavage}</span>
              </div>
            </div>
          </div>

          {/* Próby terenowe */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 text-xs">
            <span className="font-bold text-amber-300 block mb-1">
              Próby terenowe i cechy rozpoznawcze w okazie:
            </span>
            <p className="text-amber-100/90 leading-relaxed">{d.tests}</p>
          </div>

          {/* Występowanie */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs">
            <span className="font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Występowanie i środowisko geologiczne:
            </span>
            <p className="text-slate-400 leading-relaxed">{d.occurrence}</p>
          </div>
        </div>

        {/* Stopka */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};
