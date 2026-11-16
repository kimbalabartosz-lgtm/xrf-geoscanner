# XRF GeoScanner — Identyfikator Minerałów ze Spektrometru XRF

Mobilna aplikacja webowa stworzona w **Next.js (App Router)** z **Tailwind CSS**, wykorzystująca bibliotekę **Tesseract.js** (uruchamianą w 100% po stronie klienta za pomocą WebAssembly) oraz wyspecjalizowany silnik stechiometryczny do identyfikacji minerałów na podstawie zdjęć ekranów spektrometrów rentgenowskich (XRF).

---

## 🌟 Główne Funkcjonalności

1. **Aparat i Wstępne Przetwarzanie Obrazu (Canvas HTML5)**:
   - Bezpośrednie wywoływanie tylnego aparatu w smartfonie (`capture="environment"`).
   - Obsługa wgrywania z pliku, przeciągania (Drag & Drop) oraz wklejania ze schowka (Ctrl+V).
   - **Binarizacja i Kontrast (Thresholding)**: redukcja odblasków ze szklanej szybki spektrometru i wyostrzenie cyfrowej czcionki LCD wyświetlacza.
   - Obrót zdjęcia o 90° w razie wykonania zdjęcia poziomo.

2. **Lokalny Silnik OCR (Tesseract.js)**:
   - Działa całkowicie po stronie przeglądarki użytkownika (brak kosztów serwerowych, brak limitów timeout na Vercel).
   - **Ograniczenie znaków (Whitelist)**: `tessedit_char_whitelist` ograniczone do symboli, cyfr i znaku `%`, co drastycznie eliminuje szum i artefakty.
   - Pasek postępu analizy w czasie rzeczywistym.

3. **Parser Wyrażeń Regularnych (Regex)**:
   - Wykrywanie symboli pierwiastków (np. `Fe`, `Cu`, `S`, `Si`, `Ca`, `Mg`, `Pb`, `Zn`, `Mn`, `Ti`) oraz przypisanych wartości procentowych.
   - Inteligentna korekta typowych błędów OCR ekranów LCD (np. `5i` -> `Si`, `S1` -> `Si`, `A1` -> `Al`).
   - Obsługa przeliczania wartości ppm (np. 10 000 ppm = 1.00%) oraz form tlenkowych (`SiO₂`, `Al₂O₃`, `Fe₂O₃`).

4. **Edytowalna Tabela Pośrednia**:
   - Możliwość natychmiastowej korekty odczytu jednym kliknięciem palca przed kalkulacją.
   - Dodawanie i usuwanie pierwiastków, funkcja „Normalizuj do 100%”.
   - Gotowe próbki wzorcowe (Piryt, Chalkopiryt, Dolomit, Galena, Sfalleryt, Skaleń, Baryt, Cyrkon) do błyskawicznych testów bez spektrometru pod ręką.

5. **Silnik Identyfikacji Minerałów (Baza 63 Minerałów)**:
   - **Fizyka XRF**: Uwzględnienie faktu, że spektrometry ręczne nie wykrywają pierwiastków o $Z < 11$ (H, Li, Be, B, C, N, O, F).
   - Przeliczanie wag procentowych na liczby moli ($n = \frac{m}{M}$).
   - Weryfikacja kluczowych stosunków molowych (np. Fe : S = 1 : 2 dla pirytu, Cu : Fe = 1 : 1 dla chalkopirytu, Ca : Mg = 1 : 1 dla dolomitu).
   - Ranking dopasowania (%) wraz z cechami diagnostycznymi:
     - Twardość w skali Mohsa
     - Barwa rysy na porcelanie
     - Połysk i barwa
     - Gęstość ($g/cm³$)
     - Próby terenowe (np. reakcja z HCl, magnetyzm, łupliwość, zapach)
     - Występowanie geologiczne

---

## 🚀 Uruchomienie Lokalne

```bash
# Wejdź do katalogu
cd "c:\Users\Tymek\Desktop\projekty stronki\xrf"

# Zainstaluj zależności (jeśli jeszcze nie zainstalowano)
npm install

# Uruchom serwer developerski
npm run dev
```

Aplikacja będzie dostępna pod adresem: [http://localhost:3000](http://localhost:3000).

---

## 📦 Wdrożenie na GitHub i Vercel

1. **Wypchnięcie na GitHub**:
   ```bash
   git remote add origin https://github.com/TWOJA_NAZWA/xrf-geoscanner.git
   git push -u origin main
   ```
2. **Vercel**:
   - Zaloguj się na [vercel.com](https://vercel.com).
   - Kliknij **Add New Project** i zaimportuj repozytorium `xrf-geoscanner`.
   - Vercel automatycznie wykryje Next.js i wdroży aplikację pod darmową domeną `*.vercel.app` z aktywnym protokołem **HTTPS** (wymaganym na telefonach do uruchomienia kamery).
