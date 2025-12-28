"use client";

import React from "react";
import Image from "next/image";
import { Link } from '@/lib/navigation';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';

export function SimplePremiumHero() {
    // You can use translations here if you have them, otherwise fall back to hardcoded for now
    // const t = useTranslations('Hero'); 

    // Using hardcoded for structure, but ideally should use t()
    // Let's assume we want to use the 'common' or 'hero' namespace if it exists.

    return (
        <section className="relative w-full h-[90vh] min-h-[600px] overflow-hidden flex items-center justify-center">
            {/* Background Image with Parallax-like feel or just static premium */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero/dhaka-street-clear.png"
                    alt="Premium Background"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Overlay - "Premium Mist" - Light theme oriented (white/light grey) */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] sm:backdrop-blur-[4px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col justify-center h-full pt-20">
                <div className="max-w-4xl space-y-8">
                    {/* Small Label */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-black/5 shadow-sm w-fit"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">
                            New Collection 2025
                        </span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]"
                    >
                        Focus on What <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                            Truly Matters.
                        </span>
                    </motion.h1>

                    {/* Subheadline/Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg md:text-xl text-foreground/70 max-w-xl leading-relaxed font-light"
                    >
                        Experience clarity like never before. Premium eyewear designed in London, crafted for Bangladesh.
                        Elevate your vision with our latest ultra-light collection.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <Link href="/shop" className="group">
                            <button className="relative px-8 py-4 bg-foreground text-background rounded-full font-medium text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl">
                                <span className="relative z-10 flex items-center gap-2">
                                    Shop Collection <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </span>
                            </button>
                        </Link>

                        <Link href="/about">
                            <button className="px-8 py-4 bg-white/50 backdrop-blur-sm border border-black/10 text-foreground rounded-full font-medium text-lg transition-all hover:bg-white/80 hover:border-black/20">
                                Our Story
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Decorative/Premium Elements */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="absolute bottom-10 right-10 hidden md:block"
            >
                <div className="flex items-center gap-4 text-sm font-medium text-foreground/40 rotate-90 origin-right translate-x-8">
                    <span className="w-12 h-[1px] bg-foreground/30" />
                    SCROLL TO DISCOVER
                </div>
            </motion.div>
        </section>
    );
}
