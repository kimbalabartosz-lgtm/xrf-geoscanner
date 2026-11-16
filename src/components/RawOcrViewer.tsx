'use client';

import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Copy, Check, RefreshCw } from 'lucide-react';

interface RawOcrViewerProps {
  rawText: string;
  onReparse?: (text: string) => void;
}

export const RawOcrViewer: React.FC<RawOcrViewerProps> = ({ rawText, onReparse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState(rawText);

  // Aktualizuj tekst gdy zmieni się z zewnątrz
  React.useEffect(() => {
    setEditableText(rawText);
  }, [rawText]);

  if (!rawText) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReparse = () => {
    if (onReparse) {
      onReparse(editableText);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg mt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left bg-slate-900 hover:bg-slate-850 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">
            Podgląd surowego tekstu z OCR (Tesseract.js)
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
            {rawText.length} znaków
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-slate-400">
              Możesz poprawić tekst i kliknąć &quot;Parsuj ponownie&quot;:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Skopiowano' : 'Kopiuj'}</span>
              </button>
              {onReparse && (
                <button
                  type="button"
                  onClick={handleReparse}
                  className="px-2.5 py-1 rounded bg-emerald-700/60 hover:bg-emerald-600 text-white text-[11px] flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Parsuj ponownie</span>
                </button>
              )}
            </div>
          </div>
          <textarea
            rows={5}
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      )}
    </div>
  );
};
