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
    <div className="notebook-sheet-subtle rounded-lg overflow-hidden mt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left bg-stone-100 hover:bg-stone-200 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-stone-700" />
          <span className="text-xs font-mono font-bold text-stone-900">
            Surowy wydruk OCR (Tesseract.js)
          </span>
          <span className="text-[10px] bg-stone-200 text-stone-700 font-mono px-2 py-0.5 rounded border border-stone-400">
            {rawText.length} znaków
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-stone-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-stone-600" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-stone-300 bg-[#ffffff] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-serif italic text-stone-600">
              Możesz ręcznie poprawić tekst i kliknąć „Ponów ekstrakcję Regexem”:
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs font-mono font-bold rounded border border-stone-400 bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
              <span>{copied ? 'Skopiowano' : 'Kopiuj tekst'}</span>
            </button>
          </div>

          <textarea
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            rows={6}
            className="w-full p-3 font-mono text-xs bg-[#faf8f3] border-2 border-stone-400 rounded text-stone-900 focus:outline-none focus:border-stone-900 leading-relaxed"
          />

          {onReparse && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleReparse}
                className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ponów ekstrakcję Regexem</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
