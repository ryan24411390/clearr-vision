"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function StoryHero() {
    const t = useTranslations("StoryHero");
    const [isLoaded, setIsLoaded] = useState(false);

    // Trigger animation after component mounts
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Animation variants for staggered children
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.5,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as const,
            },
        },
    };

    return (
        <section className="relative min-h-screen w-full overflow-hidden">
            {/* Blur Overlay - Fades out on load */}
            <motion.div
                className="absolute inset-0 z-50 pointer-events-none"
                initial={{
                    backdropFilter: "blur(12px) grayscale(0.3)",
                    backgroundColor: "rgba(250, 250, 250, 0.3)"
                }}
                animate={isLoaded ? {
                    backdropFilter: "blur(0px) grayscale(0)",
                    backgroundColor: "rgba(250, 250, 250, 0)"
                } : {}}
                transition={{
                    duration: 1.4,
                    delay: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
            />

            {/* Background */}
            <div className="absolute inset-0 z-0">
                {/* Ambient gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-background to-stone-50" />

                {/* Subtle pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Main Content - 50/50 Split */}
            <div className="relative z-10 min-h-screen w-full">
                <div className="container mx-auto h-full px-4 md:px-8">
                    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-20 lg:py-0">

                        {/* Left Side - Text Content */}
                        <motion.div
                            className="flex flex-col justify-center order-2 lg:order-1"
                            variants={containerVariants}
                            initial="hidden"
                            animate={isLoaded ? "visible" : "hidden"}
                        >
                            {/* Blurry placeholder text - fades out */}
                            <AnimatePresence>
                                {!isLoaded && (
                                    <motion.div
                                        className="absolute"
                                        initial={{ opacity: 0.4 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        style={{ filter: "blur(8px)" }}
                                    >
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground/30">
                                            {t("blurryText")}
                                        </h1>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Badge */}
                            <motion.div variants={itemVariants}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit mb-6">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-sm font-medium text-primary">
                                        {t("badge")}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Main Headlines */}
                            <motion.h1
                                variants={itemVariants}
                                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground mb-2"
                            >
                                {t("headline1")}
                            </motion.h1>

                            <motion.h1
                                variants={itemVariants}
                                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6"
                            >
                                <span className="text-primary">
                                    {t("headline2")}
                                </span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                variants={itemVariants}
                                className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed mb-8"
                            >
                                {t("description")}
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Link href="/shop">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-foreground text-background font-semibold text-base transition-all duration-300 hover:bg-foreground/90 shadow-lg hover:shadow-xl"
                                    >
                                        {t("primaryCta")}
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </motion.button>
                                </Link>
                                <Link href="/about">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full border-2 border-border text-foreground font-semibold text-base transition-all duration-300 hover:border-foreground/50 hover:bg-foreground/5"
                                    >
                                        {t("secondaryCta")}
                                    </motion.button>
                                </Link>
                            </motion.div>

                            {/* Trust indicators */}
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center gap-6 text-sm text-muted-foreground mt-10"
                            >
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5 text-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>{t("trustItem1")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5 text-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>{t("trustItem2")}</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Side - Visual/Product */}
                        <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-0 lg:h-full order-1 lg:order-2">
                            {/* Product Image Container */}
                            <motion.div
                                className="relative w-full max-w-lg aspect-square"
                                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                                animate={isLoaded ? { opacity: 1, x: 0, scale: 1 } : {}}
                                transition={{
                                    duration: 0.9,
                                    delay: 0.8,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                            >
                                {/* Glow effect behind product */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl scale-110"
                                    initial={{ opacity: 0 }}
                                    animate={isLoaded ? { opacity: 1 } : {}}
                                    transition={{ duration: 1, delay: 1 }}
                                />

                                {/* Floating ambient shapes */}
                                <motion.div
                                    className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={isLoaded ? {
                                        opacity: [0, 0.3, 0.5, 0.3],
                                        scale: [0.8, 1, 1.2, 1],
                                    } : {}}
                                    transition={{
                                        duration: 4,
                                        delay: 1.2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                                <motion.div
                                    className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-2xl"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={isLoaded ? {
                                        opacity: [0, 0.4, 0.2, 0.4],
                                        scale: [0.8, 1.1, 1, 1.1],
                                    } : {}}
                                    transition={{
                                        duration: 5,
                                        delay: 1.4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />

                                {/* Main Product Image */}
                                <motion.div
                                    className="relative z-10 w-full h-full"
                                    whileHover={{ scale: 1.02, rotate: 2 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                >
                                    <Image
                                        src="/images/products/rimless-silver.jpg"
                                        alt="Clearr Vision Premium Glasses"
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                    />
                                </motion.div>

                                {/* Floating feature badges */}
                                <motion.div
                                    className="absolute top-10 -left-4 lg:-left-10 z-20"
                                    initial={{ opacity: 0, x: -30, y: 10 }}
                                    animate={isLoaded ? { opacity: 1, x: 0, y: 0 } : {}}
                                    transition={{
                                        duration: 0.6,
                                        delay: 1.4,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                >
                                    <motion.div
                                        className="bg-card/90 backdrop-blur-md border border-border rounded-2xl px-4 py-3 shadow-lg"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{
                                            duration: 3,
                                            delay: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-lg">🪶</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    {t("featureBadge1Label")}
                                                </p>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {t("featureBadge1Value")}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    className="absolute bottom-20 -right-4 lg:-right-10 z-20"
                                    initial={{ opacity: 0, x: 30, y: -10 }}
                                    animate={isLoaded ? { opacity: 1, x: 0, y: 0 } : {}}
                                    transition={{
                                        duration: 0.6,
                                        delay: 1.6,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                >
                                    <motion.div
                                        className="bg-card/90 backdrop-blur-md border border-border rounded-2xl px-4 py-3 shadow-lg"
                                        animate={{ y: [0, 5, 0] }}
                                        transition={{
                                            duration: 3.5,
                                            delay: 2.2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <span className="text-lg">🛡️</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    {t("featureBadge2Label")}
                                                </p>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {t("featureBadge2Value")}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 2.0 }}
            >
                <span className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
                    {t("scrollHint")}
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <ChevronDown className="w-6 h-6 text-muted-foreground" />
                </motion.div>
            </motion.div>
        </section>
    );
}
