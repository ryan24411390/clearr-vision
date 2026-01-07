"use client";

import { AboutHero } from "@/components/intro/about-hero";
import { TrustSection } from "@/components/sections/trust-section";
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";
import { Eye, Shield, Leaf, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <AboutHero />

            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Why We Started</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We noticed something strange: people spend over 8 hours a day looking at screens, but most glasses are made for a bygone era. They either look like medical equipment or cost a fortune.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Smart Reading aims to fix that. We make glasses that look beautiful, feel invisible on your face, and actually protect your eyes from the digital world—without designer prices.
                        </p>
                    </div>
                    <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted">
                        {/* Placeholder for About Image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-muted-foreground">
                            [Team Photo]
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">What We Believe</h2>
                        <p className="text-muted-foreground">These aren't just words. This is how we make decisions.</p>
                    </div>

                    <BentoGrid className="max-w-4xl mx-auto">
                        <BentoItem colSpan={1} className="p-6 flex flex-col items-center text-center gap-4 bg-secondary/5">
                            <div className="p-3 bg-secondary/10 rounded-full text-secondary">
                                <Eye className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold">Precision</h3>
                            <p className="text-sm text-muted-foreground">Every lens is optically perfect.</p>
                        </BentoItem>
                        <BentoItem colSpan={1} className="p-6 flex flex-col items-center text-center gap-4 bg-primary/5">
                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold">Protection</h3>
                            <p className="text-sm text-muted-foreground">Real blue light protection.</p>
                        </BentoItem>
                        <BentoItem colSpan={1} className="p-6 flex flex-col items-center text-center gap-4 bg-green-500/5">
                            <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                                <Leaf className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold">Sustainability</h3>
                            <p className="text-sm text-muted-foreground">Only sustainable materials.</p>
                        </BentoItem>
                        <BentoItem colSpan={1} className="p-6 flex flex-col items-center text-center gap-4 bg-rose-500/5">
                            <div className="p-3 bg-rose-500/10 rounded-full text-rose-500">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold">Honesty</h3>
                            <p className="text-sm text-muted-foreground">Fair prices, no games.</p>
                        </BentoItem>
                    </BentoGrid>
                </div>
            </section>

            <TrustSection />
        </div>
    );
}
