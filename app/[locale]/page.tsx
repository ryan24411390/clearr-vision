"use client";

import { useTranslations } from 'next-intl';
import { StoryHero } from '@/components/sections/hero/story-hero';
import { ProductShowcase } from '@/components/sections/product-showcase';
import { BentoShowcase } from '@/components/sections/bento-showcase';
import { WhyClearrSection } from '@/components/sections/why-clearr';
import { QuizCTASection } from '@/components/sections/quiz-cta';
import { TrustSection } from '@/components/sections/trust-section';
import { Link } from '@/lib/navigation';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const common = useTranslations('Common');
  const finalCta = useTranslations('FinalCTA');

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">

      <StoryHero />

      <ProductShowcase />
      <BentoShowcase />

      <WhyClearrSection />

      <QuizCTASection />

      <TrustSection />

      {/* Final CTA Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative rounded-3xl overflow-hidden bg-card border border-border p-12 md:p-20 lg:p-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 pointer-events-none" />
            <motion.div
              className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {finalCta('title')}
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {finalCta('description')}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="h-14 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold glow-teal transition-all duration-300 group"
                  >
                    {common('buyNow')}
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 rounded-full border-border hover:border-primary hover:bg-primary/10 text-base font-semibold transition-all duration-300"
                  >
                    {finalCta('viewCollections')}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
