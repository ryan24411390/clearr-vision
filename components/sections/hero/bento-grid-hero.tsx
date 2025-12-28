"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from '@/lib/navigation';
import { ArrowUpRight, ArrowRight, ShieldCheck, Play } from "lucide-react";

// --- Scramble Text Component ---
const ScrambleText = ({ text, className }: { text: string; className?: string }) => {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    useEffect(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(
                text
                    .split("")
                    .map((letter, index) => {
                        if (index < iterations) return text[index];
                        if (letter === " ") return " ";
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span className={className}>{display}</span>;
};

// --- Optimized Spotlight Card ---
const SpotlightCard = ({
    children,
    className = "",
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const { left, top } = cardRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    // Smooth spring for spotlight position
    const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
            onMouseMove={handleMouseMove}
            className={`group relative overflow-hidden rounded-2xl bg-card border border-border ${className}`}
            style={{ willChange: "transform" }}
        >
            {/* Spotlight Effect - CSS-only for performance */}
            <motion.div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(400px circle at ${springX.get()}px ${springY.get()}px, rgba(45, 212, 191, 0.08), transparent 40%)`,
                }}
            />

            {/* Border Glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>

            <div className="relative h-full z-10">{children}</div>
        </motion.div>
    );
};

// --- Bento Items Configuration ---
const items = [
    { id: "title", colSpan: "md:col-span-2", rowSpan: "md:row-span-2", type: "title", delay: 0.1 },
    { id: "poster", colSpan: "md:col-span-1", rowSpan: "md:row-span-2", type: "poster", image: "/images/hero/rimless-poster.png", title: "Future.", subtitle: "Collection", delay: 0.15 },
    { id: "prod-1", colSpan: "md:col-span-1", rowSpan: "md:row-span-1", type: "product", image: "/images/products/rimless-silver.jpg", title: "Titanium Air", price: "৳2,500", delay: 0.2 },
    { id: "prod-2", colSpan: "md:col-span-1", rowSpan: "md:row-span-1", type: "product", image: "/images/products/classic-reader.jpg", title: "Invisible", price: "৳1,800", delay: 0.25 },
    { id: "feature", colSpan: "md:col-span-1", rowSpan: "md:row-span-1", type: "feature", title: "Aerospace", subtitle: "Grade Titanium", delay: 0.3 },
    { id: "stat", colSpan: "md:col-span-1", rowSpan: "md:row-span-1", type: "stat", value: "9g", label: "Weightless", delay: 0.35 },
    { id: "prod-3", colSpan: "md:col-span-1", rowSpan: "md:row-span-1", type: "product", image: "/images/products/executive.jpg", title: "Executive", price: "৳3,000", delay: 0.4 },
    { id: "cta", colSpan: "md:col-span-1", rowSpan: "md:row-span-1", type: "cta", delay: 0.45 },
];

export function BentoGridHero() {
    return (
        <section className="relative w-full min-h-screen overflow-hidden pt-24 pb-8 px-4 md:px-6 flex flex-col justify-center bg-background">
            {/* Noise Texture - Inlined */}
            <div className="absolute inset-0 z-0 noise-texture" />

            {/* Ambient Gradients - Reduced blur for performance */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full gpu"
                    style={{
                        background: "radial-gradient(circle, rgba(45, 212, 191, 0.12) 0%, transparent 70%)",
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full gpu"
                    style={{
                        background: "radial-gradient(circle, rgba(250, 247, 242, 0.06) 0%, transparent 70%)",
                    }}
                    animate={{
                        scale: [1, 1.15, 1],
                        x: [0, 20, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Grid Container */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-3 md:gap-4 h-full max-h-[850px] w-full max-w-[1400px] mx-auto">
                {items.map((item) => {
                    // 1. TITLE CARD
                    if (item.type === "title") {
                        return (
                            <SpotlightCard
                                key={item.id}
                                className={`${item.colSpan} ${item.rowSpan} p-8 md:p-10 flex flex-col justify-between`}
                                delay={item.delay}
                            >
                                <div>
                                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted border border-border mb-8">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                                        <ScrambleText
                                            text="COLLECTION 2025"
                                            className="text-[10px] font-semibold tracking-[0.3em] text-muted-foreground"
                                        />
                                    </div>

                                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] text-foreground leading-[0.9]">
                                        Rimless
                                        <br />
                                        <span className="gradient-text-primary">
                                            <ScrambleText text="Effect." />
                                        </span>
                                    </h1>
                                </div>

                                <div className="max-w-md mt-8">
                                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                                        Weightless engineering. Limitless vision.
                                        <br className="hidden sm:block" />
                                        The most advanced eyewear we&apos;ve ever created.
                                    </p>

                                    <Link href="/shop">
                                        <motion.button
                                            className="group relative px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold text-sm tracking-wide overflow-hidden"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                Explore Collection
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                            <motion.div
                                                className="absolute inset-0 bg-primary"
                                                initial={{ x: "-100%" }}
                                                whileHover={{ x: 0 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            />
                                        </motion.button>
                                    </Link>
                                </div>
                            </SpotlightCard>
                        );
                    }

                    // 2. POSTER CARD
                    if (item.type === "poster") {
                        return (
                            <SpotlightCard
                                key={item.id}
                                className={`${item.colSpan} ${item.rowSpan} !p-0 min-h-[300px]`}
                                delay={item.delay}
                            >
                                <div className="absolute inset-0 w-full h-full">
                                    <Image
                                        src={item.image!}
                                        alt="Collection Poster"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <motion.div
                                            className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <Play className="w-6 h-6 text-foreground fill-foreground ml-1" />
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 z-10">
                                    <p className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-2 text-primary">
                                        {item.subtitle}
                                    </p>
                                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                                        {item.title}
                                    </h3>
                                </div>
                            </SpotlightCard>
                        );
                    }

                    // 3. PRODUCT CARDS
                    if (item.type === "product") {
                        return (
                            <SpotlightCard
                                key={item.id}
                                className={`${item.colSpan} ${item.rowSpan} !p-0`}
                                delay={item.delay}
                            >
                                <Link href="/shop" className="block w-full h-full relative min-h-[180px]">
                                    <div className="absolute inset-3 rounded-xl overflow-hidden bg-muted">
                                        <Image
                                            src={item.image!}
                                            alt={item.title!}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                            className="object-cover transition-all duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                        />
                                    </div>

                                    <div className="absolute bottom-4 left-4 z-10">
                                        <h3 className="text-foreground font-semibold text-base">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm">{item.price}</p>
                                    </div>

                                    {/* Quick View Icon */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border">
                                            <ArrowUpRight className="w-4 h-4 text-foreground" />
                                        </div>
                                    </div>
                                </Link>
                            </SpotlightCard>
                        );
                    }

                    // 4. FEATURE CARD
                    if (item.type === "feature") {
                        return (
                            <SpotlightCard
                                key={item.id}
                                className={`${item.colSpan} ${item.rowSpan} flex flex-col items-center justify-center text-center p-6 !bg-gradient-to-br !from-primary/20 !to-primary/5 !border-primary/20`}
                                delay={item.delay}
                            >
                                <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                                <h3 className="font-bold text-foreground text-lg leading-tight">{item.title}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                                    {item.subtitle}
                                </p>
                            </SpotlightCard>
                        );
                    }

                    // 5. STAT CARD
                    if (item.type === "stat") {
                        return (
                            <SpotlightCard
                                key={item.id}
                                className={`${item.colSpan} ${item.rowSpan} flex flex-col items-center justify-center text-center p-6`}
                                delay={item.delay}
                            >
                                <h3 className="text-5xl md:text-6xl font-black gradient-text mb-1">{item.value}</h3>
                                <p className="font-semibold text-muted-foreground text-sm tracking-wide">{item.label}</p>
                            </SpotlightCard>
                        );
                    }

                    // 6. CTA CARD
                    if (item.type === "cta") {
                        return (
                            <SpotlightCard
                                key={item.id}
                                className={`${item.colSpan} ${item.rowSpan} !bg-secondary cursor-pointer`}
                                delay={item.delay}
                            >
                                <Link href="/shop" className="w-full h-full flex flex-col items-center justify-center gap-2 min-h-[150px]">
                                    <motion.div
                                        className="w-14 h-14 rounded-full bg-secondary-foreground/5 flex items-center justify-center group-hover:bg-secondary-foreground group-hover:text-secondary transition-all duration-300"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <ArrowUpRight className="w-6 h-6 text-secondary-foreground group-hover:text-secondary transition-colors" />
                                    </motion.div>
                                    <span className="text-sm font-medium text-secondary-foreground/60 group-hover:text-secondary-foreground transition-colors">
                                        Shop All
                                    </span>
                                </Link>
                            </SpotlightCard>
                        );
                    }

                    return null;
                })}
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
                <motion.div
                    className="w-[1px] h-8 bg-gradient-to-b from-muted-foreground/50 to-transparent"
                    animate={{ scaleY: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </section>
    );
}
