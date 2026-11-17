'use client';

import React, { useState } from 'react';
import { Table, Plus, Trash2, Percent, Search, RefreshCw, AlertCircle, Info, Sliders, Check } from 'lucide-react';
import { DetectedElement, ToleranceConfig } from '@/types';
import { getElementTolerance } from '@/lib/mineralMatcher';

interface EditableElementsTableProps {
  elements: DetectedElement[];
  onChange: (elements: DetectedElement[]) => void;
  onIdentify: () => void;
  rawOcrText?: string;
  toleranceConfig: ToleranceConfig;
  onToleranceConfigChange: (config: ToleranceConfig) => void;
}

export const EditableElementsTable: React.FC<EditableElementsTableProps> = ({
  elements,
  onChange,
  onIdentify,
  rawOcrText,
  toleranceConfig,
  onToleranceConfigChange
}) => {
  const [newSymbol, setNewSymbol] = useState('');
  const [newValue, setNewValue] = useState('');

  const totalPercent = elements.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);

  const handleValueChange = (id: string, valueStr: string) => {
    const num = parseFloat(valueStr.replace(',', '.'));
    onChange(
      elements.map((el) =>
        el.id === id ? { ...el, value: isNaN(num) ? 0 : Math.max(0, num) } : el
      )
    );
  };

  const handleSymbolChange = (id: string, newSym: string) => {
    onChange(
      elements.map((el) =>
        el.id === id ? { ...el, symbol: newSym.trim() } : el
      )
    );
  };

  const handleRemove = (id: string) => {
    onChange(elements.filter((el) => el.id !== id));
  };

  const handleAddElement = () => {
    if (!newSymbol.trim()) return;
    const cleanSym = newSymbol.trim();
    const formattedSym =
      cleanSym.charAt(0).toUpperCase() + cleanSym.slice(1).toLowerCase();
    const val = parseFloat(newValue.replace(',', '.')) || 0;

    const newRow: DetectedElement = {
      id: `manual-${Date.now()}`,
      symbol: formattedSym,
      value: val
    };

    onChange([...elements, newRow]);
    setNewSymbol('');
    setNewValue('');
  };

  const handleNormalize = () => {
    if (totalPercent <= 0) return;
    const factor = 100 / totalPercent;
    const normalized = elements.map((el) => ({
      ...el,
      value: Number((el.value * factor).toFixed(2))
    }));
    onChange(normalized);
  };

  const handleClear = () => {
    onChange([]);
  };

  // Popularne pierwiastki do szybkiego dodawania
  const quickElements = ['Fe', 'S', 'Cu', 'Si', 'Ca', 'Mg', 'Al', 'Pb', 'Zn', 'Mn', 'Ti', 'Ni', 'Cr', 'Mo', 'Ba', 'As'];

  return (
    <div className="notebook-sheet rounded-lg p-5 mt-5">
      {/* NAGŁÓWEK TABELI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-stone-900 text-stone-100 px-2 py-0.5 rounded">
              SEKCJA 02
            </span>
            <h2 className="text-base font-black text-stone-900 uppercase font-mono tracking-tight flex items-center gap-2">
              <Table className="w-4 h-4 text-stone-700" />
              Tabela odczytów spektrometrycznych (XRF)
            </h2>
            <span className="text-xs bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-mono font-bold border border-stone-400">
              {elements.length} pierwiastków
            </span>
          </div>
          <p className="text-xs text-stone-600 font-serif italic mt-0.5">
            Sprawdź odczyt ze spektrometru, skoryguj ewentualne cyfry i dobierz margines tolerancji
          </p>
        </div>

        {/* Akcje tabeli */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleNormalize}
            disabled={totalPercent <= 0}
            className="px-3 py-1.5 bg-[#ffffff] hover:bg-stone-100 text-stone-800 border-2 border-stone-700 rounded text-xs font-mono font-bold transition-all shadow-sm disabled:opacity-40"
            title="Przelicza udziały proporcjonalnie tak, aby suma wynosiła 100%"
          >
            Normalizuj do 100%
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={elements.length === 0}
            className="px-3 py-1.5 bg-[#ffffff] hover:bg-rose-50 text-rose-800 border-2 border-stone-700 rounded text-xs font-mono font-bold transition-all shadow-sm disabled:opacity-40"
          >
            Wyczyść
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PANEL KONTROLI TOLERANCJI BŁĘDU (TERENOWY vs ADAPTACYJNY vs SUWAK 1-8%)   */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-lg bg-[#faf8f3] border-2 border-stone-700 mb-4 shadow-inner space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-stone-800" />
            <span className="font-mono text-xs font-black uppercase text-stone-900 tracking-wider">
              Dopuszczalny błąd pomiaru (Widełki tolerancji XRF)
            </span>
          </div>

          <div className="font-mono text-xs">
            {toleranceConfig.mode === 'field' ? (
              <span className="stamp-green text-[10px] py-0.5 px-2">
                Tryb terenowy geologiczny (Zalecany)
              </span>
            ) : toleranceConfig.mode === 'adaptive' ? (
              <span className="stamp-blue text-[10px] py-0.5 px-2">
                Ścisły laboratoryjny (Monokryształ)
              </span>
            ) : (
              <span className="stamp-amber text-[10px] py-0.5 px-2">
                Widełki stałe: ±{toleranceConfig.fixedValue.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Przyciski wyboru trybu */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onToleranceConfigChange({ mode: 'field', fixedValue: 4.0 })}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border-2 w-full sm:w-auto text-left sm:text-center ${
              toleranceConfig.mode === 'field'
                ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]'
                : 'bg-[#ffffff] text-stone-800 border-stone-400 hover:border-stone-800'
            }`}
            title="Uwzględnia naturalne domieszki skały macierzystej (Si z kwarcu, Ca z kalcytu, Fe) oraz podstawienia izomorficzne (np. Fe za Al w turkusie)"
          >
            <span className="hidden sm:inline">★ Terenowy geologiczny (Matryca & Podstawienia)</span>
            <span className="sm:hidden">★ Terenowy (Matryca & Podstawienia)</span>
          </button>

          <button
            type="button"
            onClick={() => onToleranceConfigChange({ mode: 'adaptive', fixedValue: 2.0 })}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border-2 w-full sm:w-auto text-left sm:text-center ${
              toleranceConfig.mode === 'adaptive'
                ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-[2px_2px_0px_rgba(0,0,0,0.3)]'
                : 'bg-[#ffffff] text-stone-800 border-stone-400 hover:border-stone-800'
            }`}
            title="Dla czystych minerałów syntetycznych lub monokryształów bez skały macierzystej"
          >
            <span className="hidden sm:inline">Laboratoryjny: &gt;40% (±3%), 5–40% (±2%), &lt;5% (±1%)</span>
            <span className="sm:hidden">Laboratoryjny (Ścisły monokryształ)</span>
          </button>

          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto pt-1 sm:pt-0">
            <span className="text-xs font-mono text-stone-600 font-semibold mr-1">
              Stałe:
            </span>

            {[1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onToleranceConfigChange({ mode: 'fixed', fixedValue: val })}
                className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all border-2 ${
                  toleranceConfig.mode === 'fixed' && toleranceConfig.fixedValue === val
                    ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-[1px_1px_0px_rgba(0,0,0,0.3)]'
                    : 'bg-[#ffffff] text-stone-700 border-stone-300 hover:border-stone-800'
                }`}
              >
                ±{val}%
              </button>
            ))}
          </div>
        </div>

        {/* Płynny suwak tolerancji dla trybu fixed */}
        {toleranceConfig.mode === 'fixed' && (
          <div className="pt-2 border-t border-stone-300 flex items-center gap-4">
            <span className="text-xs font-mono text-stone-700 whitespace-nowrap">
              Regulacja suwakiem: <b>±{toleranceConfig.fixedValue.toFixed(1)}%</b>
            </span>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.5"
              value={toleranceConfig.fixedValue}
              onChange={(e) =>
                onToleranceConfigChange({
                  mode: 'fixed',
                  fixedValue: parseFloat(e.target.value)
                })
              }
              className="w-full h-2 bg-stone-300 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono text-stone-500 whitespace-nowrap">
              [Zakres: ±0.5% – ±8.0%]
            </span>
          </div>
        )}

        <p className="text-[11px] text-stone-600 font-serif italic pt-1">
          {toleranceConfig.mode === 'field'
            ? 'Tryb terenowy geologiczny: Bada stechiometrię fazy głównej, dopuszczając naturalne domieszki skały macierzystej (matryca: kwarc Si ≤12%, kalcyt Ca ≤10%, tlenki żelaza Fe ≤8%) oraz powszechne podstawienia kationowe (np. Fe³⁺ za Al³⁺ w turkusie).'
            : toleranceConfig.mode === 'adaptive'
            ? 'Reguła laboratoryjna: Ostra selekcja dla czystych minerałów (>40% ±3.0%, 5-40% ±2.0%, <5% ±1.0%). Wymaga braku domieszek matrycy.'
            : `Zastosowano stały margines błędu ±${toleranceConfig.fixedValue}% w obie strony dla każdego porównywanego pierwiastka.`}
        </p>
      </div>

      {/* INFORMACJA O TRYBIE TLENKOWYM / PRZELICZONYCH TLENKACH */}
      {elements.some((e) => e.isOxideConverted || e.symbol.toUpperCase() === 'LOI') && (
        <div className="mb-4 p-3 rounded border-2 border-amber-600 bg-amber-50/70 text-xs font-mono text-amber-950 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block uppercase tracking-wide">
              Tryb tlenkowy (Mining Oxides XRF):
            </span>
            <p className="font-serif text-[11px] text-amber-900 leading-relaxed">
              Wykryto stężenia przeliczone ze stechiometrii tlenków (SiO₂, Al₂O₃, Fe₂O₃, CaO itd.). 
              Tlen jest stechiometrycznie związany w strukturze tlenkowej i <b>nie jest traktowany jako brakujące pierwiastki lekkie</b>.
              Jedyną fazą lotną/lekką braną pod uwagę jest ewentualne <b>LOI (Loss on Ignition)</b>.
            </p>
          </div>
        </div>
      )}

      {/* Szybkie dodawanie pierwiastków */}
      <div className="mb-4">
        <span className="text-xs font-mono font-semibold text-stone-600 block mb-1.5">
          Szybkie dodanie pierwiastka do formularza:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickElements.map((sym) => {
            const isAlreadyAdded = elements.some((e) => e.symbol.toLowerCase() === sym.toLowerCase());
            return (
              <button
                key={sym}
                type="button"
                disabled={isAlreadyAdded}
                onClick={() => {
                  onChange([
                    ...elements,
                    { id: `quick-${Date.now()}-${sym}`, symbol: sym, value: 0 }
                  ]);
                }}
                className={`px-2 py-1 text-xs font-mono font-bold rounded border transition-colors ${
                  isAlreadyAdded
                    ? 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
                    : 'bg-[#ffffff] text-stone-800 border-stone-400 hover:border-stone-900 hover:bg-stone-100'
                }`}
              >
                +{sym}
              </button>
            );
          })}
        </div>
      </div>

      {/* TABELA DANYCH */}
      {elements.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-stone-300 rounded-lg bg-[#faf8f3]">
          <p className="text-sm font-mono font-bold text-stone-600">
            Formularz jest pusty. Wgraj zdjęcie spektrogramu powyżej lub dodaj pierwiastki ręcznie.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border-2 border-stone-800 rounded-lg bg-[#ffffff] shadow-sm">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-stone-900 text-stone-100 uppercase tracking-wider text-[11px] border-b-2 border-stone-800">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-4 w-36">Pierwiastek (Symbol)</th>
                <th className="py-2.5 px-4 w-44">Udział zmierzony (%)</th>
                <th className="py-2.5 px-4">Przypisana tolerancja</th>
                <th className="py-2.5 px-3 w-16 text-center">Usuń</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-300">
              {elements.map((el, idx) => {
                const tol = getElementTolerance(el.value, toleranceConfig);
                return (
                  <tr key={el.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-2 px-3 text-center text-stone-500 font-bold">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={el.symbol}
                        onChange={(e) => handleSymbolChange(el.id, e.target.value)}
                        className="w-24 px-2 py-1 bg-[#faf8f3] border-2 border-stone-400 rounded font-bold text-stone-900 focus:outline-none focus:border-stone-900 text-sm"
                        placeholder="np. Fe"
                      />
                      {el.isOxideConverted && el.originalOxideSymbol && (
                        <span className="text-[10px] text-stone-500 font-serif italic block mt-0.5">
                          (z tlenku {el.originalOxideSymbol}: {el.originalOxideValue}%)
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={el.value || ''}
                          onChange={(e) => handleValueChange(el.id, e.target.value)}
                          className="w-32 px-2.5 py-1 bg-[#faf8f3] border-2 border-stone-400 rounded font-bold text-stone-900 focus:outline-none focus:border-stone-900 text-sm text-right font-mono"
                          placeholder="0.00"
                        />
                        <span className="text-stone-500 font-bold">%</span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 border border-stone-400 text-[11px] text-stone-700 font-bold">
                        ±{tol.tolerance.toFixed(1)}% ({tol.tierLabel})
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemove(el.id)}
                        className="p-1 text-stone-400 hover:text-rose-700 rounded transition-colors"
                        title="Usuń wiersz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-stone-100 border-t-2 border-stone-800 font-bold text-stone-900">
              <tr>
                <td colSpan={2} className="py-2.5 px-4 text-right uppercase tracking-wider text-[11px]">
                  Suma oznaczona:
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-sm">
                  <span className={totalPercent > 101 || totalPercent < 95 ? 'text-amber-800' : 'text-stone-900'}>
                    {totalPercent.toFixed(2)}%
                  </span>
                </td>
                <td colSpan={2} className="py-2.5 px-4 text-stone-500 font-serif italic text-[11px]">
                  {totalPercent < 98
                    ? `Pozostałe ~${(100 - totalPercent).toFixed(1)}% traktowane jako pierwiastki lekkie (Z < 11: O, C, H)`
                    : 'Próbka zbilansowana'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* RĘCZNE DODAWANIE KOLEJNEGO PIERWIASTKA */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddElement();
            }}
            placeholder="Symbol (np. Cr)"
            className="w-full sm:w-32 px-3 py-2 sm:py-1.5 bg-[#ffffff] border-2 border-stone-400 rounded text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-stone-900"
          />
          <input
            type="number"
            step="0.01"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddElement();
            }}
            placeholder="Wartość % (np. 17.08)"
            className="w-full sm:w-40 px-3 py-2 sm:py-1.5 bg-[#ffffff] border-2 border-stone-400 rounded text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-stone-900 font-mono"
          />
        </div>

        <button
          type="button"
          onClick={handleAddElement}
          className="px-4 py-2 sm:py-1.5 bg-[#ffffff] hover:bg-stone-100 text-stone-900 border-2 border-stone-800 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Dodaj wiersz</span>
        </button>

        <div className="flex-1" />

        {/* PRZYCISK IDENTYFIKACJI */}
        <button
          type="button"
          onClick={onIdentify}
          disabled={elements.length === 0}
          className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_rgba(0,0,0,0.3)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40"
        >
          <Search className="w-4 h-4" />
          <span>Identyfikuj minerał (Baza 1022 pozycji)</span>
        </button>
      </div>
    </div>
  );
};
