import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import {
  APP_COPYRIGHT_LINE,
  APP_PAGE_DESCRIPTION,
  APP_PAGE_TITLE,
} from "@/utils/constants";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_PAGE_TITLE,
  description: APP_PAGE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" />
        {/* Watermark */}
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[200] pointer-events-none select-none">
          <p className="text-[9px] sm:text-[10px] text-black/15 tracking-wider text-center">
            {APP_COPYRIGHT_LINE}
          </p>
        </div>
      </body>
    </html>
  );
}
