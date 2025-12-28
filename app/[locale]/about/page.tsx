"use client";

import { AboutHero } from "@/components/intro/about-hero";
import { TrustSection } from "@/components/sections/trust-section";
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";
import { Eye, Shield, Leaf, Heart } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function AboutPage() {
    const t = useTranslations('About');

    return (
        <div className="min-h-screen bg-background">
            <AboutHero />

            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">{t('missionTitle')}</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {t('missionP1')}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            {t('missionP2')}
                        </p>
                    </div>
                    <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted">
                        {/* Placeholder for About Image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-muted-foreground">
                            {t('imagePlaceholder')}
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">{t('coreValuesTitle')}</h2>
                        <p className="text-muted-foreground">{t('coreValuesDesc')}</p>
                    </div>

                    <BentoGrid className="max-w-4xl mx-auto">
                        <BentoItem colSpan={1} className="p-6 flex flex-col items-center text-center gap-4 bg-secondary/5">
                            <div className="p-3 bg-secondary/10 rounded-full text-secondary">
                                <Eye className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold">{t('precision')}</h3>
                            <p className="text-sm text-muted-foreground">{t('precisionDesc')}</p>
                        </BentoItem>
                        <BentoItem colSpan={1} className="p-6 flex flex-col items-center text-center gap-4 bg-primary/5">
                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold">{t('protection')}</h3>
                            <p className="text-sm text-muted-foreground">{t('protectionDesc')}</p>
                        </BentoItem>
                        <BentoItem colSpan={1} className="p-6 flex flex-col items-center text-center gap-4 bg-green-500/5">
                            <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                                <Leaf className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold">{t('sustainability')}</h3>
                            <p className="text-sm text-muted-foreground">{t('sustainabilityDesc')}</p>
                        </BentoItem>
                        <BentoItem colSpan={1} className="p-6 flex flex-col items-center text-center gap-4 bg-rose-500/5">
                            <div className="p-3 bg-rose-500/10 rounded-full text-rose-500">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold">{t('care')}</h3>
                            <p className="text-sm text-muted-foreground">{t('careDesc')}</p>
                        </BentoItem>
                    </BentoGrid>
                </div>
            </section>

            <TrustSection />
        </div>
    );
}
