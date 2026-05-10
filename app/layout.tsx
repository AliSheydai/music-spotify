// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Vazirmatn, Geist } from 'next/font/google'
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/layout/MobileNav";
import { QueryProvider } from "@/components/layout/QueryProvider";
import ViewTransitionProvider from "@/components/view-transition";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "Lovable App",
    template: "%s — موسیقی",
  },
  description: "Lovable Generated Project",
  
  authors: [{ name: "Lovable" }],
  openGraph: {
    title: "Lovable App",
    description: "Lovable Generated Project",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@Lovable",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const vazirmatn = Vazirmatn({
  subsets: ['latin', 'arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-vazirmatn',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={cn(vazirmatn.className, "font-sans", geist.variable)} suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ViewTransitionProvider>
            <main>
              {children}
            </main>
            <MobileNav />
          </ViewTransitionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}