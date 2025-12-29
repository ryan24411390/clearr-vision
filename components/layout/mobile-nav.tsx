"use client"

import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SheetClose } from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store/cart";
import { useEffect, useState } from "react";
import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Smartphone,
    Glasses,
    ShoppingBag,
    HelpCircle,
    User,
    Mail,
    ShoppingCart,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";

function CartCount() {
    const itemCount = useCartStore(state => state.getItemCount());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return itemCount;
}

export default function MobileNav() {
    const t = useTranslations('MobileNav');
    const pathname = usePathname();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="flex flex-col h-full bg-background text-foreground">
            {/* Header Area inside Sheet */}
            <div className="flex items-center justify-between py-5 px-6 border-b border-border">
                <SheetClose asChild>
                    <Link href="/" className="flex items-center space-x-2.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-border">
                            <Glasses className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-foreground">Smart Reading</span>
                    </Link>
                </SheetClose>
                <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-foreground/5 text-foreground/70 hover:text-foreground">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close menu</span>
                    </Button>
                </SheetClose>
            </div>

            <motion.div
                className="flex-1 overflow-y-auto py-6 px-6"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <nav className="flex flex-col gap-2">
                    <motion.p variants={item} className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{t('menu')}</motion.p>
                    <motion.div variants={item}><NavLink href="/" icon={<ShoppingBag className="w-5 h-5" />} active={pathname === '/'}>{t('home')}</NavLink></motion.div>
                    <motion.div variants={item}><NavLink href="/shop" icon={<Glasses className="w-5 h-5" />} active={pathname.startsWith('/shop')}>{t('shopAllGlasses')}</NavLink></motion.div>
                    <motion.div variants={item}><NavLink href="/quiz" icon={<Smartphone className="w-5 h-5" />} active={pathname.startsWith('/quiz')}>{t('findYourPower')}</NavLink></motion.div>
                    <motion.div variants={item}><NavLink href="/virtual-try-on" icon={<User className="w-5 h-5" />} active={pathname.startsWith('/virtual-try-on')}>{t('virtualTryOn')}</NavLink></motion.div>

                    <motion.div variants={item} className="my-4 border-t border-border" />

                    <motion.p variants={item} className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{t('support')}</motion.p>
                    <motion.div variants={item}><NavLink href="/about" icon={<HelpCircle className="w-5 h-5" />} active={pathname.startsWith('/about')}>{t('aboutUs')}</NavLink></motion.div>
                    <motion.div variants={item}><NavLink href="/contact" icon={<Mail className="w-5 h-5" />} active={pathname.startsWith('/contact')}>{t('contact')}</NavLink></motion.div>
                </nav>

                {/* Cart Quick Access */}
                <motion.div variants={item} className="mt-6">
                    <SheetClose asChild>
                        <Link href="/checkout" className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/50 hover:bg-muted transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-foreground">{t('yourCart')}</p>
                                    <p className="text-xs text-muted-foreground"><CartCount /> {t('items')}</p>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-primary group-hover:text-primary-foreground transition-colors">{t('viewCart')} →</span>
                        </Link>
                    </SheetClose>
                </motion.div>

                {/* WhatsApp Help Card */}
                <motion.div variants={item} className="mt-4">
                    <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-500/20 rounded-full text-green-600">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-sm text-foreground">{t('needHelp')}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                            {t('whatsappDesc')}
                        </p>
                        <Button className="w-full bg-green-600 hover:bg-green-500 text-white h-10 text-xs font-medium rounded-xl transition-all" asChild>
                            <a href="https://wa.me/yournumber" target="_blank" rel="noopener noreferrer">
                                {t('whatsappButton')}
                            </a>
                        </Button>
                    </div>
                </motion.div>
            </motion.div>

            <div className="py-6 px-6 border-t border-border mt-auto bg-muted/50">
                <div className="flex justify-center gap-6">
                    <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} label="Instagram" />
                    <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} label="Facebook" />
                    <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
                    <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} label="Twitter" />
                </div>
                <p className="text-center text-[10px] text-muted-foreground mt-5 tracking-wide">
                    © 2025 Smart Reading. All rights reserved.
                </p>
            </div>
        </div>
    );
}

function NavLink({ href, children, icon, active }: { href: string; children: React.ReactNode; icon?: React.ReactNode; active?: boolean }) {
    return (
        <SheetClose asChild>
            <Button
                variant="ghost"
                className={cn(
                    "justify-start text-base h-12 w-full font-medium rounded-xl transition-all duration-300",
                    active
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-foreground/80 hover:text-foreground hover:bg-foreground/5"
                )}
                asChild
            >
                <Link href={href} className="flex gap-4 items-center">
                    {icon && <span className={cn("transition-colors", active ? "text-primary" : "text-muted-foreground")}>{icon}</span>}
                    {children}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </Link>
            </Button>
        </SheetClose>
    )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300"
            aria-label={label}
        >
            {icon}
        </a>
    )
}
