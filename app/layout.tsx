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
    default: "اسپاتیفای | موسیقی برای هر لحظه",
    template: "%s | اسپاتیفای فارسی",
  },

  description:
    "به دنیای موسیقی فارسی خوش آمدی. جدیدترین آهنگ‌ها، پلی‌لیست‌های اختصاصی و آثار هنرمندان محبوب را در یک تجربه شنیداری مدرن کشف کن.",

  authors: [{ name: "اسپاتیفای فارسی" }],

  openGraph: {
    title: "اسپاتیفای فارسی",
    description:
      "آهنگ‌های محبوب، پلی‌لیست‌های شخصی‌سازی‌شده و هزاران ساعت موسیقی در یک پلتفرم فارسی.",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "اسپاتیفای فارسی",
    description:
      "موسیقی برای هر لحظه.",
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