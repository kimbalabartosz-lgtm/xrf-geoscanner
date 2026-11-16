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
  Sliders,
  FileSpreadsheet
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
  const otherMatches = hasVerifiedMatch ? verifiedMatches.slice(1, 10) : results.slice(1, 8);

  const handleCopyReport = () => {
    let report = `==========================================================\n`;
    report += `RAPORT ANALIZY SPEKTROMETRYCZNEJ XRF - GEOSCANNER\n`;
    report += `Data i czas analizy: ${new Date().toLocaleString('pl-PL')}\n`;
    report += `Baza wzorców: 1022 minerały makroskopowe\n`;
    report += `==========================================================\n\n`;

    if (hasVerifiedMatch) {
      report += `[STATUS]: MINERAŁ ZWERYFIKOWANY (W granicach tolerancji błędu)\n`;
      const titlePl = topMatch.polymorphInfo?.isPolymorph ? topMatch.polymorphInfo.combinedNamePl : topMatch.mineral.namePl;
      const titleEn = topMatch.polymorphInfo?.isPolymorph ? topMatch.polymorphInfo.combinedNameEn : topMatch.mineral.nameEn;
      report += `- Oznaczona nazwa: ${titlePl} (${titleEn})\n`;
      report += `- Wzór chemiczny: ${topMatch.mineral.formula}\n`;
      report += `- Grupa mineralogiczna: ${topMatch.mineral.mineralGroup}\n`;
      report += `- Zgodność stechiometryczna: ${topMatch.score}%\n`;
      report += `- Pierwiastki lekkie (Z < 11): ${topMatch.mineral.lightElementsPercent}%\n`;
      report += `- Twardość w skali Mohsa: ${topMatch.mineral.diagnostics.hardness}\n`;
      report += `- Rysa: ${topMatch.mineral.diagnostics.streak}\n`;
      report += `- Gęstość: ${topMatch.mineral.diagnostics.density}\n`;
      report += `- Próby diagnostyczne: ${topMatch.mineral.diagnostics.tests}\n\n`;

      if (topMatch.polymorphInfo?.isPolymorph) {
        report += `*Wskazówka rozstrzygnięcia polimorfów*: ${topMatch.polymorphInfo.distinctionTip}\n\n`;
      }
      if (topMatch.isomorphicSubstitutions && topMatch.isomorphicSubstitutions.length > 0) {
        topMatch.isomorphicSubstitutions.forEach((iso) => {
          report += `*Podstawienie izomorficzne*: ${iso.seriesName} (${iso.substitutedElement}: ${iso.percent}% za ${iso.targetElement})\n`;
        });
        report += `\n`;
      }
      if (topMatch.matrixInclusions && topMatch.matrixInclusions.length > 0) {
        topMatch.matrixInclusions.forEach((mat) => {
          report += `*Domieszka matrycy skały*: ${mat.symbol}: ${mat.percent}% (${mat.mineralSource})\n`;
        });
        report += `\n`;
      }
    } else {
      report += `[STATUS]: ODRZUCONY // BRAK MINERAŁU W BAZIE\n`;
      report += `Żaden z 1022 minerałów makroskopowych nie odpowiada próbce w zadanych widełkach błędu.\n`;
      report += `Najbliższy czysto teoretyczny analog: ${topMatch.mineral.namePl} (${topMatch.mineral.formula}) - odrzucony (odchylenie na ${topMatch.maxDiffSymbol}: ${topMatch.maxElementDifference}%)\n\n`;

      if (topMatch.technicalAlloyHint) {
        report += `*Wykryto profil stopu przemysłowego*: ${topMatch.technicalAlloyHint.name}\n`;
        report += `Opis: ${topMatch.technicalAlloyHint.description}\n\n`;
      }
    }

    report += `ZESTAWIENIE SKŁADU PIERWIASTKOWEGO:\n`;
    topMatch.elementComparison.forEach((e) => {
      report += `• ${e.symbol}: próbka ${e.samplePercent}%, wzorzec ${e.theoreticalPercent}%, różnica ${e.difference}% [limit: ${e.toleranceMin}% - ${e.toleranceMax}%, ${e.tierLabel}] -> ${e.withinTolerance ? 'OK' : 'BŁĄD'}\n`;
    });

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="mt-6 space-y-5">
      {/* NAGŁÓWEK KARTY WYNIKÓW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-stone-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold bg-stone-900 text-stone-100 px-2 py-0.5 rounded">
              SEKCJA 03
            </span>
            <h2 className="text-base font-black text-stone-900 uppercase font-mono tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-stone-700" />
              Protokół identyfikacji mineralogicznej
            </h2>
            {hasVerifiedMatch ? (
              <span className="stamp-green text-[10px] py-0.5 px-2">
                ✓ Minerał zweryfikowany
              </span>
            ) : (
              <span className="stamp-red text-[10px] py-0.5 px-2">
                ✕ Brak minerału w bazie
              </span>
            )}
          </div>
          <p className="text-xs text-stone-600 font-serif italic mt-0.5">
            Porównanie stechiometryczne ze strukturami krystalicznymi 1022 minerałów makroskopowych
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyReport}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded bg-[#ffffff] hover:bg-stone-100 border-2 border-stone-800 text-xs font-mono font-bold text-stone-900 flex items-center gap-2 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.2)] active:translate-x-0.5 active:translate-y-0.5"
        >
          {copiedReport ? (
            <>
              <Check className="w-4 h-4 text-emerald-800" />
              <span>Protokół skopiowany!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-stone-600" />
              <span>Kopiuj protokół z analizy</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* STAN A: BRAK MINERAŁU W BAZIE (ODCHYLENIE > TOLERANCJA)                    */}
      {/* ========================================================================= */}
      {!hasVerifiedMatch ? (
        <div className="notebook-sheet rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between gap-3 border-b-2 border-stone-800 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded bg-rose-100 border-2 border-rose-800 flex items-center justify-center text-rose-900 font-mono font-black shrink-0 mt-0.5">
                ✕
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-black text-stone-900 font-mono uppercase tracking-tight">
                    Nie ma w bazie takiego minerału
                  </h3>
                  <span className="stamp-red text-xs py-0.5">
                    Odchylenie &gt; tolerancja w każdym kierunku
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 font-serif italic mt-1 leading-relaxed">
                  Żaden z <b>1022 makroskopowych minerałów</b> w bazie nie odpowiada badanemu składowi w wyznaczonych widełkach błędu.
                </p>
              </div>
            </div>
          </div>

          {/* KARTA ROZPOZNANIA STOPU PRZEMYSŁOWEGO (np. stal SS-316) */}
          {topMatch.technicalAlloyHint ? (
            <div className="p-4 rounded border-2 border-sky-800 bg-sky-50/80 shadow-sm space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-sky-900 uppercase tracking-wider">
                <span className="stamp-blue text-[10px] py-0.5">
                  Wzorzec materiału technicznego
                </span>
                <span>Identyfikacja fazy metalurgicznej:</span>
              </div>
              <h4 className="text-base font-black text-stone-900 font-mono">
                {topMatch.technicalAlloyHint.name}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed pt-0.5 font-serif">
                {topMatch.technicalAlloyHint.description}
              </p>
              <div className="text-[11px] text-sky-950/80 font-mono font-medium pt-1 border-t border-sky-300">
                Wskazówka: Spektrometry ręczne XRF posiadają krążek AISI 316 jako wzorzec kalibracyjny (Alloy Mode). To stop techniczny, a nie minerał.
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded border border-stone-400 bg-stone-100 text-xs text-stone-700 font-serif leading-relaxed">
              <b className="text-stone-900 block font-mono text-[11px] uppercase mb-0.5">
                Możliwe przyczyny braku dopasowania:
              </b>
              Badany obiekt może być polimineralną skałą (np. piaskowiec z kwarcem i skaleniem), stopem technicznym, żużlem pohutniczym lub rzadką fazą spoza bazy minerałów makroskopowych.
            </div>
          )}

          {/* DOKŁADNE PORÓWNANIE PIERWIASTKÓW Z NAJBLIŻSZYM WZORCEM */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-mono text-xs font-black uppercase text-stone-800 tracking-wider">
                Zestawienie odchyleń od najbliższego wzorca ({topMatch.mineral.namePl}):
              </span>
              <span className="text-xs font-mono text-rose-800 font-bold">
                Maksymalny błąd: {topMatch.maxDiffSymbol} (&Delta; {topMatch.maxElementDifference}%)
              </span>
            </div>

            <p className="text-xs text-stone-600 font-serif italic">
              Dla najbliższego czysto teoretycznego wzorca (<b className="text-stone-900">{topMatch.mineral.namePl}</b>, wzór: <code className="font-mono text-stone-900">{topMatch.mineral.formula}</code>) wartości pierwiastków wykraczają poza dopuszczalną tolerancję:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
              {topMatch.elementComparison.map((elem) => (
                <div
                  key={elem.symbol}
                  className={`p-2.5 rounded border-2 text-xs flex flex-col justify-between ${
                    elem.withinTolerance
                      ? 'bg-[#ffffff] border-stone-300 text-stone-800'
                      : 'bg-rose-50 border-rose-800 text-rose-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-black text-sm">{elem.symbol}</span>
                    {elem.withinTolerance ? (
                      <span className="text-[10px] text-emerald-800 font-bold">
                        [OK]
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-800 font-black">
                        &Delta; {elem.difference}%
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-baseline justify-between font-mono text-[11px]">
                    <span className="text-stone-600">
                      Próbka: <b className="text-stone-900">{elem.samplePercent}%</b>
                    </span>
                    <span className="text-stone-500 text-[10px]">
                      Wzorzec: {elem.theoreticalPercent}%
                    </span>
                  </div>

                  <div className="text-[10px] text-stone-500 mt-1 font-mono pt-1 border-t border-stone-200">
                    Limit: [{elem.toleranceMin}% - {elem.toleranceMax}%] ({elem.tierLabel})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROZWIJANIE DALEKICH PRZYBLIŻEŃ */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDistantMatches(!showDistantMatches)}
              className="w-full py-2 px-3 rounded bg-stone-100 hover:bg-stone-200 border-2 border-stone-400 text-xs font-mono font-bold text-stone-800 flex items-center justify-center gap-2 transition-colors"
            >
              <span>
                {showDistantMatches
                  ? 'Ukryj odrzucone pozycje teoretyczne'
                  : 'Pokaż odległe pozycje teoretyczne (odrzucone poza tolerancją)'}
              </span>
              {showDistantMatches ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* STAN B: MINERAŁ ZWERYFIKOWANY (WSZYSTKIE PIERWIASTKI W TOLERANCJI)        */
        /* ========================================================================= */
        <div className="notebook-sheet rounded-lg p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-stone-800 pb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="stamp-green text-xs py-0.5">
                  ✓ Potwierdzony minerał
                </span>
                {topMatch.polymorphInfo?.isPolymorph && (
                  <span className="stamp-amber text-xs py-0.5">
                    🔀 Para / Grupa polimorfów (Albo to, albo to)
                  </span>
                )}
              </div>

              <div className="mt-2">
                <h3 className="text-2xl font-black text-stone-900 font-mono tracking-tight">
                  {topMatch.polymorphInfo?.isPolymorph
                    ? topMatch.polymorphInfo.combinedNamePl
                    : topMatch.mineral.namePl}
                </h3>
                <span className="text-xs text-stone-500 font-mono italic">
                  {topMatch.polymorphInfo?.isPolymorph
                    ? topMatch.polymorphInfo.combinedNameEn
                    : topMatch.mineral.nameEn}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2 flex-wrap text-xs font-mono">
                <span className="px-2 py-0.5 bg-stone-900 text-stone-100 rounded font-bold">
                  {topMatch.mineral.formula}
                </span>
                <span className="px-2 py-0.5 bg-stone-100 border border-stone-400 rounded text-stone-800">
                  Grupa: <b>{topMatch.mineral.mineralGroup}</b>
                </span>
              </div>
            </div>

            {/* Wskaźnik dopasowania */}
            <div className="flex flex-col items-center justify-center p-3 rounded border-2 border-stone-800 bg-[#faf8f3] min-w-[130px] shrink-0 text-center">
              <span className="text-2xl font-black font-mono text-stone-900">
                {topMatch.score}%
              </span>
              <span className="text-[10px] uppercase font-mono font-bold text-stone-600 mt-0.5">
                Dopasowanie XRF
              </span>
            </div>
          </div>

          {/* PORÓWNANIE MAKROSKOPOWE DLA POLIMORFÓW */}
          {topMatch.polymorphInfo?.isPolymorph && (
            <div className="p-4 rounded border-2 border-amber-800 bg-amber-50/70 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-black text-amber-950 uppercase tracking-wider">
                <span className="stamp-amber text-[10px] py-0.5">
                  Identyczny profil w XRF
                </span>
                <span>Albo to, albo to! Porównanie cech makroskopowych w terenie:</span>
              </div>
              <p className="text-xs text-stone-800 font-serif leading-relaxed">
                Minerały <b>{topMatch.polymorphInfo.combinedNamePl}</b> mają ten sam wzór chemiczny (<b>{topMatch.mineral.formula}</b>) i w spektrometrze XRF dają identyczny sygnał atomowy. Rozstrzygnij badaniem cech fizycznych:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {topMatch.polymorphInfo.members.map((m) => (
                  <div key={m.id} className="p-3 rounded bg-[#ffffff] border-2 border-amber-800/60 text-xs font-mono space-y-1 shadow-sm">
                    <div className="font-black text-stone-900 border-b border-stone-300 pb-1 flex justify-between">
                      <span>{m.namePl}</span>
                      <span className="text-[10px] font-normal italic text-stone-500">{m.nameEn}</span>
                    </div>
                    <div className="text-stone-700">Twardość: <b>{m.hardness} Mohsa</b></div>
                    <div className="text-stone-700">Rysa: <b>{m.streak}</b></div>
                    <div className="text-stone-700">Barwa: <b>{m.color}</b></div>
                    <div className="text-[11px] text-stone-600 font-serif italic pt-1 border-t border-stone-200">
                      {m.tests}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOMIESZKI MATRYCY SKAŁY MACIERZYSTEJ I PODSTAWIENIA IZOMORFICZNE */}
          {((topMatch.matrixInclusions && topMatch.matrixInclusions.length > 0) ||
            (topMatch.isomorphicSubstitutions && topMatch.isomorphicSubstitutions.length > 0)) && (
            <div className="p-3.5 rounded border-2 border-stone-800 bg-[#faf8f3] space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 font-black uppercase text-stone-900 tracking-wide">
                <Layers className="w-4 h-4 text-stone-700" />
                <span>Naturalny kontekst geologiczny próbki:</span>
              </div>

              {topMatch.isomorphicSubstitutions?.map((iso, i) => (
                <div key={i} className="flex items-start gap-2 text-emerald-950 bg-emerald-50/80 p-2 rounded border border-emerald-700">
                  <Sparkles className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <b>Podstawienie izomorficzne:</b> {iso.seriesName} — wykryto <b>{iso.substitutedElement}: {iso.percent}%</b> zastępujące {iso.targetElement} w sieci krystalicznej.
                  </div>
                </div>
              ))}

              {topMatch.matrixInclusions?.map((mat, i) => (
                <div key={i} className="flex items-start gap-2 text-stone-900 bg-stone-100 p-2 rounded border border-stone-400">
                  <span className="stamp-blue text-[10px] py-0.5 px-1.5 shrink-0">Matryca</span>
                  <div>
                    <b>Domieszka skały macierzystej:</b> pierwiastek <b>{mat.symbol}: {mat.percent}%</b> ({mat.mineralSource}).
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TABELA PORÓWNANIA PIERWIASTKÓW W WIDEŁKACH */}
          <div className="space-y-2">
            <span className="font-mono text-xs font-black uppercase text-stone-800 tracking-wider block">
              Zgodność pierwiastków w oknie tolerancji:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {topMatch.elementComparison.map((elem) => (
                <div
                  key={elem.symbol}
                  className={`p-2.5 rounded border-2 text-xs flex flex-col justify-between ${
                    elem.withinTolerance
                      ? 'bg-[#ffffff] border-stone-800 text-stone-900'
                      : 'bg-rose-50 border-rose-700 text-rose-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-black text-sm">{elem.symbol}</span>
                    {elem.withinTolerance ? (
                      <span className="text-[10px] text-emerald-800 font-bold">[OK]</span>
                    ) : (
                      <span className="text-[10px] text-rose-800 font-bold">&Delta; {elem.difference}%</span>
                    )}
                  </div>

                  <div className="mt-1 flex items-baseline justify-between font-mono text-[11px]">
                    <span className="text-stone-600">
                      Próbka: <b className="text-stone-900">{elem.samplePercent}%</b>
                    </span>
                    <span className="text-stone-500 text-[10px]">
                      Wzorzec: {elem.theoreticalPercent}%
                    </span>
                  </div>

                  <div className="text-[10px] text-stone-500 mt-1 font-mono pt-1 border-t border-stone-200">
                    Limit: [{elem.toleranceMin}% - {elem.toleranceMax}%] ({elem.tierLabel})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WŁAŚCIWOŚCI DIAGNOSTYCZNE */}
          <div className="pt-4 border-t-2 border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono flex-1">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Twardość</span>
                <span className="text-stone-900 font-bold">{topMatch.mineral.diagnostics.hardness} Mohsa</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Rysa</span>
                <span className="text-stone-900 font-bold">{topMatch.mineral.diagnostics.streak}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Połysk</span>
                <span className="text-stone-900 font-bold">{topMatch.mineral.diagnostics.luster}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Gęstość</span>
                <span className="text-stone-900 font-bold">{topMatch.mineral.diagnostics.density}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedMatch(topMatch)}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 font-mono font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.3)] active:translate-x-0.5 active:translate-y-0.5 shrink-0"
            >
              <span>Pełna karta minerału</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* POZOSTAŁE PASUJĄCE MINERAŁY (LUB ROZWINIĘTE ODRZUCONE) */}
      {(hasVerifiedMatch || showDistantMatches) && otherMatches.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="font-mono text-xs font-black uppercase text-stone-700 tracking-wider block">
            {hasVerifiedMatch
              ? 'Pozostali zweryfikowani kandydaci w oknie tolerancji:'
              : 'Odrzucone pozycje teoretyczne (poza tolerancją błędu):'}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherMatches.map((m, idx) => {
              const rank = idx + 2;
              const displayNamePl = m.polymorphInfo?.isPolymorph ? m.polymorphInfo.combinedNamePl : m.mineral.namePl;
              const displayNameEn = m.polymorphInfo?.isPolymorph ? m.polymorphInfo.combinedNameEn : m.mineral.nameEn;

              return (
                <div
                  key={m.mineral.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`p-3.5 rounded border-2 cursor-pointer transition-all flex flex-col justify-between group shadow-sm ${
                    m.isVerified
                      ? 'bg-[#ffffff] hover:bg-stone-50 border-stone-800'
                      : 'bg-[#faf8f3] hover:bg-stone-100 border-stone-300 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 font-mono">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-stone-500">#{rank}</span>
                        <h4 className="text-sm font-black text-stone-900 group-hover:underline">
                          {displayNamePl}
                        </h4>
                        <span className="text-xs text-stone-500 italic">({displayNameEn})</span>
                      </div>
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded border border-stone-400 bg-stone-100">
                        {m.score}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2 flex-wrap font-mono text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-800 font-bold">
                        {m.mineral.formula}
                      </span>
                      <span className="text-stone-600">{m.mineral.mineralGroup}</span>
                      {m.isVerified ? (
                        <span className="text-emerald-800 font-bold">[ZWERYFIKOWANY]</span>
                      ) : (
                        <span className="text-rose-800 font-bold">[BŁĄD: {m.maxDiffSymbol} &Delta;{m.maxElementDifference}%]</span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 font-serif italic line-clamp-2">
                      {m.mineral.diagnostics.tests}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span>Lekkie: {m.mineral.lightElementsPercent}% | H: {m.mineral.diagnostics.hardness}</span>
                    <span className="text-stone-800 group-hover:translate-x-0.5 transition-transform font-bold flex items-center">
                      Karta <ChevronRight className="w-3.5 h-3.5" />
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
