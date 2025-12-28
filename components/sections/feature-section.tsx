"use client";

import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield, Zap, Eye, Smartphone, Layers, Sun } from "lucide-react";

export function FeatureSection() {
    return (
        <section className="container mx-auto px-4 py-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                    Why Choose <span className="text-primary dark:text-secondary">Clearr</span>?
                </h2>
                <p className="text-lg text-muted-foreground">
                    We combine cutting-edge lens technology with timeless design to provide an unparalleled visual experience.
                </p>
            </div>

            <BentoGrid className="grid-rows-[200px_200px_200px] md:grid-rows-[280px_280px]">
                {/* Main Feature - Large */}
                <BentoItem colSpan={2} rowSpan={2} className="md:col-span-2 md:row-span-2 min-h-[400px]">
                    <GlassCard className="h-full w-full flex flex-col justify-between p-8 border-none bg-gradient-to-br from-primary/5 to-primary/20 relative overflow-hidden group">
                        <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-2">
                            <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                                <Shield className="w-8 h-8 text-primary dark:text-secondary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Advanced Protection</h3>
                            <p className="text-muted-foreground text-sm max-w-[80%]">
                                Our lenses block 99.9% of harmful blue light and UV rays,
                                keeping your eyes safe in the digital age. Recommended by leading optometrists.
                            </p>
                        </div>

                        {/* Decorative Element */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative h-40 w-full mt-4 rounded-lg bg-background/50 border border-white/10 overflow-hidden shadow-inner group-hover:shadow-2xl transition-all duration-300">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                        </div>
                    </GlassCard>
                </BentoItem>

                {/* Speed Feature */}
                <BentoItem colSpan={1} rowSpan={1} className="min-h-[200px]">
                    <GlassCard className="h-full w-full p-6 flex flex-col items-start justify-center hover:bg-secondary/5 transition-colors group">
                        <Zap className="w-8 h-8 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-bold">Fast Delivery</h3>
                        <p className="text-xs text-muted-foreground">24hr Shipping in Dhaka</p>
                    </GlassCard>
                </BentoItem>

                {/* Clarity Feature */}
                <BentoItem colSpan={1} rowSpan={1} className="min-h-[200px]">
                    <GlassCard className="h-full w-full p-6 flex flex-col items-start justify-center hover:bg-secondary/5 transition-colors group">
                        <Eye className="w-8 h-8 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-bold">Crystal Clear</h3>
                        <p className="text-xs text-muted-foreground">HD Anti-glare Coating</p>
                    </GlassCard>
                </BentoItem>

                {/* Mobile Ready */}
                <BentoItem colSpan={1} rowSpan={1} className="md:col-span-1 md:row-span-1 min-h-[200px]">
                    <GlassCard className="h-full w-full p-6 flex flex-col items-start justify-center hover:bg-secondary/5 transition-colors group">
                        <Smartphone className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-bold">Try On Virtually</h3>
                        <p className="text-xs text-muted-foreground">AR Experience App</p>
                    </GlassCard>
                </BentoItem>

                {/* Stackable */}
                <BentoItem colSpan={1} rowSpan={1} className="md:col-span-1 md:row-span-1 min-h-[200px]">
                    <GlassCard className="h-full w-full p-6 flex flex-col items-start justify-center hover:bg-secondary/5 transition-colors group">
                        <Layers className="w-8 h-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-bold">Modular Design</h3>
                        <p className="text-xs text-muted-foreground">Swap frames instantly</p>
                    </GlassCard>
                </BentoItem>

            </BentoGrid>
        </section>
    );
}
