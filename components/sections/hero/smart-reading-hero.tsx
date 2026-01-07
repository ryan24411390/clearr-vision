"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SmartReadingHero() {
    return (
        <section className="relative w-full overflow-hidden bg-background pt-24 pb-8 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Content */}
                    <div className="flex flex-col gap-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">



                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                                স্বচ্ছ দৃষ্টি। <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">
                                    সুন্দর জীবন।
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-muted-foreground leading-relaxed md:max-w-xl mx-auto lg:mx-0"
                        >
                            ব্লু লাইট প্রোটেকশন সহ প্রিমিয়াম রিডিং গ্লাস। আরামের জন্য ডিজাইন করা, টেকসই গুণমান।
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                        >
                            <Link href="/shop">
                                <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all">
                                    কালেকশন দেখুন
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base border-2 hover:bg-secondary/50">
                                    কীভাবে কাজ করে
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                                <span>৩০ দিনের ট্রায়াল</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                                <span>ফ্রি শিপিং</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden">
                                            {/* Handing avatars or placeholders */}
                                            <div className="w-full h-full bg-zinc-300" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span className="font-semibold text-foreground">৪.৯</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Visual */}
                    <div className="relative mt-8 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{
                                duration: 1,
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 50
                            }}
                            className="relative z-10"
                        >
                            <div className="relative aspect-[3/2] w-full max-w-[600px] mx-auto">
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl p-6">
                                        <Image
                                            src="/images/hero/premium-lifestyle.png"
                                            alt="Smart Reading Glasses in use"
                                            width={800}
                                            height={533}
                                            className="w-full h-full object-cover filter drop-shadow-xl"
                                            priority
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Decorative Background Elements behind the product */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-teal-100/50 to-transparent rounded-full blur-3xl -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
