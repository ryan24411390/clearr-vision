"use client";

import { useTranslations } from 'next-intl';
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";
import { Eye, Shield, Sun, Monitor, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function TechnologyPage() {
    const t = useTranslations('Technology');

    const technologies = [
        { icon: Shield, color: "primary", titleKey: "blueLightTitle", descKey: "blueLightDesc" },
        { icon: Sun, color: "amber-500", titleKey: "uvProtectionTitle", descKey: "uvProtectionDesc" },
        { icon: Eye, color: "green-500", titleKey: "antiGlareTitle", descKey: "antiGlareDesc" },
        { icon: Layers, color: "blue-500", titleKey: "multiCoatTitle", descKey: "multiCoatDesc" },
        { icon: Monitor, color: "purple-500", titleKey: "digitalTitle", descKey: "digitalDesc" },
        { icon: Zap, color: "rose-500", titleKey: "scratchResistTitle", descKey: "scratchResistDesc" },
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
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            {t('heroTitle')}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {t('heroDesc')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Technology Grid */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">{t('sectionTitle')}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">{t('sectionDesc')}</p>
                </div>

                <BentoGrid className="max-w-5xl mx-auto">
                    {technologies.map((tech, index) => (
                        <BentoItem
                            key={index}
                            colSpan={index < 2 ? 2 : 1}
                            className={`p-8 flex flex-col gap-4 bg-${tech.color}/5 hover:bg-${tech.color}/10 transition-colors`}
                        >
                            <div className={`p-3 w-fit rounded-xl bg-${tech.color}/10`}>
                                <tech.icon className={`w-6 h-6 text-${tech.color}`} />
                            </div>
                            <h3 className="text-xl font-bold">{t(tech.titleKey)}</h3>
                            <p className="text-muted-foreground leading-relaxed">{t(tech.descKey)}</p>
                        </BentoItem>
                    ))}
                </BentoGrid>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">{t('processTitle')}</h2>
                        <p className="text-muted-foreground">{t('processDesc')}</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {[1, 2, 3, 4].map((step) => (
                            <motion.div
                                key={step}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: step * 0.1 }}
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                    {step}
                                </div>
                                <h3 className="font-semibold mb-2">{t(`step${step}Title`)}</h3>
                                <p className="text-sm text-muted-foreground">{t(`step${step}Desc`)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
