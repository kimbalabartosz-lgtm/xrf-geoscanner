import { PreprocessingOptions } from '@/types';

/**
 * Oblicza optymalny próg binaryzacji metodą Otsu (automatyczny threshold)
 */
export function calculateOtsuThreshold(grayData: Uint8ClampedArray): number {
  const histogram = new Array(256).fill(0);
  const totalPixels = grayData.length / 4;

  for (let i = 0; i < grayData.length; i += 4) {
    histogram[grayData[i]]++;
  }

  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }

  let sumB = 0;
  let weightB = 0;
  let weightF = 0;
  let maxVariance = 0;
  let threshold = 128;

  for (let i = 0; i < 256; i++) {
    weightB += histogram[i];
    if (weightB === 0) continue;
    weightF = totalPixels - weightB;
    if (weightF === 0) break;

    sumB += i * histogram[i];
    const meanB = sumB / weightB;
    const meanF = (sum - sumB) / weightF;

    const varianceBetween = weightB * weightF * Math.pow(meanB - meanF, 2);

    if (varianceBetween > maxVariance) {
      maxVariance = varianceBetween;
      threshold = i;
    }
  }

  return threshold;
}

/**
 * Rysuje obraz na Canvasie z inteligentnym skalowaniem Super-Resolution:
 * Jeśli obraz ma mniej niż 1600px na dłuższym boku, skaluje go dwuliniowo x1.5-x2.5,
 * dzięki czemu 1-pikselowe kropki dziesiętne stają się wyraźnymi punktami.
 */
function createScaledRotatedCanvas(
  imageSource: HTMLImageElement | HTMLCanvasElement,
  rotation: number = 0
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Nie udało się utworzyć kontekstu 2D Canvas');

  const isRotated = rotation === 90 || rotation === 270;
  const originalWidth = imageSource.width;
  const originalHeight = imageSource.height;

  let scale = 1;
  const maxDim = Math.max(originalWidth, originalHeight);
  if (maxDim < 1600 && maxDim > 0) {
    scale = Math.min(2.5, 1600 / maxDim);
  }

  const targetWidth = Math.round((isRotated ? originalHeight : originalWidth) * scale);
  const targetHeight = Math.round((isRotated ? originalWidth : originalHeight) * scale);

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.drawImage(
    imageSource,
    -originalWidth / 2,
    -originalHeight / 2,
    originalWidth,
    originalHeight
  );
  ctx.restore();

  return { canvas, ctx };
}

/**
 * AUTOMATYCZNE PRZETWARZANIE OBRAZU (Auto-Levels + Auto-Invert + Super-Resolution):
 * 1. Automatycznie wykrywa ciemne tło (tryb ciemny ekranu) i odwraca kolory.
 * 2. Analizuje histogram luminancji i dynamicznie rozciąga poziomy (Auto-Levels 2% - 98%).
 *    Dzięki temu tekst staje się głęboko czarny, a tło czysto białe bez niszczenia antyaliasingu
 *    i bez zjadania pojedynczych kropek dziesiętnych.
 * 3. Opcjonalnie binaryzuje metodą Otsu (gdy mode === 'auto-otsu').
 */
export function autoPreprocessImage(
  imageSource: HTMLImageElement | HTMLCanvasElement,
  mode: 'auto-levels' | 'auto-otsu' = 'auto-levels',
  rotation: number = 0
): { canvas: HTMLCanvasElement; dataUrl: string; isInverted: boolean } {
  const { canvas, ctx } = createScaledRotatedCanvas(imageSource, rotation);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const totalPixels = data.length / 4;

  const histogram = new Array(256).fill(0);
  let totalLuminance = 0;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    histogram[gray]++;
    totalLuminance += gray;
  }

  const meanLuminance = totalLuminance / totalPixels;
  // Jeśli średnia jasność jest poniżej 120, ekran ma ciemne tło (jasne litery na czerni)
  const shouldInvert = meanLuminance < 120;

  // Znajdź 1.5-ty i 98.5-ty percentyl jasności do rozciągnięcia poziomów
  const lowCutoff = Math.floor(totalPixels * 0.015);
  const highCutoff = Math.floor(totalPixels * 0.985);

  let accumulated = 0;
  let minVal = 0;
  let maxVal = 255;

  for (let i = 0; i < 256; i++) {
    accumulated += histogram[i];
    if (accumulated >= lowCutoff && minVal === 0) {
      minVal = i;
    }
    if (accumulated >= highCutoff) {
      maxVal = i;
      break;
    }
  }

  if (maxVal <= minVal + 10) {
    minVal = 0;
    maxVal = 255;
  }

  const range = maxVal - minVal;

  // Krok 1: Konwersja na skalę szarości + Auto-Levels
  for (let i = 0; i < data.length; i += 4) {
    let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (shouldInvert) {
      gray = 255 - gray;
    }

    // Rozciągnij dynamicznie zakres do [0, 255]
    let normalized = Math.round(((gray - minVal) / range) * 255);
    normalized = Math.max(0, Math.min(255, normalized));

    data[i] = normalized;
    data[i + 1] = normalized;
    data[i + 2] = normalized;
  }

  // Krok 2: Opcjonalne Otsu jeśli wybrano tryb 'auto-otsu'
  if (mode === 'auto-otsu') {
    const otsuThresh = calculateOtsuThreshold(data);
    for (let i = 0; i < data.length; i += 4) {
      const val = data[i] >= otsuThresh ? 255 : 0;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    canvas,
    dataUrl: canvas.toDataURL('image/png'),
    isInverted: shouldInvert
  };
}

/**
 * Przetwarza obraz w Canvasie na podstawie ręcznych suwaków użytkownika
 */
export function preprocessImage(
  imageSource: HTMLImageElement | HTMLCanvasElement,
  options: PreprocessingOptions
): { canvas: HTMLCanvasElement; dataUrl: string } {
  const { rotation, contrast, brightness, threshold, grayscale, invert } = options;
  const { canvas, ctx } = createScaledRotatedCanvas(imageSource, rotation);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Współczynnik kontrastu
  const c = Math.max(-100, Math.min(100, contrast));
  const contrastFactor = (259 * (c + 255)) / (255 * (259 - c));
  const b = Math.max(-100, Math.min(100, brightness));

  // Skala szarości + Jasność + Kontrast
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let bVal = data[i + 2];

    if (grayscale || threshold > 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * bVal;
      r = gray;
      g = gray;
      bVal = gray;
    }

    r += b;
    g += b;
    bVal += b;

    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    bVal = contrastFactor * (bVal - 128) + 128;

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, bVal));
  }

  // Thresholding
  if (threshold > 0) {
    const finalThreshold = threshold === 1 ? calculateOtsuThreshold(data) : threshold;

    for (let i = 0; i < data.length; i += 4) {
      const avg = data[i];
      let val = avg >= finalThreshold ? 255 : 0;
      if (invert) {
        val = 255 - val;
      }
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
  } else if (invert) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    canvas,
    dataUrl: canvas.toDataURL('image/png')
  };
}
