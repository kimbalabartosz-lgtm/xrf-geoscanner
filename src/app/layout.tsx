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
  title: "XRF GeoScanner - Identyfikator Minerałów",
  description: "Aplikacja do identyfikacji minerałów na podstawie zdjęć ekranu spektrometru XRF z lokalnym OCR (Tesseract.js)",
  applicationName: "XRF GeoScanner",
  keywords: ["XRF", "minerały", "spektrometr", "geologia", "Tesseract", "OCR"],
  authors: [{ name: "XRF GeoScanner" }]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020617"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
