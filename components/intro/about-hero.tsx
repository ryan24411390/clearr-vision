"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

export function AboutHero() {
    const t = useTranslations('About');

    return (
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-7xl font-bold tracking-tight mb-6"
                >
                    {t('heroTitle')} <br />
                    <span className="text-primary italic">{t('heroTitleHighlight')}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    {t('heroDescription')}
                </motion.p>
            </div>
        </section>
    );
}
