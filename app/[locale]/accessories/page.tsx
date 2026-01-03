"use client";

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { Package, Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function AccessoriesPage() {
    const t = useTranslations('Accessories');

    const accessories = [
        { titleKey: "case", descKey: "caseDesc", price: "৳299" },
        { titleKey: "cloth", descKey: "clothDesc", price: "৳99" },
        { titleKey: "spray", descKey: "sprayDesc", price: "৳149" },
        { titleKey: "chain", descKey: "chainDesc", price: "৳199" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-24 md:py-32 bg-gradient-to-b from-muted/50 to-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="max-w-3xl mx-auto text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                            <Package className="w-4 h-4" />
                            {t('badge')}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            {t('heroTitle')}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {t('heroDesc')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Accessories Grid */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {accessories.map((item, index) => (
                        <motion.div
                            key={index}
                            className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Product Image Placeholder */}
                            <div className="aspect-square rounded-xl bg-muted mb-4 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                <Package className="w-12 h-12 text-muted-foreground/50" />
                            </div>

                            <h3 className="font-bold mb-1">{t(item.titleKey)}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{t(item.descKey)}</p>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-primary">{item.price}</span>
                                <Button size="sm" variant="ghost" className="h-8 px-3">
                                    <ShoppingBag className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Bundle CTA */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-card border border-border"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('bundleTitle')}</h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t('bundleDesc')}</p>
                        <Link href="/shop">
                            <Button size="lg" className="h-14 px-8 rounded-xl">
                                {t('shopButton')}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
