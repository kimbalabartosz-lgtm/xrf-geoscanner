import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XRF GeoScanner - Dziennik Identyfikacji Minerałów",
  description: "Surowy notatnik geologiczny i silnik identyfikacji minerałów na podstawie zdjęć spektrometru XRF z adaptacyjną tolerancją",
  applicationName: "XRF GeoScanner",
  keywords: ["XRF", "minerały", "spektrometr", "geologia", "notatnik laboratoryjny", "Tesseract", "OCR"],
  authors: [{ name: "XRF GeoScanner" }]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f5f3ec"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5f3ec] text-stone-900 selection:bg-stone-300 selection:text-stone-900">
        {children}
      </body>
    </html>
  );
}
