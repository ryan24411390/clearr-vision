"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { useTranslations } from "next-intl";

// Helper to provide styling per product index to keep the aesthetic variety
const STYLE_MAP = [
    { color: "bg-zinc-900", textColor: "text-white" },
    { color: "bg-zinc-100", textColor: "text-zinc-900" },
    { color: "bg-blue-950", textColor: "text-white" },
    { color: "bg-stone-100", textColor: "text-stone-800" },
];

// Helper to provide better taglines than raw data might have
const TAGLINES: Record<string, string> = {
    "1515": "Diamond Cut Clarity",
    "V004": "Rimless Elegance",
    "V007": "The Modern Classic",
    "V001": "Premium Essential",
};

export function FeaturedCollection() {
    const t = useTranslations('Common'); // Or a relevant namespace if needed

    return (
        <section className="py-0 bg-background">
            {PRODUCTS.map((product, index) => {
                // Cycle through styles
                const style = STYLE_MAP[index % STYLE_MAP.length];

                // Clean description for display (taking first line or summary)
                const cleanDesc = product.description.split('\n')[0];

                return (
                    <ProductSection
                        key={product.id}
                        product={{
                            ...product,
                            tagline: TAGLINES[product.id] || "Premium Collection",
                            displayDesc: product.description, // Pass full description, we might truncate in component
                            theme: style
                        }}
                        index={index}
                    />
                );
            })}
        </section>
    );
}

function ProductSection({ product, index }: { product: any; index: number }) {
    const isEven = index % 2 === 0;

    return (
        <div className={`relative min-h-[80vh] flex items-center overflow-hidden ${product.theme.color} ${product.theme.textColor}`}>
            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${isEven ? "" : "lg:flex-row-reverse"}`}>

                    {/* Text Content */}
                    <motion.div
                        className="flex-1 space-y-8 text-center lg:text-left"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="space-y-4">
                            <span className="text-sm font-medium tracking-[0.2em] uppercase opacity-70">
                                Collection 0{index + 1}
                            </span>
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                                {product.name}
                            </h2>
                            <p className="text-xl md:text-2xl font-light opacity-90 italic">
                                {product.tagline}
                            </p>
                        </div>

                        <div className="text-lg opacity-80 max-w-xl mx-auto lg:mx-0 leading-relaxed whitespace-pre-line">
                            {/* Displaying first few lines of description to avoid clutter */}
                            {product.displayDesc.split('\n').slice(0, 3).join('\n')}
                        </div>

                        <div className="pt-4">
                            <Link href={`/shop/${product.slug}`}>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className={`h-14 px-10 rounded-full text-base font-semibold border-2 transition-all duration-300 bg-transparent ${product.theme.textColor === 'text-white'
                                        ? 'border-white text-white hover:bg-white hover:text-black'
                                        : 'border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white'
                                        }`}
                                >
                                    Shop Now
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        className="flex-1 w-full max-w-2xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <div className={`relative aspect-[4/5] md:aspect-square w-full rounded-3xl overflow-hidden group border shadow-2xl ${product.theme.textColor === 'text-white' ? 'border-white/20 shadow-black/20' : 'border-black/10 shadow-black/5'}`}>
                            {/* Image Container */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10 pointer-events-none" />
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
