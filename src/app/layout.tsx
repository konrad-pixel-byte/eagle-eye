import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
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

// Matches mobile browser chrome to the app's dark background. Light variant
// covers system theme = light to avoid jarring white bars on iOS Safari.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

function getSupabaseOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseOrigin = getSupabaseOrigin();
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {supabaseOrigin && (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" richColors theme="dark" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
