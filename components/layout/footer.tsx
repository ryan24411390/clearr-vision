"use client";

import { Link } from "@/lib/navigation";
import { Facebook, Instagram, Linkedin, ArrowRight, Smartphone, ShieldCheck } from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
    const t = useTranslations('Footer');

    const footerLinks = [
        {
            title: t('shop'),
            links: [
                { label: t('allGlasses'), href: "/shop" },
                { label: t('reading'), href: "/shop?category=reading" },
                { label: t('blueLight'), href: "/shop?category=blue-cut" },
                { label: t('sunglasses'), href: "/shop?category=sunglasses" },
                { label: t('accessories'), href: "/accessories" },
            ]
        },
        {
            title: t('learn'),
            links: [
                { label: t('ourStory'), href: "/about" },
                { label: t('theJournal'), href: "/blog" },
                { label: t('lensTechnology'), href: "/technology" },
                { label: t('fitGuide'), href: "/fit-guide" },
            ]
        },
        {
            title: t('support'),
            links: [
                { label: t('faq'), href: "/faq" },
                { label: t('shippingPolicy'), href: "/shipping" },
                { label: t('refundPolicy'), href: "/refund" },
                { label: t('contactUs'), href: "/contact" },
            ]
        }
    ];

    const socialLinks = [
        { icon: Instagram, label: "Instagram", href: "#" },
        { icon: Facebook, label: "Facebook", href: "#" },
        { icon: Linkedin, label: "LinkedIn", href: "#" },
    ];

    return (
        <footer className="bg-card border-t border-border">
            <div className="container px-4 py-16 md:py-24 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
                    {/* Feature Card - Virtual Try-On */}
                    <div className="lg:col-span-4">
                        <motion.div
                            className="relative rounded-2xl p-8 bg-muted border border-border h-full overflow-hidden group hover:border-primary/30 transition-colors duration-500"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            {/* Glow effect */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-500 pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-primary mb-6">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">{t('virtualTryOnTitle')}</h3>
                                <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                                    {t('virtualTryOnDesc')}
                                </p>
                                <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/btn">
                                    {t('launchMirror')}
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-4">
                        {footerLinks.map((section, index) => (
                            <div key={index} className="space-y-5">
                                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Social Links */}
                        <div className="space-y-5">
                            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                                {t('connect')}
                            </h4>
                            <ul className="space-y-3">
                                {socialLinks.map((social, index) => (
                                    <li key={index}>
                                        <a
                                            href={social.href}
                                            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <social.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm">{social.label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>



                {/* Massive Brand Typography */}
                <div className="border-t border-border pt-16 pb-12 overflow-hidden flex flex-col items-center gap-6">
                    <div className="relative w-16 h-16 md:w-24 md:h-24 opacity-20 grayscale hover:grayscale-0 transition-all duration-500">
                        <Image src="/logo.png" alt="Smart Reading Mark" fill className="object-contain" />
                    </div>
                    <h1
                        className="text-[10vw] md:text-[10vw] leading-[0.8] font-black tracking-tighter text-muted/50 select-none text-center lg:text-left"
                        style={{ fontFamily: 'Futura, "Century Gothic", sans-serif' }}
                    >
                        SMART READING.
                    </h1>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span>{t('securePayments')}</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/privacy" className="hover:text-primary transition-colors">
                            {t('privacyPolicy')}
                        </Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">
                            {t('termsOfService')}
                        </Link>
                        <span>© {new Date().getFullYear()} Smart Reading</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
