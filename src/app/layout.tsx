import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Eagle Eye — Monitoring Przetargów Szkoleniowych",
    template: "%s | Eagle Eye",
  },
  description:
    "Monitoring przetargów szkoleniowych BZP, TED, BUR i KFS. AI scoring, kalkulator ofert, analiza konkurencji.",
  metadataBase: new URL("https://eagle-eye.hatedapps.pl"),
  openGraph: {
    title: "Eagle Eye — Monitoring Przetargów Szkoleniowych",
    description:
      "Monitoring przetargów szkoleniowych. AI scoring, kalkulator ofert, analiza konkurencji. 4 mld PLN rynku.",
    url: "https://eagle-eye.hatedapps.pl",
    siteName: "Eagle Eye",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eagle Eye — Monitoring Przetargów Szkoleniowych",
    description:
      "AI monitoring przetargów szkoleniowych BZP, TED, BUR i KFS.",
  },
  robots: { index: true, follow: true },
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
