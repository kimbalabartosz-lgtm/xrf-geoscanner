import { PreprocessingOptions } from '@/types';

/**
 * Oblicza optymalny próg binaryzacji metodą Otsu (automatyczny threshold)
 */
function calculateOtsuThreshold(grayData: Uint8ClampedArray): number {
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
 * Przetwarza obraz w Canvasie:
 * - Inteligentne przeskalowanie (Super-Resolution x1.5-x2.5 dla małych zdjęć, by nie gubić kropek dziesiętnych)
 * - Obrót (90, 180, 270 deg)
 * - Skala szarości (luminancja ITU-R BT.601)
 * - Podbicie kontrastu i jasności
 * - Opcjonalny thresholding (binaryzacja czarno-biała)
 */
export function preprocessImage(
  imageSource: HTMLImageElement | HTMLCanvasElement,
  options: PreprocessingOptions
): { canvas: HTMLCanvasElement; dataUrl: string } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Nie udało się utworzyć kontekstu 2D Canvas');

  const { rotation, contrast, brightness, threshold, grayscale, invert } = options;

  const isRotated = rotation === 90 || rotation === 270;
  const originalWidth = imageSource.width;
  const originalHeight = imageSource.height;

  // Przeskalowanie rozdzielczości (Super-Resolution dla małych zrzutów ekranu i zdjęć z telefonu):
  // Gdy obraz ma mniej niż 1600px na dłuższym boku, kropki w ułamkach (np. 10.38) mają zaledwie 1px
  // i giną w OCR. Skalowanie dwuliniowe x1.5-x2.5 powiększa kropki do stabilnych plamek 4-9px.
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

  // Transformacja obrotu i skali
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

  // Pobierz dane pikseli do manipulacji
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Współczynnik kontrastu
  const c = Math.max(-100, Math.min(100, contrast));
  const contrastFactor = (259 * (c + 255)) / (255 * (259 - c));
  const b = Math.max(-100, Math.min(100, brightness));

  // Krok 1: Skala szarości + Jasność + Kontrast
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let bVal = data[i + 2];

    if (grayscale || threshold > 0) {
      // Skala szarości luminancji ITU-R BT.601
      const gray = 0.299 * r + 0.587 * g + 0.114 * bVal;
      r = gray;
      g = gray;
      bVal = gray;
    }

    // Jasność
    r += b;
    g += b;
    bVal += b;

    // Kontrast
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    bVal = contrastFactor * (bVal - 128) + 128;

    // Obcięcie do [0, 255]
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, bVal));
  }

  // Krok 2: Thresholding (opcjonalna binaryzacja czarno-biała)
  // Gdy threshold === 0, zachowujemy gładki grayscale z podbitym kontrastem (idealny dla LSTM OCR)
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
