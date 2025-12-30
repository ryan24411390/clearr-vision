"use client";

import { Link } from "@/lib/navigation";
import { MessageCircle, Menu, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileNav from "./mobile-nav";
import { useState, useRef } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CommandMenu } from "../command-menu";
import { MegaMenu } from "../mega-menu";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);

    // Hide on scroll down, show on scroll up
    useMotionValueEvent(scrollY, "change", (latest) => {
        const diff = latest - lastScrollY.current;
        if (diff > 10 && latest > 100) {
            setHidden(true);
        } else if (diff < -10) {
            setHidden(false);
        }
        lastScrollY.current = latest;
    });

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 w-full bg-background border-b border-border shadow-sm"
            initial={{ y: 0 }}
            animate={{ y: hidden ? "-100%" : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo Area */}
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                            <MobileNav />
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-10 h-10">
                            <Image
                                src="/logo.png"
                                alt="Smart Reading Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span
                            className="font-bold text-xl md:text-2xl text-foreground tracking-tight hidden sm:block"
                            style={{ fontFamily: 'Futura, "Century Gothic", sans-serif' }}
                        >
                            Smart Reading
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation - Centered */}
                <div className="hidden md:flex items-center justify-center flex-1 px-8">
                    <MegaMenu />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <div className="hidden md:block">
                        <CommandMenu />
                    </div>
                    <div className="md:hidden">
                        <CommandMenu>
                            <Button variant="ghost" size="icon">
                                <Search className="h-5 w-5" />
                            </Button>
                        </CommandMenu>
                    </div>

                    <div className="hidden sm:block">
                        <LanguageSwitcher />
                    </div>

                    {/* Custom Symbol - Order Inquiry Link */}
                    <Button variant="ghost" size="icon" className="relative" asChild>
                        <Link href="/contact">
                            <MessageCircle className="h-5 w-5" />
                            <span className="sr-only">Order Inquiry</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.header>
    );
}
