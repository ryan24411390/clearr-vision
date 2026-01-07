"use client";

import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

// Testimonial Card Component
function TestimonialCard({
    name,
    role,
    text,
    rating,
    index,
}: {
    name: string;
    role: string;
    text: string;
    rating: number;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative flex-shrink-0 w-[340px] p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
        >
            {/* Quote Icon */}
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Quote className="w-4 h-4 text-primary" />
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < rating
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted"
                            }`}
                    />
                ))}
            </div>

            {/* Review Text */}
            <p className="text-foreground/80 leading-relaxed text-sm mb-6 line-clamp-4">
                &ldquo;{text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                        {name.charAt(0)}
                    </span>
                </div>
                <div>
                    <h4 className="font-semibold text-sm text-foreground">{name}</h4>
                    <p className="text-xs text-muted-foreground">{role}</p>
                </div>
            </div>
        </motion.div>
    );
}

export function TrustSection() {
    const TESTIMONIALS = [
        {
            id: 1,
            name: "রহিম আহমেদ",
            role: "ব্যবসায়ী",
            text: "এই চশমা আমার কাজের ধরন বদলে দিয়েছে। কম্পিউটারে দীর্ঘ সময় কাজ করার পরও আর মাথা ব্যথা হয় না। ব্লু লাইট প্রোটেকশন সত্যিই কাজ করে!",
            rating: 5,
        },
        {
            id: 2,
            name: "শিরিন আক্তার",
            role: "শিক্ষিকা",
            text: "খাতা দেখা আর লেসন প্রস্তুতিতে ঘণ্টার পর ঘণ্টা সময় কাটাই। এই রিডিং গ্লাস এতটাই আরামদায়ক যে ভুলেই যাই পরে আছি।",
            rating: 5,
        },
        {
            id: 3,
            name: "কামরুল হাসান",
            role: "সফটওয়্যার ইঞ্জিনিয়ার",
            text: "স্টাইলিশ আর স্ক্রিন ক্লান্তি দূর করে এমন চশমা অবশেষে পেলাম। দামের তুলনায় কোয়ালিটি অসাধারণ।",
            rating: 5,
        },
    ];

    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-primary font-medium tracking-[0.2em] text-xs uppercase mb-4 block">
                        কাস্টমার রিভিউ
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                        গ্রাহকরা কী বলছেন
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        যারা আমাদের বিশ্বাস করেছেন তাদের প্রকৃত অভিজ্ঞতা।
                    </p>
                </motion.div>

                {/* Testimonials - CSS Marquee for Performance */}
                <div className="relative">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                    {/* Marquee Container */}
                    <div className="overflow-hidden">
                        <div
                            className="flex gap-6 animate-marquee hover:[animation-play-state:paused]"
                            style={{ "--duration": "40s" } as React.CSSProperties}
                        >
                            {/* First set */}
                            {TESTIMONIALS.map((item, index) => (
                                <TestimonialCard
                                    key={item.id}
                                    name={item.name}
                                    role={item.role}
                                    text={item.text}
                                    rating={item.rating}
                                    index={index}
                                />
                            ))}
                            {/* Duplicate for seamless loop */}
                            {TESTIMONIALS.map((item, index) => (
                                <TestimonialCard
                                    key={`dup-${item.id}`}
                                    name={item.name}
                                    role={item.role}
                                    text={item.text}
                                    rating={item.rating}
                                    index={index + TESTIMONIALS.length}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <motion.div
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {[
                        { value: "৫,০০০+", label: "সন্তুষ্ট গ্রাহক" },
                        { value: "৪.৯", label: "গড় রেটিং" },
                        { value: "৯৯%", label: "সন্তুষ্টির হার" },
                        { value: "২৪/৭", label: "কাস্টমার সাপোর্ট" },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-zinc-600 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div >
        </section >
    );
}
