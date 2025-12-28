"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowRight, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function HeroSection() {
    const t = useTranslations('HomePage');
    const common = useTranslations('Common');

    return (
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden pt-20 pb-10">
            <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                {/* Left Content */}
                <div className="flex-1 flex flex-col items-start text-left gap-6 animate-in slide-in-from-left duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium backdrop-blur-md">
                        <Sparkles className="w-4 h-4" />
                        <span>The Future of Vision is Here</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                        See the World <br />
                        <span className="text-primary dark:text-secondary">Clearly & Beautifully</span>
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                        Experience the perfect blend of precision optics and award-winning aesthetics.
                        Clearr Vision brings you premium eyewear that looks as good as it sees.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2">
                        <Link href="/shop">
                            <MagneticButton className="h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium">
                                {common('buyNow')} <ArrowRight className="ml-2 w-4 h-4" />
                            </MagneticButton>
                        </Link>
                        <Link href="/shop">
                            <div className="h-12 px-8 rounded-full border border-input bg-background/50 hover:bg-muted text-foreground flex items-center justify-center cursor-pointer transition-colors font-medium">
                                {common('addToCart')}
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Right Visual - Abstract Composition */}
                <div className="flex-1 w-full relative flex items-center justify-center animate-in slide-in-from-right duration-700 delay-200">
                    <div className="relative w-full max-w-[600px] aspect-square">
                        {/* Background Blobs */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-[80px] pointer-events-none -z-10" />

                        {/* Main "Dashboard/Product" Card */}
                        <GlassCard className="absolute inset-0 m-auto w-[90%] h-[60%] border-border shadow-2xl backdrop-blur-xl z-20 flex flex-col p-6 items-center justify-center">
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl mb-4 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Smart Vision</h3>
                            <p className="text-center text-muted-foreground text-sm max-w-[80%]">
                                Next-generation lens technology for the digital age.
                            </p>

                            {/* Fake UI Elements */}
                            <div className="mt-6 w-full space-y-3">
                                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[80%] bg-primary rounded-full animate-[loading_2s_ease-in-out_infinite]" />
                                </div>
                                <div className="h-2 w-[60%] bg-primary/5 rounded-full" />
                            </div>
                        </GlassCard>

                        {/* Floating Cards */}
                        <GlassCard className="absolute top-[10%] left-[5%] w-[180px] p-4 flex items-center gap-3 z-30 animate-bounce duration-[3s]">
                            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground">
                                <span className="font-bold">A+</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Certified</span>
                                <span className="font-bold text-sm">Top Rated</span>
                            </div>
                        </GlassCard>

                        <GlassCard className="absolute bottom-[20%] right-[0%] w-[160px] p-4 flex flex-col gap-2 z-30 animate-pulse delay-700">
                            <span className="text-xs text-muted-foreground">UV Protection</span>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full w-full bg-primary" />
                            </div>
                            <span className="text-right text-xs font-bold text-primary">100%</span>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </section>
    );
}
