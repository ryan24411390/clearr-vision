"use client";

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart, ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

import { PRODUCTS } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@/lib/navigation";
import { useLocale } from "next-intl";
import { useCartStore } from "@/lib/store/cart";

// Stagger animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
    },
};

export function ProductShowcase() {
    const t = useTranslations('Products');
    const locale = useLocale();
    const featuredProducts = PRODUCTS.slice(0, 4);
    const addItem = useCartStore(state => state.addItem);

    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden">
            {/* Subtle gradient accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-primary font-medium tracking-[0.2em] text-xs uppercase mb-4 block">
                        {t('sectionBadge')}
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                        {t('sectionTitle')}{' '}
                        <span className="gradient-text-primary italic">{t('sectionTitleHighlight')}</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        {t('sectionDescription')}
                    </p>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {featuredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            variants={itemVariants}
                            className="group relative"
                        >
                            <div className="relative h-full rounded-2xl bg-card border border-border overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_40px_-15px_rgba(45,212,191,0.3)]">
                                {/* Product Image */}
                                <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Quick Actions */}
                                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <Link href={`/shop/${product.slug}`}>
                                            <motion.button
                                                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </motion.button>
                                        </Link>
                                        <motion.button
                                            className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur-md border border-primary flex items-center justify-center text-primary-foreground hover:bg-primary transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addItem({
                                                id: product.id,
                                                productId: product.id,
                                                name: product.name,
                                                price: product.price,
                                                image: product.image,
                                                quantity: 1,
                                            })}
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                        </motion.button>
                                    </div>

                                    {/* Badge for first product */}
                                    {index === 0 && (
                                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                                            Best Seller
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-5 space-y-2">
                                    <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-muted-foreground font-medium">
                                            {formatCurrency(product.price, locale)}
                                        </p>
                                        <Link
                                            href={`/shop/${product.slug}`}
                                            className="text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                        >
                                            View
                                            <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Link href="/shop">
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full border-border hover:border-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-base transition-all duration-300"
                        >
                            {t('viewAll')}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
