'use client';

import React, { useState } from 'react';
import { Award, ChevronRight, CheckCircle2, AlertTriangle, Layers, Sparkles, Copy, Check, FileDown, ExternalLink } from 'lucide-react';
import { MatchScore } from '@/types';
import { MineralDetailModal } from './MineralDetailModal';

interface MineralResultsProps {
  results: MatchScore[];
}

export const MineralResults: React.FC<MineralResultsProps> = ({ results }) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchScore | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  if (!results || results.length === 0) return null;

  const topMatch = results[0];
  const otherMatches = results.slice(1, 10); // Kolejne 9 kandydatów

  const handleCopyReport = () => {
    let report = `### RAPORT IDENTYFIKACJI XRF - MINERALID\n`;
    report += `Data analizy: ${new Date().toLocaleString('pl-PL')}\n\n`;
    report += `#### NAJBARDZIEJ PRAWDOPODOBNY MINERAŁ:\n`;
    report += `- **Nazwa**: ${topMatch.mineral.namePl} (${topMatch.mineral.nameEn})\n`;
    report += `- **Wzór chemiczny**: ${topMatch.mineral.formula}\n`;
    report += `- **Grupa**: ${topMatch.mineral.mineralGroup}\n`;
    report += `- **Dopasowanie**: ${topMatch.score}%\n`;
    report += `- **Twardość Mohsa**: ${topMatch.mineral.diagnostics.hardness}\n`;
    report += `- **Rysa**: ${topMatch.mineral.diagnostics.streak}\n`;
    report += `- **Gęstość**: ${topMatch.mineral.diagnostics.density}\n`;
    report += `- **Cechy diagnostyczne**: ${topMatch.mineral.diagnostics.tests}\n\n`;

    report += `#### RANKING KANDYDATÓW:\n`;
    results.slice(0, 5).forEach((m, idx) => {
      report += `${idx + 1}. ${m.mineral.namePl} (${m.mineral.formula}) - ${m.score}%\n`;
    });

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="mt-6 space-y-5">
      {/* Nagłówek wyników */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              4. Wyniki identyfikacji minerałów
            </h2>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
              Top 10 z 63 w bazie
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranking dopasowania na podstawie stechiometrii, mas atomowych i matrycy XRF
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyReport}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors shadow"
        >
          {copiedReport ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Raport skopiowany!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Kopiuj raport z analizy</span>
            </>
          )}
        </button>
      </div>

      {/* KARTA GŁÓWNA - NAJLEPSZY KANDYDAT (#1) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-xs font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider shadow">
          Główny kandydat (Rank #1)
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mt-2">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {topMatch.mineral.namePl}
              </h3>
              <span className="text-sm text-slate-400 italic">
                {topMatch.mineral.nameEn}
              </span>
            </div>

            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
              <span className="text-sm font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700/60 shadow-inner">
                {topMatch.mineral.formula}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                Grupa: <b className="text-white">{topMatch.mineral.mineralGroup}</b>
              </span>
              <span className="text-xs bg-cyan-950/60 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-800/60">
                {topMatch.confidenceTier === 'high' ? 'Wysoka pewność' : 'Prawdopodobny'}
              </span>
            </div>
          </div>

          {/* Wynik procentowy */}
          <div className="flex flex-col items-center justify-center bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-3 min-w-[140px]">
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {topMatch.score}%
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
              Dopasowanie
            </span>
          </div>
        </div>

        {/* Pasek dopasowania */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${topMatch.score}%` }}
          />
        </div>

        {/* Analiza stechiometryczna / wyjaśnienie */}
        <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          {topMatch.explanation}
        </p>

        {/* Wskaźniki diagnostyczne minerału #1 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-xs">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Twardość Mohsa</span>
            <span className="font-bold text-white mt-0.5 block">{topMatch.mineral.diagnostics.hardness}</span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Barwa rysy</span>
            <span className="font-bold text-white mt-0.5 block">{topMatch.mineral.diagnostics.streak}</span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Połysk</span>
            <span className="font-bold text-white mt-0.5 block">{topMatch.mineral.diagnostics.luster}</span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Gęstość</span>
            <span className="font-bold text-white mt-0.5 block">{topMatch.mineral.diagnostics.density}</span>
          </div>
        </div>

        {/* Próby terenowe */}
        <div className="mt-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 text-xs">
          <span className="font-bold text-amber-300 block mb-0.5">
            Cechy diagnostyczne / Próby terenowe:
          </span>
          <p className="text-amber-100/90">{topMatch.mineral.diagnostics.tests}</p>
        </div>

        {/* Przycisk pełnej karty minerału */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setSelectedMatch(topMatch)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
          >
            <span>Karta minerału i wykres widmowy</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* POZOSTAŁE PASUJĄCE MINERAŁY (RANK #2 - #10) */}
      {otherMatches.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
            Pozostali kandydaci w rankingu dopasowania:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherMatches.map((m, idx) => {
              const rank = idx + 2;
              return (
                <div
                  key={m.mineral.id}
                  onClick={() => setSelectedMatch(m)}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between group shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          #{rank}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {m.mineral.namePl}
                        </h4>
                        <span className="text-xs text-slate-500 italic">
                          ({m.mineral.nameEn})
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {m.score}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                        {m.mineral.formula}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {m.mineral.mineralGroup}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {m.mineral.diagnostics.tests}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>H: {m.mineral.diagnostics.hardness} | Rysa: {m.mineral.diagnostics.streak}</span>
                    <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform font-medium flex items-center">
                      Szczegóły &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal ze szczegółami wybranego minerału */}
      <MineralDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
};
