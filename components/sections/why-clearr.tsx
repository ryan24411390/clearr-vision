"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const FEATURES = [
    {
        title: "Crystal Clear Vision",
        description: "Experience the world with high-definition clarity. Our advanced lens technology reduces glare and enhances contrast, ensuring you see every detail with precision.",
        image: "/images/hero/dhaka-street-clear.png", // Using existing image
        benefits: ["Anti-reflective coating", "Blue light filtering", "Scratch-resistant"],
        reverse: false
    },
    {
        title: "Lightweight Comfort",
        description: "Designed for all-day wear. Our frames are crafted from premium aerospace-grade titanium and acetate, making them incredibly light yet durable.",
        image: "/images/hero/premium-lifestyle.png", // Using existing image
        benefits: ["Aerospace-grade titanium", "Hypoallergenic materials", "Perfectly balanced weight"],
        reverse: true
    }
];

export function WhyClearrSection() {
    return (
        <section className="py-24 bg-white text-zinc-900">
            <div className="container mx-auto px-4">
                <div className="space-y-32">
                    {FEATURES.map((feature, index) => (
                        <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${feature.reverse ? 'lg:flex-row-reverse' : ''}`}>

                            {/* Image Side */}
                            <motion.div
                                className="flex-1 w-full"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </motion.div>

                            {/* Content Side */}
                            <motion.div
                                className="flex-1 space-y-8"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="space-y-4">
                                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight">{feature.title}</h3>
                                    <p className="text-lg text-zinc-600 leading-relaxed max-w-lg">
                                        {feature.description}
                                    </p>
                                </div>

                                <ul className="space-y-4">
                                    {feature.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
