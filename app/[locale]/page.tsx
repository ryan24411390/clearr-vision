"use client";

import { useTranslations } from 'next-intl';
import { SmartReadingHero } from '@/components/sections/hero/smart-reading-hero';
import { FeaturedCollection } from '@/components/sections/featured-collection';

import { TrustSection } from '@/components/sections/trust-section';
import { Link } from '@/lib/navigation';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const common = useTranslations('Common');
  const finalCta = useTranslations('FinalCTA');

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">

      <SmartReadingHero />

      <FeaturedCollection />



      <TrustSection />

      {/* Final CTA Section */}
      <section className="py-24 md:py-32 bg-zinc-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative rounded-3xl overflow-hidden p-12 md:p-24 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900 pointer-events-none -z-10" />

            <div className="max-w-3xl mx-auto space-y-10">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                {finalCta('title')}
              </h2>
              <p className="text-xl md:text-2xl text-zinc-400 max-w-xl mx-auto font-light">
                {finalCta('description')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="h-16 px-10 rounded-full bg-white text-zinc-900 hover:bg-zinc-200 text-lg font-semibold transition-all duration-300"
                  >
                    {common('buyNow')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
