"use client";

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from '@/lib/navigation';
import { motion } from "framer-motion";

export function QuizCTASection() {
    const t = useTranslations('QuizCTA');

    return (
        <section className="py-24 md:py-32 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    className="group relative rounded-3xl p-8 md:p-16 lg:p-20 text-center overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Background - Gradient mesh effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-card to-card z-0" />

                    {/* Animated gradient orbs */}
                    <motion.div
                        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px] pointer-events-none"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[80px] pointer-events-none"
                        animate={{
                            scale: [1, 1.1, 1],
                            x: [0, 20, 0],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Border glow */}
                    <div className="absolute inset-0 rounded-3xl border border-primary/20 z-0" />

                    {/* Content */}
                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8">
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted border border-border text-sm font-medium"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground tracking-wide">{t('badge')}</span>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            {t('title')}{' '}
                            <span className="gradient-text-primary">{t('titleHighlight')}</span>
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            className="text-muted-foreground text-lg md:text-xl max-w-xl leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            {t('description')}
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link href="/quiz">
                                <Button
                                    size="lg"
                                    className="h-14 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold glow-teal transition-all duration-300 group"
                                >
                                    {t('cta')}
                                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
