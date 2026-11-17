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

  // Jeśli najwyższe pozycje dzielą 1. miejsce ex-aequo (np. polimorfy o tym samym składzie: Piryt i Markasyt):
  const topExAequoMatches = hasVerifiedMatch
    ? verifiedMatches.filter((m) => m.rank === 1)
    : [topMatch];

  const otherMatches = hasVerifiedMatch
    ? verifiedMatches.filter((m) => m.rank !== 1).slice(0, 10)
    : results.slice(1, 8);

  const handleCopyReport = () => {
    let report = `==========================================================\n`;
    report += `RAPORT ANALIZY SPEKTROMETRYCZNEJ XRF - GEOSCANNER\n`;
    report += `Data i czas analizy: ${new Date().toLocaleString('pl-PL')}\n`;
    report += `Baza wzorców: 1022 minerały makroskopowe\n`;
    report += `==========================================================\n\n`;

    if (hasVerifiedMatch) {
      report += `[STATUS]: MINERAŁ ZWERYFIKOWANY (W granicach tolerancji błędu)\n\n`;

      if (topExAequoMatches.length > 1) {
        report += `WYKRYTO POLIMORFY EX-AEQUO (Ten sam skład chemiczny ${topExAequoMatches[0].mineral.formula}):\n`;
        topExAequoMatches.forEach((m) => {
          report += `• [1. MIEJSCE EX-AEQUO] ${m.mineral.namePl} (${m.mineral.nameEn}) - Dopasowanie: ${m.score}%\n`;
          report += `  Wzór: ${m.mineral.formula} | Grupa: ${m.mineral.mineralGroup}\n`;
          report += `  Twardość: ${m.mineral.diagnostics.hardness} Mohsa | Rysa: ${m.mineral.diagnostics.streak} | Gęstość: ${m.mineral.diagnostics.density}\n`;
          report += `  Próby diagnostyczne: ${m.mineral.diagnostics.tests}\n\n`;
        });
        report += `Uwaga: Spektrometr XRF bada wyłącznie skład pierwiastkowy, a nie sieć krystaliczną.\nRozstrzygnięcie minerału wymaga weryfikacji cech makroskopowych (twardość, rysa, pokrój kryształów).\n\n`;
      } else {
        const top = topExAequoMatches[0];
        report += `- Oznaczona nazwa: ${top.mineral.namePl} (${top.mineral.nameEn})\n`;
        report += `- Wzór chemiczny: ${top.mineral.formula}\n`;
        report += `- Grupa mineralogiczna: ${top.mineral.mineralGroup}\n`;
        report += `- Zgodność stechiometryczna: ${top.score}%\n`;
        report += `- Pierwiastki lekkie (Z < 11): ${top.mineral.lightElementsPercent}%\n`;
        report += `- Twardość w skali Mohsa: ${top.mineral.diagnostics.hardness}\n`;
        report += `- Rysa: ${top.mineral.diagnostics.streak}\n`;
        report += `- Gęstość: ${top.mineral.diagnostics.density}\n`;
        report += `- Próby diagnostyczne: ${top.mineral.diagnostics.tests}\n\n`;
      }

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
                  className={`p-2 sm:p-2.5 rounded border-2 text-xs flex flex-col justify-between min-h-[96px] ${
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

                  <div className="mt-1 flex items-baseline justify-between font-mono text-[11px] gap-1">
                    <span className="text-stone-600 truncate">
                      Próbka: <b className="text-stone-900">{elem.samplePercent}%</b>
                    </span>
                    <span className="text-stone-500 text-[10px] shrink-0">
                      Wzór: {elem.theoreticalPercent}%
                    </span>
                  </div>

                  <div className="text-[10px] text-stone-500 mt-1 font-mono pt-1 border-t border-stone-200 truncate">
                    Limit: [{elem.toleranceMin}% - {elem.toleranceMax}%]
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
        <div className="space-y-4">
          {/* BANER DLA 1. MIEJSCA EX-AEQUO (POLIMORFY) */}
          {topExAequoMatches.length > 1 && (
            <div className="p-3.5 sm:p-4 rounded-lg border-2 border-amber-800 bg-amber-50/90 text-stone-900 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider flex-wrap">
                <span className="stamp-amber text-[10px] py-0.5">
                  🔀 1. MIEJSCE EX-AEQUO // POLIMORFY ({topExAequoMatches[0].mineral.formula})
                </span>
                <span className="text-amber-950 font-bold">Identyczny skład chemiczny dla spektrometru XRF</span>
              </div>
              <p className="text-xs text-stone-800 font-serif leading-relaxed">
                Minerały <b>{topExAequoMatches.map((m) => m.mineral.namePl).join(' oraz ')}</b> posiadają dokładnie ten sam skład chemiczny (<b>{topExAequoMatches[0].mineral.formula}</b>) i dają w spektrometrze rentgenowskim identyczny sygnał atomowy ({topExAequoMatches[0].score}% dopasowania). Obie pozycje kwalifikują się <b>ex-aequo na 1. miejscu</b>. Aby rozstrzygnąć, który minerał trzymasz w dłoni, porównaj cechy makroskopowe na kartach poniżej (pokrój kryształów, twardość, rysa, łupliwość):
              </p>
            </div>
          )}

          {/* KARTY 1. MIEJSCA (JEDEN PO DRUGIM W PRZYPADKU EX-AEQUO) */}
          {topExAequoMatches.map((match) => (
            <div key={match.mineral.id} className="notebook-sheet rounded-lg p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-2 border-stone-800 pb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="stamp-green text-xs py-0.5">
                      ✓ Potwierdzony minerał
                    </span>
                    {match.isExAequo && (
                      <span className="stamp-amber text-xs py-0.5">
                        🔀 1. Miejsce Ex-Aequo {match.polymorphInfo?.isPolymorph ? '(Polimorf)' : ''}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-mono tracking-tight">
                        {match.mineral.namePl}
                      </h3>
                      <span className="text-xs text-stone-500 font-mono italic">
                        {match.mineral.nameEn}
                      </span>
                    </div>

                    {/* Na mobile: wskaźnik dopasowania obok nazwy */}
                    <div className="sm:hidden flex flex-col items-center justify-center p-2 rounded border-2 border-stone-800 bg-[#faf8f3] shrink-0 text-center min-w-[76px]">
                      <span className="text-xl font-black font-mono text-stone-900 leading-tight">
                        {match.score}%
                      </span>
                      <span className="text-[9px] uppercase font-mono font-bold text-stone-600">
                        Dopasowanie
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 mt-2 flex-wrap text-xs font-mono">
                    <span className="px-2 py-0.5 bg-stone-900 text-stone-100 rounded font-bold">
                      {match.mineral.formula}
                    </span>
                    <span className="px-2 py-0.5 bg-stone-100 border border-stone-400 rounded text-stone-800">
                      Grupa: <b>{match.mineral.mineralGroup}</b>
                    </span>
                    {match.polymorphInfo?.partnerNamesPl && match.polymorphInfo.partnerNamesPl.length > 0 && (
                      <span className="px-2 py-0.5 bg-amber-100 border border-amber-600 text-amber-950 rounded font-bold">
                        Polimorf dla: {match.polymorphInfo.partnerNamesPl.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Wskaźnik dopasowania na desktop/tablet */}
                <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded border-2 border-stone-800 bg-[#faf8f3] min-w-[130px] shrink-0 text-center">
                  <span className="text-2xl font-black font-mono text-stone-900">
                    {match.score}%
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold text-stone-600 mt-0.5">
                    Dopasowanie XRF
                  </span>
                </div>
              </div>

              {/* CECHY FIZYCZNE I PRÓBY TERENOWE DLA TEGO MINERAŁU */}
              <div className="pt-2">
                <span className="text-stone-500 block text-[10px] uppercase font-bold mb-1.5 font-mono">
                  Właściwości makroskopowe i próby polowe ({match.mineral.namePl}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-2 rounded bg-[#ffffff] border border-stone-300">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Twardość</span>
                    <span className="text-stone-900 font-bold">{match.mineral.diagnostics.hardness} Mohsa</span>
                  </div>
                  <div className="p-2 rounded bg-[#ffffff] border border-stone-300">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Rysa</span>
                    <span className="text-stone-900 font-bold">{match.mineral.diagnostics.streak}</span>
                  </div>
                  <div className="p-2 rounded bg-[#ffffff] border border-stone-300">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Połysk</span>
                    <span className="text-stone-900 font-bold truncate block">{match.mineral.diagnostics.luster}</span>
                  </div>
                  <div className="p-2 rounded bg-[#ffffff] border border-stone-300">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Gęstość</span>
                    <span className="text-stone-900 font-bold">{match.mineral.diagnostics.density}</span>
                  </div>
                </div>
                <div className="text-xs font-serif italic text-stone-700 pt-2 border-t border-stone-200 mt-2">
                  <b>Próby terenowe:</b> {match.mineral.diagnostics.tests}
                </div>
              </div>

              {/* Przycisk pełnej karty minerału */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedMatch(match)}
                  className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 font-mono font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.3)] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span>Karta minerału: {match.mineral.namePl}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* DOMIESZKI MATRYCY SKAŁY MACIERZYSTEJ I PODSTAWIENIA IZOMORFICZNE */}
          {((topMatch.matrixInclusions && topMatch.matrixInclusions.length > 0) ||
            (topMatch.isomorphicSubstitutions && topMatch.isomorphicSubstitutions.length > 0)) && (
            <div className="p-3.5 rounded-lg border-2 border-stone-800 bg-[#faf8f3] space-y-2 text-xs font-mono">
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
          <div className="notebook-sheet rounded-lg p-5 sm:p-6 space-y-3">
            <span className="font-mono text-xs font-black uppercase text-stone-800 tracking-wider block">
              Zgodność pierwiastków w oknie tolerancji ({topMatch.mineral.namePl}{topExAequoMatches.length > 1 ? ` / ${topExAequoMatches.slice(1).map((m) => m.mineral.namePl).join(' / ')}` : ''}):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {topMatch.elementComparison.map((elem) => (
                <div
                  key={elem.symbol}
                  className={`p-2 sm:p-2.5 rounded border-2 text-xs flex flex-col justify-between min-h-[96px] ${
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

                  <div className="mt-1 flex items-baseline justify-between font-mono text-[11px] gap-1">
                    <span className="text-stone-600 truncate">
                      Próbka: <b className="text-stone-900">{elem.samplePercent}%</b>
                    </span>
                    <span className="text-stone-500 text-[10px] shrink-0">
                      Wzór: {elem.theoreticalPercent}%
                    </span>
                  </div>

                  <div className="text-[10px] text-stone-500 mt-1 font-mono pt-1 border-t border-stone-200 truncate">
                    Limit: [{elem.toleranceMin}% - {elem.toleranceMax}%]
                  </div>
                </div>
              ))}
            </div>
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
              const rankDisplay = m.rank !== undefined ? `#${m.rank}` : `#${idx + topExAequoMatches.length + 1}`;
              const displayNamePl = m.mineral.namePl;
              const displayNameEn = m.mineral.nameEn;

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
                        <span className="text-xs font-bold text-stone-500">{rankDisplay}</span>
                        {m.isExAequo && (
                          <span className="stamp-amber text-[9px] py-0 px-1 font-mono font-bold">
                            EX-AEQUO
                          </span>
                        )}
                        {m.polymorphInfo?.isPolymorph && (
                          <span className="stamp-blue text-[9px] py-0 px-1 font-mono font-bold">
                            POLIMORF
                          </span>
                        )}
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
