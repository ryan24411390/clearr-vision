"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MobileStickyBarProps {
    price: number;
    originalPrice?: number;
    onOrderClick?: () => void;
}

export function MobileStickyBar({ price, originalPrice }: MobileStickyBarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling down past the main "Add to Cart" button approximate position
            // or just show it after some hero section scroll.
            // Let's say > 600px
            if (window.scrollY > 600) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToOrder = () => {
        // Find the order form or just the top of the page if form is high up
        // Better: find the specific order form element
        const orderForm = document.getElementById("order-form-container");
        if (orderForm) {
            orderForm.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md border-t md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-primary">
                                    {formatCurrency(price)}
                                </span>
                                {originalPrice && (
                                    <span className="text-sm text-muted-foreground line-through">
                                        {formatCurrency(originalPrice)}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground hidden sm:inline-block">Free Delivery (2+ items)</span>
                        </div>
                        <Button onClick={scrollToOrder} className="flex-1 font-bold shadow-lg">
                            Order Now
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
