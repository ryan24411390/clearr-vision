"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Product } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ShoppingBag, Star } from "lucide-react";

interface ProductHeroProps {
    product: Product;
}

export function ProductHero({ product }: ProductHeroProps) {
    const Discount = (product.originalPrice && product.price < product.originalPrice)
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const scrollToOrder = () => {
        const orderForm = document.getElementById("order-form-container");
        if (orderForm) {
            orderForm.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative w-full min-h-[85vh] flex flex-col lg:flex-row bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Left: Content */}
            <div className="flex-1 flex flex-col justify-center px-6 lg:px-20 py-20 z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                        {Discount > 0 && (
                            <Badge className="bg-red-500 hover:bg-red-600 px-3 py-1 text-sm rounded-full">
                                Save {Discount}%
                            </Badge>
                        )}
                        <div className="flex items-center gap-1 text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-4 h-4 fill-current" />
                            ))}
                            <span className="text-sm text-muted-foreground ml-2 font-medium text-black dark:text-white">
                                (4.9/5.0)
                            </span>
                        </div>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1]">
                        {product.name}
                    </h1>

                    <p className="text-xl text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed max-w-lg">
                        {product.tagline || "Experience crystal clear vision with our premium collection. Designed for comfort, engineered for style."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-primary">
                                ৳{product.price}
                            </span>
                            {product.originalPrice && (
                                <span className="text-xl text-zinc-400 line-through">
                                    ৳{product.originalPrice}
                                </span>
                            )}
                        </div>

                        <Button
                            size="lg"
                            className="rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105"
                            onClick={scrollToOrder}
                        >
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Order Now
                        </Button>
                    </div>

                    <div className="mt-12 flex items-center gap-8 text-sm font-medium text-zinc-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            In Stock & Ready to Ship
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            Cash on Delivery
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right: Immersive Image */}
            <div className="flex-1 relative min-h-[50vh] lg:min-h-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-50/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-zinc-50/10 z-10" />

                {/* Decorative blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-3xl rounded-full" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative w-full h-full"
                >
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover object-center lg:object-contain"
                        priority
                    />
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => {
                    window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
                }}
            >
                <span className="text-xs uppercase tracking-widest text-muted-foreground/70">Explore</span>
                <ArrowDown className="w-5 h-5 text-primary animate-bounce" />
            </motion.div>
        </section>
    );
}
