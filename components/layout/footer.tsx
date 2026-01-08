"use client";

import { Link } from "@/lib/navigation";
import { Facebook, Instagram, Linkedin, ArrowRight, Smartphone, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
    const footerLinks = [
        {
            title: "শপ",
            links: [
                { label: "সব চশমা", href: "/shop" },
                { label: "রিডিং গ্লাস", href: "/shop?category=reading" },
                { label: "ব্লু লাইট", href: "/shop?category=blue-cut" },
                { label: "সানগ্লাস", href: "/shop?category=sunglasses" },
                { label: "এক্সেসরিজ", href: "/accessories" },
            ]
        },
        {
            title: "জানুন",
            links: [
                { label: "আমাদের গল্প", href: "/about" },
                { label: "ব্লগ", href: "/blog" },
                { label: "লেন্স টেকনোলজি", href: "/technology" },
                { label: "ফিট গাইড", href: "/fit-guide" },
            ]
        },
        {
            title: "সাপোর্ট",
            links: [
                { label: "প্রশ্নোত্তর", href: "/faq" },
                { label: "শিপিং পলিসি", href: "/shipping" },
                { label: "রিটার্ন পলিসি", href: "/refund" },
                { label: "যোগাযোগ", href: "/contact" },
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


                    {/* Links Grid */}
                    <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-4">
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
                                সংযুক্ত হোন
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
                        <span>নিরাপদ পেমেন্ট</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/privacy" className="hover:text-primary transition-colors">
                            প্রাইভেসি পলিসি
                        </Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">
                            শর্তাবলী
                        </Link>
                        <span>© {new Date().getFullYear()} Smart Reading</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
