"use client";

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { Camera, Sparkles, Bell, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function VirtualTryOnPage() {
    const t = useTranslations('VirtualTryOn');

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="max-w-3xl mx-auto text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                            <Sparkles className="w-4 h-4" />
                            {t('badge')}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            {t('title')}
                        </h1>

                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                            {t('description')}
                        </p>

                        {/* Coming Soon Card */}
                        <motion.div
                            className="bg-card border border-border rounded-3xl p-8 md:p-12 max-w-xl mx-auto"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Camera className="w-10 h-10 text-primary" />
                            </div>

                            <h2 className="text-2xl font-bold mb-4">{t('comingSoonTitle')}</h2>
                            <p className="text-muted-foreground mb-8">
                                {t('comingSoonDesc')}
                            </p>

                            <div className="space-y-4">
                                <Button size="lg" className="w-full h-14 rounded-xl" disabled>
                                    <Bell className="w-5 h-5 mr-2" />
                                    {t('notifyButton')}
                                </Button>

                                <Link href="/shop">
                                    <Button variant="outline" size="lg" className="w-full h-14 rounded-xl">
                                        {t('browseShop')}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Preview */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('featuresTitle')}</h2>
                        <p className="text-muted-foreground">{t('featuresDesc')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            { icon: "camera", titleKey: "feature1Title", descKey: "feature1Desc" },
                            { icon: "sparkles", titleKey: "feature2Title", descKey: "feature2Desc" },
                            { icon: "zap", titleKey: "feature3Title", descKey: "feature3Desc" },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="p-6 rounded-2xl bg-card border border-border text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                                    {feature.icon === "camera" && <Camera className="w-6 h-6 text-primary" />}
                                    {feature.icon === "sparkles" && <Sparkles className="w-6 h-6 text-primary" />}
                                    {feature.icon === "zap" && <Sparkles className="w-6 h-6 text-primary" />}
                                </div>
                                <h3 className="font-semibold mb-2">{t(feature.titleKey)}</h3>
                                <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
