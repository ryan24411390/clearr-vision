"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            // Extended delay for the "heavy" cinematic feel
            setTimeout(() => setIsLoading(false), 800);
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    const text = "Smart Reading";

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden backdrop-blur-3xl bg-background/40"
                    initial={{ opacity: 1, backdropFilter: "blur(20px)" }}
                    exit={{
                        opacity: 0,
                        backdropFilter: "blur(0px)",
                        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                    }}
                >
                    <motion.div
                        className="relative z-10 flex flex-col items-center"
                        exit={{
                            opacity: 0,
                            scale: 1.05,
                            filter: "blur(10px)",
                            transition: { duration: 0.8, ease: "easeInOut" }
                        }}
                    >
                        {/* Logo Animation */}
                        <motion.div
                            className="relative w-32 h-32 mb-8"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                fill
                                className="object-contain drop-shadow-[0_0_25px_rgba(45,212,191,0.3)]"
                                priority
                            />
                        </motion.div>

                        {/* Staggered Brand Text */}
                        <motion.div
                            className="overflow-hidden flex gap-[0.1em]"
                            initial={{ opacity: 1 }}
                        >
                            {text.split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    className="block text-sm font-medium tracking-[0.2em] text-foreground/80 uppercase"
                                    initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
                                    animate={{
                                        y: 0,
                                        opacity: 1,
                                        filter: "blur(0px)"
                                    }}
                                    transition={{
                                        delay: 0.2 + (i * 0.03),
                                        duration: 0.6,
                                        ease: [0.33, 1, 0.68, 1]
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
