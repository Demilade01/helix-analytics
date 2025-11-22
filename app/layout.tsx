import type { Metadata } from "next";
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
  title: {
    default: "Helix Analytics | Profitability Intelligence Platform",
    template: "%s | Helix Analytics",
  },
  description:
    "A modern decision layer for executives who need a unified, trustworthy view of financial and operational health. Built with glass-grade clarity, governed access, and real-time intelligence.",
  keywords: [
    "profitability analytics",
    "financial intelligence",
    "executive dashboards",
    "sector-aware analytics",
    "enterprise finance",
    "real-time KPIs",
    "healthcare analytics",
    "banking analytics",
    "retail analytics",
  ],
  authors: [{ name: "Helix Analytics" }],
  creator: "Helix Analytics",
  publisher: "Helix Analytics",
  metadataBase: process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Helix Analytics | Profitability Intelligence Platform",
    description:
      "A modern decision layer for executives who need a unified, trustworthy view of financial and operational health.",
    siteName: "Helix Analytics",
  },
  twitter: {
    card: "summary_large_image",
    title: "Helix Analytics | Profitability Intelligence Platform",
    description:
      "A modern decision layer for executives who need a unified, trustworthy view of financial and operational health.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#010203] text-slate-300 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
