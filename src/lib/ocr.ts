'use client';

import { createWorker } from 'tesseract.js';

export interface OcrProgress {
  status: string;
  progress: number;
}

/**
 * Uruchamia OCR za pomocą Tesseract.js po stronie klienta (WebAssembly).
 * Używa whitelist znaków, by przyspieszyć rozpoznawanie i wyeliminować szum.
 */
export async function recognizeTextFromImage(
  imageSource: string | HTMLCanvasElement,
  onProgress?: (progress: OcrProgress) => void
): Promise<string> {
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (onProgress && m) {
        let statusText = 'Inicjalizacja silnika OCR...';
        if (m.status === 'loading tesseract core') statusText = 'Ładowanie rdzenia WebAssembly...';
        else if (m.status === 'loaded tesseract core') statusText = 'Załadowano WebAssembly';
        else if (m.status === 'loading language traineddata') statusText = 'Pobieranie słownika znaków...';
        else if (m.status === 'loaded language traineddata') statusText = 'Załadowano słownik znaków';
        else if (m.status === 'initializing api') statusText = 'Inicjalizacja API Tesseract...';
        else if (m.status === 'recognizing text') statusText = 'Rozpoznawanie tekstu z obrazu...';

        onProgress({
          status: statusText,
          progress: typeof m.progress === 'number' ? Math.round(m.progress * 100) : 0
        });
      }
    }
  });

  try {
    // Whitelist znaków: tylko litery, cyfry, kropka, przecinek, procent, dwukropek, plus/minus
    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.%:+- ,'
    });

    const ret = await worker.recognize(imageSource);
    return ret.data.text;
  } finally {
    await worker.terminate();
  }
}
