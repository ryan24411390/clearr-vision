"use client";

import Image from "next/image";
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Truck, Leaf } from "lucide-react";
import { useTranslations } from 'next-intl';

export function BentoShowcase() {
    const t = useTranslations('Bento');

    return (
        <section className="py-24 md:py-32 bg-background relative overflow-hidden">
            {/* Subtle ambient glow */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <motion.div
                    className="mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground">
                        {t('sectionTitle')}{' '}
                        <span className="gradient-text-primary italic">{t('sectionTitleHighlight')}</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {t('sectionDescription')}
                    </p>
                </motion.div>

                <BentoGrid>
                    {/* Main Feature - Large */}
                    <BentoItem colSpan={2} rowSpan={2} className="relative group min-h-[400px]">
                        <motion.div
                            className="absolute inset-0 z-0"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Background Image */}
                            <Image
                                src="/images/products/classic-reader.jpg"
                                alt="Crystal Clear Optics"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                        </motion.div>

                        <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                                    <Sparkles className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">{t('crystalTitle')}</h3>
                                <p className="text-muted-foreground max-w-md text-base leading-relaxed">
                                    {t('crystalDescription')}
                                </p>
                            </motion.div>
                        </div>
                    </BentoItem>

                    {/* Feature 2 - Durability */}
                    <BentoItem colSpan={1} className="group min-h-[200px]">
                        <div className="relative z-10 p-6 flex flex-col h-full">
                            <motion.div
                                className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-auto group-hover:bg-primary/20 transition-colors"
                                whileHover={{ scale: 1.05 }}
                            >
                                <ShieldCheck className="w-6 h-6 text-primary" />
                            </motion.div>
                            <div className="mt-4">
                                <h3 className="text-xl font-bold mb-2 text-foreground">{t('impactTitle')}</h3>
                                <p className="text-sm text-muted-foreground">{t('impactDescription')}</p>
                            </div>
                        </div>
                    </BentoItem>

                    {/* Feature 3 - Sustainability */}
                    <BentoItem colSpan={1} className="group min-h-[200px]">
                        <div className="relative z-10 p-6 flex flex-col h-full">
                            <motion.div
                                className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-auto group-hover:bg-primary/20 transition-colors"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Leaf className="w-6 h-6 text-primary" />
                            </motion.div>
                            <div className="mt-4">
                                <h3 className="text-xl font-bold mb-2 text-foreground">{t('ecoTitle')}</h3>
                                <p className="text-sm text-muted-foreground">{t('ecoDescription')}</p>
                            </div>
                        </div>
                    </BentoItem>

                    {/* Feature 4 - Delivery - Wide */}
                    <BentoItem colSpan={2} className="group min-h-[180px]">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent z-0" />
                        <div className="relative z-10 p-6 flex items-center gap-6 h-full">
                            <motion.div
                                className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Truck className="w-8 h-8 text-primary" />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-foreground">{t('deliveryTitle')}</h3>
                                <p className="text-muted-foreground">{t('deliveryDescription')}</p>
                            </div>
                        </div>
                    </BentoItem>
                </BentoGrid>
            </div>
        </section>
    );
}
