"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Wait for document to be fully loaded, then animate out
        const handleLoad = () => {
            // Small delay to ensure smooth transition
            setTimeout(() => setIsLoading(false), 400);
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: "#FAFAFA" }}
                >
                    {/* Cinematic Bars - Horizontal Wipe */}
                    <motion.div
                        className="absolute inset-0 z-20 flex flex-col"
                        initial="initial"
                        exit="exit"
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="flex-1 bg-[#FAFAFA]"
                                initial={{ scaleX: 1 }}
                                exit={{
                                    scaleX: 0,
                                    transition: {
                                        duration: 0.6,
                                        delay: i * 0.05,
                                        ease: [0.76, 0, 0.24, 1]
                                    }
                                }}
                                style={{
                                    originX: i % 2 === 0 ? 0 : 1,
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* Central Logo Mark */}
                    <motion.div
                        className="relative z-10 flex flex-col items-center"
                        exit={{
                            opacity: 0,
                            scale: 0.8,
                            filter: "blur(10px)",
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* Animated Ring */}
                        <motion.div
                            className="relative w-20 h-20 mb-6"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <svg viewBox="0 0 80 80" className="w-full h-full">
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="36"
                                    fill="none"
                                    stroke="rgba(0,0,0,0.1)"
                                    strokeWidth="1"
                                />
                                <motion.circle
                                    cx="40"
                                    cy="40"
                                    r="36"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeDasharray="226"
                                    strokeDashoffset="170"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#2DD4BF" />
                                        <stop offset="100%" stopColor="#0D9488" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Center Dot */}
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-teal-400 to-teal-600" />
                            </motion.div>
                        </motion.div>

                        {/* Brand Text */}
                        <motion.div
                            className="overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <motion.span
                                className="block text-sm font-medium tracking-[0.4em] text-foreground/50 uppercase"
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
                            >
                                Clearr Vision
                            </motion.span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
