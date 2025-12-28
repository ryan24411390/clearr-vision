"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';



export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <section className="relative w-full h-[95vh] overflow-hidden bg-background text-foreground flex items-center">

            {/* Background Gradients for Depth */}
            <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Hero Image Background (Replaces 3D Scene) */}
            <div className="absolute inset-0 z-0">
                <div className="relative w-full h-full">
                    {/* Placeholder for the Ultra-Realistic South Asian Model */}
                    {/* In a real scenario with generated images, this would point to '/images/hero-model.jpg' */}
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
                    <Image
                        src="/images/products/classic-reader.jpg" // Temporary Placeholder using existing asset
                        alt="Stylish South Asian Model wearing Clearr Vision glasses"
                        fill
                        className="object-cover object-center opacity-80"
                        priority
                    />
                </div>
            </div>

            {/* Content Overlay */}
            <div className="container relative z-10 px-6 mx-auto">
                <div className="max-w-4xl space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider uppercase mb-6 backdrop-blur-sm">
                            {t('badge')}
                        </span>
                    </motion.div>

                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        >
                            {t('headline1')}
                        </motion.h1>
                    </div>
                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50 ml-2 md:ml-12 italic font-serif"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                        >
                            {t('headline2')}
                        </motion.h1>
                    </div>

                    <motion.p
                        className="max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed mt-6 ml-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        {t('tagline')}
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-5 pt-8 ml-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        <Link href="/shop" className="group">
                            <div className="relative inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0D9488_0%,#2DD4BF_50%,#0D9488_100%)]" />
                                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-primary px-8 py-1 text-sm font-medium text-primary-foreground backdrop-blur-3xl transition-all group-hover:bg-primary/90">
                                    {t('shopCta')} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>

                        <button className="flex items-center text-foreground font-medium hover:text-primary transition-colors px-6 py-4">
                            {t('videoCta')}
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
