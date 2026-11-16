'use client';

import React, { useState } from 'react';
import { Table, Plus, Trash2, Percent, Search, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { DetectedElement } from '@/types';
import { ELEMENTS } from '@/data/elements';

interface EditableElementsTableProps {
  elements: DetectedElement[];
  onChange: (elements: DetectedElement[]) => void;
  onIdentify: () => void;
  rawOcrText?: string;
}

export const EditableElementsTable: React.FC<EditableElementsTableProps> = ({
  elements,
  onChange,
  onIdentify,
  rawOcrText
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
  const quickElements = ['Fe', 'S', 'Cu', 'Si', 'Ca', 'Mg', 'Al', 'Pb', 'Zn', 'Mn', 'Ti', 'Ba', 'Zr', 'Ni', 'As'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-emerald-400" />
              3. Edytowalna tabela wyników pierwiastkowych
            </h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
              {elements.length} pierwiastków
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Zweryfikuj i popraw ewentualne literówki OCR przed uruchomieniem kalkulatora minerałów
          </p>
        </div>

        {/* Przyciski akcji tabeli */}
        <div className="flex items-center gap-2">
          {elements.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleNormalize}
                title="Przelicza udziały, aby suma widzialnych pierwiastków wynosiła dokładnie 100%"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <Percent className="w-3.5 h-3.5" />
                <span>Normalizuj do 100%</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 border border-slate-700 hover:border-red-800/80 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors"
              >
                Wyczyść
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabela elementów */}
      {elements.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
          <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400 font-medium">Brak odczytanych pierwiastków</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Wgraj zdjęcie ekranu spektrometru powyżej, kliknij &quot;Wyodrębnij tekst&quot; lub dodaj pierwiastki ręcznie poniżej.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Pierwiastek (Symbol)</th>
                <th className="py-2.5 px-3">Nazwa chemiczna</th>
                <th className="py-2.5 px-3">Liczba atomowa (Z)</th>
                <th className="py-2.5 px-3">Zawartość (%)</th>
                <th className="py-2.5 px-3 text-right">Akcja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
              {elements.map((el) => {
                const elemInfo = ELEMENTS[el.symbol];
                return (
                  <tr key={el.id} className="hover:bg-slate-850 transition-colors">
                    <td className="py-2 px-3 font-mono font-bold text-sm text-emerald-400">
                      <input
                        type="text"
                        value={el.symbol}
                        onChange={(e) => handleSymbolChange(el.id, e.target.value)}
                        className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-bold text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase"
                      />
                    </td>
                    <td className="py-2 px-3 text-slate-300 font-medium">
                      {elemInfo ? elemInfo.namePl : <span className="text-amber-400">Nierozpoznany symbol</span>}
                    </td>
                    <td className="py-2 px-3 text-slate-400 font-mono">
                      {elemInfo ? `Z = ${elemInfo.atomicNumber}` : '-'}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={el.value}
                          onChange={(e) => handleValueChange(el.id, e.target.value)}
                          className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right font-mono font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <span className="text-slate-400">%</span>
                        {el.errorMargin !== undefined && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            ±{el.errorMargin}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(el.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                        title="Usuń wiersz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pasek sumaryczny i formularz dodawania */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Formularz szybkiego dodawania pierwiastka */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Symbol (np. Fe)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <input
            type="number"
            step="0.1"
            placeholder="Wartość %"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={handleAddElement}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Dodaj</span>
          </button>
        </div>

        {/* Suma procentowa */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 mr-2">Suma odczytana:</span>
            <span
              className={`font-mono font-bold text-sm ${
                Math.abs(totalPercent - 100) < 1
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {totalPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Szybkie skróty popularnych pierwiastków */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-500">Dodaj szybko:</span>
        {quickElements.map((sym) => (
          <button
            key={sym}
            type="button"
            onClick={() => {
              if (!elements.some((e) => e.symbol.toUpperCase() === sym.toUpperCase())) {
                onChange([...elements, { id: `quick-${sym}-${Date.now()}`, symbol: sym, value: 0 }]);
              }
            }}
            className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          >
            +{sym}
          </button>
        ))}
      </div>

      {/* Informacja o pierwiastkach lekkich (XRF physics note) */}
      <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Fizyka spektrometrii XRF:</span> Spektrometry ręczne nie wykrywają pierwiastków o Z &lt; 11 (wodoru, węgla, tlenu, fluoru). Dlatego w minerałach takich jak kwarc (SiO₂), kalcyt (CaCO₃) czy piryt (FeS₂), silnik automatycznie porównuje profil na podstawie widzialnej matrycy pierwiastkowej oraz stosunków molowych.
        </div>
      </div>

      {/* Główny przycisk Identyfikuj minerał */}
      <div className="mt-5">
        <button
          type="button"
          disabled={elements.length === 0}
          onClick={onIdentify}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/20 active:scale-[0.99] transition-all"
        >
          <Search className="w-5 h-5 stroke-[2.4]" />
          <span>Identyfikuj minerał (oblicz stosunek molowy i porównaj z bazą)</span>
        </button>
      </div>
    </div>
  );
};
