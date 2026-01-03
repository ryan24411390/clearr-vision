"use client";

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { Ruler, Square, Circle, Hexagon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FitGuidePage() {
    const t = useTranslations('FitGuide');

    const faceShapes = [
        { icon: Square, shape: "square", titleKey: "squareTitle", descKey: "squareDesc", recommendKey: "squareRecommend" },
        { icon: Circle, shape: "round", titleKey: "roundTitle", descKey: "roundDesc", recommendKey: "roundRecommend" },
        { icon: Hexagon, shape: "oval", titleKey: "ovalTitle", descKey: "ovalDesc", recommendKey: "ovalRecommend" },
        { icon: Hexagon, shape: "heart", titleKey: "heartTitle", descKey: "heartDesc", recommendKey: "heartRecommend" },
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
                            <Ruler className="w-4 h-4" />
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

            {/* Measurement Guide */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">{t('measureTitle')}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">{t('measureDesc')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
                    {[1, 2, 3].map((step) => (
                        <motion.div
                            key={step}
                            className="p-6 rounded-2xl bg-card border border-border"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: step * 0.1 }}
                        >
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                                {step}
                            </div>
                            <h3 className="font-semibold mb-2">{t(`measureStep${step}Title`)}</h3>
                            <p className="text-sm text-muted-foreground">{t(`measureStep${step}Desc`)}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Face Shapes */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">{t('faceShapeTitle')}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">{t('faceShapeDesc')}</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {faceShapes.map((face, index) => (
                            <motion.div
                                key={index}
                                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <face.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-bold text-center mb-2">{t(face.titleKey)}</h3>
                                <p className="text-sm text-muted-foreground text-center mb-4">{t(face.descKey)}</p>
                                <div className="pt-4 border-t border-border">
                                    <p className="text-xs font-medium text-primary text-center">{t(face.recommendKey)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 container mx-auto px-4">
                <motion.div
                    className="max-w-2xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
                    <p className="text-muted-foreground mb-8">{t('ctaDesc')}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/quiz">
                            <Button size="lg" className="h-14 px-8 rounded-xl">
                                {t('quizButton')}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/shop">
                            <Button variant="outline" size="lg" className="h-14 px-8 rounded-xl">
                                {t('shopButton')}
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
