import type { Metadata } from "next";
import { Jost, Hind_Siliguri } from "next/font/google";
import "@/app/globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import SmoothScroll from "@/components/layout/smooth-scroll";
import { ToastProvider } from "@/components/ui/toast";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

// Replaced Inter with "Jost" for a Futura-like geometric, premium feel
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  subsets: ["bengali"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Smart Reading | The Class of Clarity",
  description: "Experience premium eyewear designed for the visionary. Order online with Cash on Delivery in Bangladesh.",
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${jost.variable} ${hindSiliguri.variable} antialiased bg-background text-foreground font-sans min-h-screen flex flex-col`}
      >
        <SmoothScroll />
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
