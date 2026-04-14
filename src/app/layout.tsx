import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "Eagle Eye — Łowca Przetargów Szkoleniowych",
    template: "%s | Eagle Eye",
  },
  description:
    "Wygrywaj więcej przetargów szkoleniowych. 5 minut dziennie zamiast 40h miesięcznie. AI monitoring BZP, TED, BUR i KFS w jednym miejscu.",
  keywords: [
    "przetargi szkoleniowe",
    "monitoring przetargów",
    "BZP",
    "KFS",
    "BUR",
    "zamówienia publiczne",
    "firmy szkoleniowe",
    "kalkulator ofert",
    "eagle eye",
  ],
  metadataBase: new URL("https://eagle-eye.hatedapps.pl"),
  openGraph: {
    title: "Eagle Eye — Łowca Przetargów Szkoleniowych",
    description:
      "Wygrywaj więcej przetargów szkoleniowych. AI monitoring BZP, TED, BUR i KFS. 4 mld PLN rynku czeka na Ciebie.",
    url: "https://eagle-eye.hatedapps.pl",
    siteName: "Eagle Eye",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eagle Eye — Łowca Przetargów Szkoleniowych",
    description:
      "Wygrywaj więcej przetargów szkoleniowych. AI monitoring BZP, TED, BUR i KFS.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
