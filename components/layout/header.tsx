"use client";

import { Link } from "@/lib/navigation";
import { MessageCircle, Menu, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileNav from "./mobile-nav";
import { useState, useRef } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CommandMenu } from "./command-menu";
import { MegaMenu } from "./mega-menu";
import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";


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
                            className="relative flex items-center justify-center w-10 h-10 rounded-lg"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Image
                                src="/logo.png"
                                alt="Smart Reading Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </motion.div>
                        <span className="font-bold text-xl md:text-2xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                            Smart Reading
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

                    {/* Custom Symbol - Order Inquiry Link */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="icon" className="relative group rounded-full hover:bg-foreground/5 text-foreground/80 hover:text-foreground" asChild>
                            <Link href="/contact">
                                <MessageCircle className="h-5 w-5 group-hover:text-primary transition-colors duration-300" />
                                <span className="sr-only">Order Inquiry</span>
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
}
