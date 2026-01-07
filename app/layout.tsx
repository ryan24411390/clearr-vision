import type { Metadata } from "next";
import { Jost, Hind_Siliguri } from "next/font/google";
import Script from "next/script";
import "@/app/globals.css";
import SmoothScroll from "@/components/layout/smooth-scroll";
import { ToastProvider } from "@/components/ui/toast";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

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
  title: "Smart Reading | প্রিমিয়াম চশমা",
  description: "প্রিমিয়াম আইওয়্যার অভিজ্ঞতা নিন। বাংলাদেশে ক্যাশ অন ডেলিভারিতে অর্ডার করুন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2245398195954310');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2245398195954310&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${jost.variable} ${hindSiliguri.variable} antialiased bg-background text-foreground font-sans min-h-screen flex flex-col`}
      >
        <SmoothScroll />
        <ToastProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
