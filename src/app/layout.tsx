import type { Metadata } from "next";
import { Fredoka, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import {
  APP_COPYRIGHT_LINE,
  APP_PAGE_DESCRIPTION,
  APP_PAGE_TITLE,
  DEFAULT_PUBLIC_APP_URL,
} from "@/utils/constants";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_PUBLIC_APP_URL),
  title: APP_PAGE_TITLE,
  description: APP_PAGE_DESCRIPTION,
  openGraph: {
    title: APP_PAGE_TITLE,
    description: APP_PAGE_DESCRIPTION,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans",
        nunito.variable,
        fredoka.variable,
        geistMono.variable
      )}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" />
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[200] pointer-events-none select-none">
          <p className="text-[9px] sm:text-[10px] text-party-ink/25 tracking-wider text-center">
            {APP_COPYRIGHT_LINE}
          </p>
        </div>
      </body>
    </html>
  );
}
