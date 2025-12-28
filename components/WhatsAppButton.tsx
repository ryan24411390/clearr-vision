"use client";

import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function WhatsAppButton() {
    const phoneNumber = "8801704772663";
    const message = "Hello! I am interested in Clearr Vision reading glasses.";
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground shadow-xl whitespace-nowrap"
                    >
                        Chat with us
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Button */}
            <motion.button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-14 h-14 rounded-full bg-card border border-border shadow-xl flex items-center justify-center group overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                {/* Background gradient on hover */}
                <motion.div
                    className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping opacity-0 group-hover:opacity-75" />

                {/* Icon */}
                <MessageCircle className="w-6 h-6 text-primary group-hover:text-primary-foreground relative z-10 transition-colors duration-300" />
            </motion.button>
        </div>
    );
}
