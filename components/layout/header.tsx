"use client";

import { Link } from "@/lib/navigation";
import { ShoppingCart, Menu, Search, Glasses } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileNav from "./mobile-nav";
import { useCartStore } from "@/lib/store/cart";
import { useEffect, useState, useRef } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CommandMenu } from "./command-menu";
import { MegaMenu } from "./mega-menu";
import { motion, useScroll, useMotionValueEvent, useTransform, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store/ui-store";

function CartBadge() {
    const itemCount = useCartStore(state => state.getItemCount());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || itemCount === 0) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.span
                key={itemCount}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center"
            >
                {itemCount}
            </motion.span>
        </AnimatePresence>
    );
}


export default function Header() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);

    // Hide on scroll down, show on scroll up
    useMotionValueEvent(scrollY, "change", (latest) => {
        const diff = latest - lastScrollY.current;
        if (diff > 10 && latest > 80) {
            setHidden(true);
        } else if (diff < -10) {
            setHidden(false);
        }
        lastScrollY.current = latest;
    });

    // Progressive glassmorphism: opacity increases with scroll
    const bgOpacity = useTransform(scrollY, [0, 150], [0.2, 0.7]);
    const borderOpacity = useTransform(scrollY, [0, 150], [0.1, 0.25]);

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl backdrop-saturate-150"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: hidden ? "-100%" : 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
                backgroundColor: useTransform(bgOpacity, (v) => `rgba(255, 255, 255, ${v})`),
                borderBottom: useTransform(borderOpacity, (v) => `1px solid rgba(0, 0, 0, ${v * 0.4})`),
            }}
        >
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Mobile Menu & Logo */}
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-full">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px] border-r-border bg-background/95 backdrop-blur-2xl p-0">
                            <MobileNav />
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center gap-2.5 group">
                        <motion.div
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-border"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Glasses className="w-4 h-4 text-primary" />
                        </motion.div>
                        <span className="font-bold text-xl md:text-2xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                            Clearr Vision
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <MegaMenu />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <motion.div className="hidden md:block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <CommandMenu />
                    </motion.div>
                    <div className="md:hidden">
                        <CommandMenu>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button variant="ghost" size="icon" className="group rounded-full hover:bg-foreground/5 text-foreground/80 hover:text-foreground">
                                    <Search className="h-5 w-5" />
                                </Button>
                            </motion.div>
                        </CommandMenu>
                    </div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <LanguageSwitcher />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="icon" className="relative group rounded-full hover:bg-foreground/5 text-foreground/80 hover:text-foreground" asChild>
                            <Link href="/checkout">
                                <div className="relative">
                                    <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
                                    <CartBadge />
                                </div>
                                <span className="sr-only">Cart</span>
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
}
