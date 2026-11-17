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
 * Wykrywa kąt nachylenia tekstu (Deskew) za pomocą analizy wariancji profilu projekcji poziomej.
 * Zwraca kąt w stopniach (np. -5° do +5°), o jaki należy obrócić obraz, by linie tekstu były idealnie poziome.
 */
export function detectSkewAngle(
  grayPixels: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number
): number {
  // Dla szybkości próbkujemy centralny wycinek obrazu (z pominięciem marginesów ramki spektrometru)
  const startY = Math.floor(height * 0.15);
  const endY = Math.floor(height * 0.85);
  const startX = Math.floor(width * 0.15);
  const endX = Math.floor(width * 0.85);

  let maxVariance = 0;
  let bestAngle = 0;

  // Przebieg zgrubny: kąty od -12° do +12° z krokiem 1°
  for (let deg = -12; deg <= 12; deg += 1) {
    const rad = (deg * Math.PI) / 180;
    const tan = Math.tan(rad);
    const proj = new Float64Array(height);

    for (let y = startY; y < endY; y += 2) {
      const rowOffset = y * width;
      for (let x = startX; x < endX; x += 2) {
        const val = 255 - grayPixels[rowOffset + x];
        if (val > 50) {
          const py = Math.round(y - (x - width / 2) * tan);
          if (py >= 0 && py < height) {
            proj[py] += val;
          }
        }
      }
    }

    let sum = 0;
    let sumSq = 0;
    let count = 0;
    for (let i = startY; i < endY; i++) {
      sum += proj[i];
      sumSq += proj[i] * proj[i];
      count++;
    }
    const variance = (sumSq / count) - Math.pow(sum / count, 2);
    if (variance > maxVariance) {
      maxVariance = variance;
      bestAngle = deg;
    }
  }

  // Przebieg precyzyjny: krok 0.25° wokół najlepszego kąta
  const refineStart = Math.max(-12, bestAngle - 0.75);
  const refineEnd = Math.min(12, bestAngle + 0.75);

  for (let deg = refineStart; deg <= refineEnd; deg += 0.25) {
    const rad = (deg * Math.PI) / 180;
    const tan = Math.tan(rad);
    const proj = new Float64Array(height);

    for (let y = startY; y < endY; y += 2) {
      const rowOffset = y * width;
      for (let x = startX; x < endX; x += 2) {
        const val = 255 - grayPixels[rowOffset + x];
        if (val > 50) {
          const py = Math.round(y - (x - width / 2) * tan);
          if (py >= 0 && py < height) {
            proj[py] += val;
          }
        }
      }
    }

    let sum = 0;
    let sumSq = 0;
    let count = 0;
    for (let i = startY; i < endY; i++) {
      sum += proj[i];
      sumSq += proj[i] * proj[i];
      count++;
    }
    const variance = (sumSq / count) - Math.pow(sum / count, 2);
    if (variance > maxVariance) {
      maxVariance = variance;
      bestAngle = deg;
    }
  }

  return bestAngle;
}

/**
 * Kompensacja nierównomiernego oświetlenia, ostrych cieni i odblasków (Background Division / Flattening):
 * Estymuje powolne zmiany tła za pomocą rozdzielnego szybkiego filtru pudełkowego (Box Blur)
 * i normalizuje każdy piksel względem lokalnego tła.
 * Cienie i odblaski znikają, a kontrast liter w cieniu staje się identyczny jak w pełnym słońcu!
 */
export function flattenShadowsAndGlares(
  grayData: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  radius: number = 28
): Uint8Array {
  const size = width * height;
  const temp = new Float32Array(size);
  const bg = new Float32Array(size);

  // Przebieg poziomy Box Blur (O(1) na piksel dzięki oknu przesuwnemu)
  for (let y = 0; y < height; y++) {
    const rowOff = y * width;
    let sum = 0;
    let count = 0;
    for (let x = -radius; x <= radius; x++) {
      if (x >= 0 && x < width) {
        sum += grayData[rowOff + x];
        count++;
      }
    }
    for (let x = 0; x < width; x++) {
      temp[rowOff + x] = sum / count;
      const left = x - radius;
      const right = x + radius + 1;
      if (left >= 0) { sum -= grayData[rowOff + left]; count--; }
      if (right < width) { sum += grayData[rowOff + right]; count++; }
    }
  }

  // Przebieg pionowy Box Blur
  for (let x = 0; x < width; x++) {
    let sum = 0;
    let count = 0;
    for (let y = -radius; y <= radius; y++) {
      if (y >= 0 && y < height) {
        sum += temp[y * width + x];
        count++;
      }
    }
    for (let y = 0; y < height; y++) {
      bg[y * width + x] = sum / count;
      const top = y - radius;
      const bottom = y + radius + 1;
      if (top >= 0) { sum -= temp[top * width + x]; count--; }
      if (bottom < height) { sum += temp[bottom * width + x]; count++; }
    }
  }

  // Background Division: normalizacja do białego tła ~235 z zachowaniem kontrastu znaków
  const result = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    const orig = grayData[i];
    const b = bg[i] + 1;
    const val = Math.min(255, Math.max(0, Math.round((orig / b) * 235)));
    result[i] = val;
  }

  return result;
}

/**
 * Adaptacyjna binaryzacja lokalna (Sauvola / Niblack adaptive thresholding):
 * Oblicza próg dla każdego piksela w lokalnym oknie na podstawie lokalnej średniej i odchylenia standardowego.
 * Niewrażliwa na plamy światła i odblaski LCD.
 */
export function sauvolaAdaptiveThreshold(
  grayData: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  windowSize: number = 31,
  k: number = 0.18
): Uint8Array {
  const size = width * height;
  const radius = Math.floor(windowSize / 2);
  const result = new Uint8Array(size);

  // Tablica sum skumulowanych (Integral Image) dla błyskawicznego obliczania średnich
  const integral = new Float64Array((width + 1) * (height + 1));
  const integralSq = new Float64Array((width + 1) * (height + 1));

  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    let rowSumSq = 0;
    for (let x = 0; x < width; x++) {
      const val = grayData[y * width + x];
      rowSum += val;
      rowSumSq += val * val;

      const idx = (y + 1) * (width + 1) + (x + 1);
      const aboveIdx = y * (width + 1) + (x + 1);

      integral[idx] = integral[aboveIdx] + rowSum;
      integralSq[idx] = integralSq[aboveIdx] + rowSumSq;
    }
  }

  for (let y = 0; y < height; y++) {
    const y1 = Math.max(0, y - radius);
    const y2 = Math.min(height, y + radius + 1);

    for (let x = 0; x < width; x++) {
      const x1 = Math.max(0, x - radius);
      const x2 = Math.min(width, x + radius + 1);

      const count = (x2 - x1) * (y2 - y1);

      const iA = y1 * (width + 1) + x1;
      const iB = y1 * (width + 1) + x2;
      const iC = y2 * (width + 1) + x1;
      const iD = y2 * (width + 1) + x2;

      const sum = integral[iD] - integral[iB] - integral[iC] + integral[iA];
      const sumSq = integralSq[iD] - integralSq[iB] - integralSq[iC] + integralSq[iA];

      const mean = sum / count;
      const variance = Math.max(0, (sumSq / count) - (mean * mean));
      const stdDev = Math.sqrt(variance);

      // Formuła Sauvola: T = mean * (1 + k * (stdDev / 128 - 1))
      const thresh = mean * (1 + k * (stdDev / 128 - 1));

      result[y * width + x] = grayData[y * width + x] <= thresh ? 0 : 255;
    }
  }

  return result;
}

/**
 * Rysuje obraz na Canvasie z uwzględnieniem skalowania Super-Resolution,
 * obrotu o 90°/180°/270° ORAZ mikro-obrotu prostującego kąt (Deskew Angle -15°..+15°).
 */
export function createScaledRotatedCanvas(
  imageSource: HTMLImageElement | HTMLCanvasElement,
  rotation: number = 0,
  deskewAngle: number = 0
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Nie udało się utworzyć kontekstu 2D Canvas');

  const totalAngle = (rotation + deskewAngle);
  const originalWidth = imageSource.width;
  const originalHeight = imageSource.height;

  let scale = 1;
  const maxDim = Math.max(originalWidth, originalHeight);
  if (maxDim < 1600 && maxDim > 0) {
    scale = Math.min(2.5, 1600 / maxDim);
  }

  const isPerpendicular = Math.abs(rotation % 180) === 90;
  const targetWidth = Math.round((isPerpendicular ? originalHeight : originalWidth) * scale);
  const targetHeight = Math.round((isPerpendicular ? originalWidth : originalHeight) * scale);

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((totalAngle * Math.PI) / 180);
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
 * AUTOMATYCZNE PRZETWARZANIE OBRAZU:
 * Obsługuje:
 * 1. Automatyczne prostowanie kąta (Auto-Deskew) na pochylonych ekranach
 * 2. Kompensację cieni i odblasków (Shadow & Glare Flattening / Background Division)
 * 3. Auto-Invert dla ekranów w trybie ciemnym
 * 4. Adaptacyjne rozciąganie histogramu Auto-Levels
 * 5. Adaptacyjną binaryzację Sauvola (mode === 'auto-sauvola') lub Otsu (mode === 'auto-otsu')
 */
export function autoPreprocessImage(
  imageSource: HTMLImageElement | HTMLCanvasElement,
  mode: 'auto-levels' | 'auto-otsu' | 'auto-sauvola' = 'auto-levels',
  rotation: number = 0,
  autoDeskew: boolean = true
): { canvas: HTMLCanvasElement; dataUrl: string; isInverted: boolean; detectedDeskewAngle: number } {
  // 1. Krok wstępny: wykrycie ewentualnego kąta pochylenia tekstu
  let detectedDeskewAngle = 0;
  if (autoDeskew) {
    try {
      // Wygeneruj małą miniaturę do szybkiej analizy kąta (np. szerokość 360px)
      const thumbScale = 360 / Math.max(imageSource.width, imageSource.height);
      const thumbW = Math.round(imageSource.width * thumbScale);
      const thumbH = Math.round(imageSource.height * thumbScale);

      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = thumbW;
      thumbCanvas.height = thumbH;
      const thumbCtx = thumbCanvas.getContext('2d');
      if (thumbCtx) {
        thumbCtx.drawImage(imageSource, 0, 0, thumbW, thumbH);
        const thumbData = thumbCtx.getImageData(0, 0, thumbW, thumbH).data;
        const grayThumb = new Uint8Array(thumbW * thumbH);
        for (let i = 0; i < grayThumb.length; i++) {
          const idx = i * 4;
          grayThumb[i] = Math.round(0.299 * thumbData[idx] + 0.587 * thumbData[idx + 1] + 0.114 * thumbData[idx + 2]);
        }
        detectedDeskewAngle = detectSkewAngle(grayThumb, thumbW, thumbH);
      }
    } catch (e) {
      console.warn('Auto-deskew pominięty:', e);
    }
  }

  // 2. Utworzenie wyprostowanego i przeskalowanego Canvasu
  const { canvas, ctx } = createScaledRotatedCanvas(imageSource, rotation, -detectedDeskewAngle);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  const totalPixels = width * height;

  // 3. Konwersja na luminancję i badanie tła (jasne vs ciemne)
  const grayArray = new Uint8Array(totalPixels);
  let totalLuminance = 0;

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const g = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
    grayArray[i] = g;
    totalLuminance += g;
  }

  const meanLuminance = totalLuminance / totalPixels;
  const shouldInvert = meanLuminance < 120; // Tryb ciemny wyświetlacza

  if (shouldInvert) {
    for (let i = 0; i < totalPixels; i++) {
      grayArray[i] = 255 - grayArray[i];
    }
  }

  // 4. Kompensacja cieni i odblasków (Shadow & Glare Flattening)
  // Wykonujemy dzielenie przez rozmyte tło, aby wyrównać oświetlenie
  const flattened = flattenShadowsAndGlares(grayArray, width, height, 30);

  // 5. Zastosowanie wybranego trybu
  if (mode === 'auto-sauvola') {
    // Adaptacyjna binaryzacja lokalna Sauvola
    const binarized = sauvolaAdaptiveThreshold(flattened, width, height, 31, 0.18);
    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const val = binarized[i];
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
    }
  } else if (mode === 'auto-otsu') {
    // Binaryzacja globalna Otsu na wyrównanym tle
    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      data[idx] = flattened[i];
      data[idx + 1] = flattened[i];
      data[idx + 2] = flattened[i];
    }
    const otsuThresh = calculateOtsuThreshold(data);
    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const val = data[idx] >= otsuThresh ? 255 : 0;
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
    }
  } else {
    // mode === 'auto-levels' (Rozciąganie poziomów na wyrównanym tle z zachowaniem wygładzania krawędzi)
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < totalPixels; i++) {
      histogram[flattened[i]]++;
    }

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

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const val = flattened[i];
      let norm = Math.round(((val - minVal) / range) * 255);
      norm = Math.max(0, Math.min(255, norm));
      data[idx] = norm;
      data[idx + 1] = norm;
      data[idx + 2] = norm;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    canvas,
    dataUrl: canvas.toDataURL('image/png'),
    isInverted: shouldInvert,
    detectedDeskewAngle
  };
}

/**
 * Przetwarza obraz w Canvasie na podstawie ręcznych suwaków użytkownika
 */
export function preprocessImage(
  imageSource: HTMLImageElement | HTMLCanvasElement,
  options: PreprocessingOptions
): { canvas: HTMLCanvasElement; dataUrl: string } {
  const { rotation, contrast, brightness, threshold, grayscale, invert, deskewAngle = 0, flattenShadows = false } = options;
  const { canvas, ctx } = createScaledRotatedCanvas(imageSource, rotation, deskewAngle);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  const totalPixels = width * height;

  // Konwersja na skalę szarości
  let grayData = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    grayData[i] = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
  }

  // Opcjonalne usuwanie cieni i odblasków
  if (flattenShadows) {
    const flat = flattenShadowsAndGlares(grayData, width, height, 28);
    grayData.set(flat);
  }

  // Współczynnik kontrastu i jasności
  const c = Math.max(-100, Math.min(100, contrast));
  const contrastFactor = (259 * (c + 255)) / (255 * (259 - c));
  const b = Math.max(-100, Math.min(100, brightness));

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    let val = grayData[i];

    if (grayscale || threshold > 0 || threshold === -1) {
      val += b;
      val = contrastFactor * (val - 128) + 128;
      val = Math.max(0, Math.min(255, val));
      grayData[i] = val;
    }
  }

  // Binaryzacja
  if (threshold === -1) {
    // Sauvola adaptive
    const binarized = sauvolaAdaptiveThreshold(grayData, width, height, 31, 0.18);
    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      let val = binarized[i];
      if (invert) val = 255 - val;
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
    }
  } else if (threshold > 0) {
    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      data[idx] = grayData[i];
      data[idx + 1] = grayData[i];
      data[idx + 2] = grayData[i];
    }
    const finalThreshold = threshold === 1 ? calculateOtsuThreshold(data) : threshold;
    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      let val = grayData[i] >= finalThreshold ? 255 : 0;
      if (invert) val = 255 - val;
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
    }
  } else {
    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      let val = grayData[i];
      if (invert) val = 255 - val;
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return {
    canvas,
    dataUrl: canvas.toDataURL('image/png')
  };
}
