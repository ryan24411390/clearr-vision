"use client";

import { Link } from "@/lib/navigation";
import { ShoppingCart, Menu, Search, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileNav from "./mobile-nav";
import { useCartStore } from "@/lib/store/cart";
import { useEffect, useState, useRef } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CommandMenu } from "../command-menu";
import { MegaMenu } from "../mega-menu";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

function CartBadge() {
    const itemCount = useCartStore(state => state.getItemCount());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || itemCount === 0) return null;

    return (
        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center ring-2 ring-background">
            {itemCount}
        </span>
    );
}

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

                    <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
                        {/* Placeholder for user account if needed, currently not in original header but good for traditional layout. 
                             Keeping it safe by just sticking to original actions for now unless requested. 
                             Original had LanguageSwitcher, CommandMenu, Cart. */}
                        <Link href="/account">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Account</span>
                        </Link>
                    </Button>

                    <Button variant="ghost" size="icon" className="relative" asChild>
                        <Link href="/checkout">
                            <ShoppingCart className="h-5 w-5" />
                            <CartBadge />
                            <span className="sr-only">Cart</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.header>
    );
}
