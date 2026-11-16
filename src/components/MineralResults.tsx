'use client';

import React, { useState } from 'react';
import {
  Award,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Copy,
  Check,
  Feather,
  GitFork,
  AlertOctagon,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Flame
} from 'lucide-react';
import { MatchScore } from '@/types';
import { MineralDetailModal } from './MineralDetailModal';

interface MineralResultsProps {
  results: MatchScore[];
}

export const MineralResults: React.FC<MineralResultsProps> = ({ results }) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchScore | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [showDistantMatches, setShowDistantMatches] = useState(false);

  if (!results || results.length === 0) return null;

  const topMatch = results[0];
  const hasVerifiedMatch = results.some((m) => m.isVerified);
  const verifiedMatches = results.filter((m) => m.isVerified);
  const unverifiedMatches = results.filter((m) => !m.isVerified);
  const otherMatches = hasVerifiedMatch ? verifiedMatches.slice(1, 10) : results.slice(1, 8);

  const handleCopyReport = () => {
    let report = `### RAPORT IDENTYFIKACJI XRF - GEOSCANNER\n`;
    report += `Data analizy: ${new Date().toLocaleString('pl-PL')}\n\n`;

    if (hasVerifiedMatch) {
      report += `#### STATUS: MINERAŁ ZWERYFIKOWANY (W granicach błędu ±2.0%)\n`;
      const titlePl = topMatch.polymorphInfo?.isPolymorph ? topMatch.polymorphInfo.combinedNamePl : topMatch.mineral.namePl;
      const titleEn = topMatch.polymorphInfo?.isPolymorph ? topMatch.polymorphInfo.combinedNameEn : topMatch.mineral.nameEn;
      report += `- **Nazwa**: ${titlePl} (${titleEn})\n`;
      report += `- **Wzór chemiczny**: ${topMatch.mineral.formula}\n`;
      report += `- **Grupa**: ${topMatch.mineral.mineralGroup}\n`;
      report += `- **Dopasowanie**: ${topMatch.score}%\n`;
      report += `- **Tolerancja błędu**: Wszystkie pierwiastki w widełkach ±2.0%\n`;
      report += `- **Pierwiastki lekkie (Z < 11)**: ${topMatch.mineral.lightElementsPercent}%\n`;
      report += `- **Twardość Mohsa**: ${topMatch.mineral.diagnostics.hardness}\n`;
      report += `- **Rysa**: ${topMatch.mineral.diagnostics.streak}\n`;
      report += `- **Gęstość**: ${topMatch.mineral.diagnostics.density}\n`;
      report += `- **Cechy diagnostyczne**: ${topMatch.mineral.diagnostics.tests}\n\n`;

      if (topMatch.polymorphInfo?.isPolymorph) {
        report += `*Uwaga dotycząca polimorfów*: ${topMatch.polymorphInfo.distinctionTip}\n\n`;
      }
    } else {
      report += `#### STATUS: BRAK MINERAŁU W BAZIE (Odchylenie > 2.0% w każdym kierunku)\n`;
      report += `Żaden z 1022 minerałów makroskopowych nie odpowiada próbce w granicach błędu ±2.0%.\n`;
      report += `Najbliższe teoretyczne przybliżenie: ${topMatch.mineral.namePl} (${topMatch.mineral.formula}) - odrzucony (odchylenie na ${topMatch.maxDiffSymbol}: ${topMatch.maxElementDifference}%)\n\n`;

      if (topMatch.technicalAlloyHint) {
        report += `*Wykryto profil materiału przemysłowego*: ${topMatch.technicalAlloyHint.name}\n`;
        report += `Opis: ${topMatch.technicalAlloyHint.description}\n\n`;
      }
    }

    report += `#### ELEMENTY PRÓBKI:\n`;
    topMatch.elementComparison.forEach((e) => {
      report += `- ${e.symbol}: ${e.samplePercent}% (wzorzec: ${e.theoreticalPercent}%, różnica: ${e.difference}%)\n`;
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
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              4. Wyniki identyfikacji minerałów makroskopowych
            </h2>
            {hasVerifiedMatch ? (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zweryfikowano (Tolerancja ±2%)
              </span>
            ) : (
              <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                Brak w bazie (Różnica &gt; 2%)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Baza 1022 minerałów, analiza stechiometryczna, bilans lekkich i reguła ścisłej tolerancji ±2.0%
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
              <span>Kopiuj raport</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SCENARIUSZ A: BRAK PASUJĄCEGO MINERAŁU W BAZIE (ODCHYLENIE > 2.0%)         */}
      {/* ========================================================================= */}
      {!hasVerifiedMatch ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border-2 border-rose-500/60 p-6 shadow-2xl space-y-4">
          <div className="absolute top-0 right-0 bg-rose-600 text-white text-xs font-black uppercase px-4 py-1 rounded-bl-xl tracking-wider shadow flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>Nie ma w bazie</span>
          </div>

          {/* Główny komunikat braku w bazie */}
          <div className="flex items-start gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0 mt-1">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Nie ma w bazie takiego minerału
                </h3>
                <span className="text-xs bg-rose-950/90 text-rose-300 border border-rose-500/50 px-2.5 py-1 rounded-lg font-bold">
                  Odchylenie &gt; 2.0% w każdym kierunku
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                Żaden z <b>1022 makroskopowych minerałów</b> w bazie danych nie odpowiada badanemu składowi w dopuszczalnym marginesie błędu <b>±2.0%</b>.
              </p>
            </div>
          </div>

          {/* KARTA ROZPOZNANIA STOPU PRZEMYSŁOWEGO (np. stal kwasoodporna SS-316) */}
          {topMatch.technicalAlloyHint ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/80 via-slate-900 to-sky-950/80 border-2 border-sky-500/60 shadow-lg">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-sky-300" />
                <span>Wykryto wzorzec materiału przemysłowego / metalurgicznego:</span>
              </div>
              <h4 className="text-lg font-black text-white">
                {topMatch.technicalAlloyHint.name}
              </h4>
              <p className="text-xs text-sky-200/90 mt-1 leading-relaxed">
                {topMatch.technicalAlloyHint.description}
              </p>
              <div className="mt-2 pt-2 border-t border-sky-900/60 text-[11px] text-sky-300/80 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Spektrometry ręczne XRF często używają krążka SS-316 jako wzorca kalibracyjnego (Alloy Mode). To nie jest minerał naturalny.</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <b className="text-white block mb-0.5">Możliwe przyczyny braku dopasowania:</b>
                Badana próbka może być polimineralną skałą (mieszanina wielu minerałów), stopem technicznym, żużlem hutniczym lub rzadką fazą spoza listy minerałów makroskopowych.
              </div>
            </div>
          )}

          {/* SZCZEGÓŁOWA ANALIZA ODCHYLEŃ DLA NAJBLIŻSZEGO WZORCA */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-rose-950/60 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Dlaczego próbka nie pasuje do najbliższego wzorca ({topMatch.mineral.namePl})?</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Największy błąd: <b className="text-rose-400">{topMatch.maxDiffSymbol} (&Delta; {topMatch.maxElementDifference}%)</b>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Dla najbliższego czysto teoretycznego analogu mineralnego (<b className="text-white">{topMatch.mineral.namePl}</b>, wzór: <code className="text-emerald-400">{topMatch.mineral.formula}</code>) wartości pierwiastków wykraczają daleko poza dopuszczalne widełki ±2.0%:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
              {topMatch.elementComparison.map((elem) => (
                <div
                  key={elem.symbol}
                  className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between ${
                    elem.withinTolerance
                      ? 'bg-slate-900 border-slate-800 text-slate-300'
                      : 'bg-rose-950/40 border-rose-700/60 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-sm">{elem.symbol}</span>
                    {elem.withinTolerance ? (
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        OK (w ±2%)
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400 font-bold flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> &Delta; {elem.difference}%
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-baseline justify-between font-mono text-[11px]">
                    <span className="text-slate-400">
                      Próbka: <b className="text-white">{elem.samplePercent}%</b>
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      Wzorzec: {elem.theoreticalPercent}%
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    Limit: [{elem.toleranceMin}% - {elem.toleranceMax}%]
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PRZYCISK ROZWIJANIA DALEKICH PRZYBLIŻEŃ */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDistantMatches(!showDistantMatches)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <span>
                {showDistantMatches
                  ? 'Ukryj dalekie przybliżenia teoretyczne'
                  : 'Pokaż odległe przybliżenia teoretyczne (odrzucone minerały poza widełkami ±2%)'}
              </span>
              {showDistantMatches ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* SCENARIUSZ B: ZNALEZIONO ZWERYFIKOWANY MINERAŁ W WIDEŁKACH ±2.0%          */
        /* ========================================================================= */
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 p-6 shadow-2xl">
          <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-xs font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider shadow flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zweryfikowany minerał</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mt-2">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {topMatch.polymorphInfo?.isPolymorph
                    ? topMatch.polymorphInfo.combinedNamePl
                    : topMatch.mineral.namePl}
                </h3>
                <span className="text-sm text-slate-400 italic">
                  {topMatch.polymorphInfo?.isPolymorph
                    ? topMatch.polymorphInfo.combinedNameEn
                    : topMatch.mineral.nameEn}
                </span>
              </div>

              <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                <span className="text-sm font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700/60 shadow-inner">
                  {topMatch.mineral.formula}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                  Grupa: <b className="text-white">{topMatch.mineral.mineralGroup}</b>
                </span>
                {topMatch.polymorphInfo?.isPolymorph ? (
                  <span className="text-xs bg-amber-950/80 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5">
                    <GitFork className="w-3.5 h-3.5 text-amber-400" />
                    Grupa polimorfów (Albo to, albo to)
                  </span>
                ) : (
                  <span className="text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    W widełkach ±2.0%
                  </span>
                )}
              </div>

              {/* SEKCJA SPECJALNA DLA POLIMORFÓW: ZESTAWIENIE "ALBO TO, ALBO TO" */}
              {topMatch.polymorphInfo?.isPolymorph && (
                <div className="mt-3.5 p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 shadow-inner">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-[10px] uppercase tracking-wider text-amber-300 font-extrabold">
                      Identyczny profil w XRF
                    </span>
                    <span>Albo to, albo to! Porównanie cech makroskopowych:</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed mb-3">
                    Wzór chemiczny <b>{topMatch.mineral.formula}</b> jest wspólny dla minerałów: <b>{topMatch.polymorphInfo.combinedNamePl}</b>. W spektrometrii rentgenowskiej dają one identyczny sygnał atomowy. Aby ustalić, który z nich trzymasz w dłoni, porównaj poniższe cechy fizyczne:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {topMatch.polymorphInfo.members.map((m) => (
                      <div key={m.id} className="p-3 rounded-lg bg-slate-950/90 border border-amber-700/40 text-[11px] space-y-1 shadow">
                        <div className="font-extrabold text-amber-200 text-xs flex items-center justify-between border-b border-slate-800 pb-1">
                          <span>{m.namePl}</span>
                          <span className="text-[10px] text-slate-400 font-normal italic">{m.nameEn}</span>
                        </div>
                        <div className="text-slate-300"><b className="text-slate-400">Twardość:</b> {m.hardness} Mohsa</div>
                        <div className="text-slate-300"><b className="text-slate-400">Rysa:</b> {m.streak}</div>
                        <div className="text-slate-300"><b className="text-slate-400">Barwa:</b> {m.color}</div>
                        <div className="text-slate-400 italic text-[10px] line-clamp-2 pt-0.5">{m.tests}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wynik procentowy */}
            <div className="flex flex-col items-center justify-center bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-3 min-w-[140px] shrink-0">
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

          {/* Bilans pierwiastków lekkich i wyjaśnienie */}
          <div className="mt-3.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
            <p className="text-slate-300 leading-relaxed">
              {topMatch.explanation}
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                <Feather className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Wymagane pierwiastki lekkie (Z &lt; 11): <b>{topMatch.mineral.lightElementsPercent}%</b>
                </span>
                <span className="text-slate-500 font-mono">
                  [Tolerancja: {topMatch.mineral.lightElementsToleranceWindow.min}% - {topMatch.mineral.lightElementsToleranceWindow.max}%]
                </span>
              </div>

              <span className="text-slate-400 text-[10px]">
                Odrębna widełka błędu: ±2.0% na każdy pierwiastek
              </span>
            </div>
          </div>

          {/* Podgląd porównania pierwiastków w oknie tolerancji */}
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Porównanie pierwiastków z wzorcem minerału (Widełki ±2.0%):
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {topMatch.elementComparison.map((elem) => (
                <div
                  key={elem.symbol}
                  className={`p-2 rounded-lg border text-xs flex flex-col justify-between ${
                    elem.withinTolerance
                      ? 'bg-emerald-950/40 border-emerald-800/60'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-mono">{elem.symbol}</span>
                    {elem.withinTolerance ? (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> OK
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> &Delta; {elem.difference}%
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-baseline justify-between font-mono text-[11px]">
                    <span className="text-slate-400">
                      Próbka: <b className="text-slate-200">{elem.samplePercent}%</b>
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      Wzorzec: {elem.theoreticalPercent}%
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    Widełki: [{elem.toleranceMin}% - {elem.toleranceMax}%]
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Właściwości diagnostyczne i przycisk pełnego profilu */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs flex-1">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Twardość</span>
                <span className="text-slate-200 font-medium">{topMatch.mineral.diagnostics.hardness} Mohsa</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Rysa</span>
                <span className="text-slate-200 font-medium">{topMatch.mineral.diagnostics.streak}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Połysk</span>
                <span className="text-slate-200 font-medium">{topMatch.mineral.diagnostics.luster}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Gęstość</span>
                <span className="text-slate-200 font-medium">{topMatch.mineral.diagnostics.density}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedMatch(topMatch)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
            >
              <span>Karta diagnostyczna</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LISTA POZOSTAŁYCH KANDYDATÓW (DLA MINERAŁU ZWERYFIKOWANEGO LUB ROZWINIĘTA)*/}
      {/* ========================================================================= */}
      {(hasVerifiedMatch || showDistantMatches) && otherMatches.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
            {hasVerifiedMatch
              ? 'Pozostali zweryfikowani kandydaci z bazy 1022 minerałów:'
              : 'Odległe przybliżenia teoretyczne (Wszystkie odrzucone – poza tolerancją ±2%):'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherMatches.map((m, idx) => {
              const rank = idx + 2;
              const displayNamePl = m.polymorphInfo?.isPolymorph ? m.polymorphInfo.combinedNamePl : m.mineral.namePl;
              const displayNameEn = m.polymorphInfo?.isPolymorph ? m.polymorphInfo.combinedNameEn : m.mineral.nameEn;

              return (
                <div
                  key={m.mineral.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between group shadow ${
                    m.isVerified
                      ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/70 hover:bg-slate-900 border-slate-850 hover:border-slate-800 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          #{rank}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {displayNamePl}
                        </h4>
                        <span className="text-xs text-slate-500 italic">
                          ({displayNameEn})
                        </span>
                      </div>
                      <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded border ${
                        m.isVerified
                          ? 'text-emerald-400 bg-slate-950 border-slate-800'
                          : 'text-rose-400 bg-rose-950/40 border-rose-900/40'
                      }`}>
                        {m.score}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                        {m.mineral.formula}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {m.mineral.mineralGroup}
                      </span>
                      {m.isVerified ? (
                        <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Zweryfikowany (±2%)
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/50 font-bold flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-400" /> Błąd &gt; 2% ({m.maxDiffSymbol}: {m.maxElementDifference}%)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {m.mineral.diagnostics.tests}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Lekkie: {m.mineral.lightElementsPercent}% | H: {m.mineral.diagnostics.hardness}</span>
                    <span className="text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all font-medium flex items-center">
                      Szczegóły <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal z pełnymi szczegółami minerału */}
      {selectedMatch && (
        <MineralDetailModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
};
