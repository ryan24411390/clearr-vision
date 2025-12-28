"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from '@/lib/navigation';
import { ArrowRight } from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";

export function SplitRealityHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    // X position of the slider (0 to containerWidth)
    const x = useMotionValue(0);
    const springX = useSpring(x, { damping: 30, stiffness: 200 });

    // Calculate percentage for clip-path (0 to 100)
    // We start at 50%
    useEffect(() => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            setContainerWidth(width);
            x.set(width / 2);
        }

        const handleResize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setContainerWidth(width);
                // Maintain relative position or reset to center? Let's reset to center for simplicity on resize
                x.set(width / 2);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [x]);

    // Derived values
    const widthPercentage = useTransform(springX, [0, containerWidth], ["0%", "100%"]);
    const widthPercentageInverse = useTransform(springX, [0, containerWidth], ["100%", "0%"]);

    // Parallax effect for the glasses: move slightly more/less than the slider to float
    // We want the glasses to be exactly ON the line, so they just follow X
    // But maybe a slight rotation or tilt based on velocity would be cool.

    const handleDrag = (_: any, info: any) => {
        // Constrain is handled by dragConstraints
    };

    const { isIntroComplete } = useUIStore();

    return (
        <motion.section
            ref={containerRef}
            className="relative w-full h-[95vh] overflow-hidden bg-background select-none"
            initial={{ scale: 1.1, filter: "blur(10px)" }}
            animate={{
                scale: isIntroComplete ? 1 : 1.1,
                filter: isIntroComplete ? "blur(0px)" : "blur(10px)"
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
        >
            {/* 1. The "Blurry/Struggling" World (Background Layer - Visible by default, covered by the clear layer) */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero/dhaka-street-clear.png"
                    alt="Dhaka Street Blurred"
                    fill
                    className="object-cover object-center filter blur-[8px] grayscale-[30%] brightness-[0.9]"
                    priority
                />
                {/* Overlay Text for Blurred Side (Optional) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h1 className="text-[10vw] md:text-[120px] font-bold text-foreground/10 tracking-tighter mix-blend-overlay">
                        UNCLEAR
                    </h1>
                </div>
            </div>

            {/* 2. The "Clear/Vibrant" World (Foreground Layer - Revealed by slider) */}
            <motion.div
                className="absolute inset-0 z-10 overflow-hidden"
                style={{ clipPath: useTransform(widthPercentage, (val) => `inset(0 0 0 ${val})`) }}
            >
                {/* Note: The clip-path inset(0 0 0 X%) cuts from the LEFT. 
                    So if val is 0%, inset is 0, full image shown.
                    If val is 100%, inset is 100%, image hidden.
                    
                    Wait, we want the LEFT side to be blurry and RIGHT side to be clear? 
                    "Left side: blurry... Right side: vibrant".
                    
                    If slider is at 50%, we want the Left 50% to be Blurry, Right 50% to be Clear.
                    
                    The implementation above: `inset(0 0 0 val)`
                    If val = 50%: cuts 50% from the LEFT. So the RIGHT 50% is visible.
                    So the DIV contains the CLEAR image.
                    It is clipped from the left.
                    So the RIGHT side of the screen is this Clear Image.
                    The LEFT side is the Background (Blurry).
                    
                    This matches the requirement: Left=Blur, Right=Clear.
                */}
                <Image
                    src="/images/hero/dhaka-street-clear.png"
                    alt="Dhaka Street Clear"
                    fill
                    className="object-cover object-center brightness-[1.1] contrast-[1.15] saturation-[1.1]"
                    priority
                />

                {/* Clear Side Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h1 className="text-[10vw] md:text-[120px] font-bold text-foreground/90 tracking-tighter drop-shadow-2xl">
                        CLEARR
                    </h1>
                </div>
            </motion.div>

            {/* 3. The Slider Interface */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {/* The Draggable Handle Line */}
                <motion.div
                    className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-md cursor-grab active:cursor-grabbing touch-none shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    style={{ x: springX }}
                >
                    {/* The Handle Button */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg pointer-events-auto cursor-grab active:cursor-grabbing"
                        onPointerDown={(e) => {
                            // Forward the event to the drag control if possible, or just build drag on the handle
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black opacity-50">
                            <path d="M16 4h4v16h-4" />
                            <path d="M8 4H4v16h4" />
                        </svg>
                    </div>

                    {/* The Floating Glasses */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none mix-blend-normal">
                        <div className="relative w-full h-full">
                            {/* Glasses Image - Centered on the handle */}
                            <Image
                                src="/images/hero/glasses-frame.png"
                                alt="Clearr Vision Frames"
                                fill
                                className="object-contain drop-shadow-2xl opacity-90"
                            />
                            {/* Additional lens reflections could go here */}
                            <div className="absolute inset-[30%] bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse" />
                        </div>
                    </div>
                </motion.div>

                {/* Invisible Drag Area (Full Screen) for better UX */}
                <motion.div
                    className="absolute inset-0 z-10 cursor-ew-resize" // Ensure cursor indicates resizing
                    drag="x"
                    dragElastic={0}
                    dragMomentum={false}
                    dragConstraints={containerRef}
                    style={{ opacity: 0, x: x }} // Bind motion value and opacity
                    onDrag={handleDrag}
                />
            </div>

            {/* 4. Text Content / Overlay UI (Top Layer) */}
            <div className="absolute bottom-12 left-0 right-0 z-30 pointer-events-none text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col items-center gap-6"
                >
                    <h2 className="text-xl md:text-3xl text-foreground font-light tracking-[0.2em] uppercase drop-shadow-lg">
                        Unlock Your World
                    </h2>

                    <Link href="/shop" className="pointer-events-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-foreground text-background px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-foreground/80 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Experience Clarity <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            {/* Hint Animation */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 text-foreground/50 text-sm font-medium tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, delay: 2, repeat: 1 }}
            >
                Drag to Compare
            </motion.div>

        </motion.section>
    );
}
