"use client";

import { useTranslations } from 'next-intl';

export function SocialProofSection() {
    return (
        <section className="w-full py-10 border-y border-border/50 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-medium text-muted-foreground mb-8 text-transform uppercase tracking-widest">
                    Trusted by Visionaries Worldwide
                </p>
                <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder Logo 1 */}
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-6 h-6 bg-foreground rounded-full" />
                        ACME Corp
                    </div>
                    {/* Placeholder Logo 2 */}
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-6 h-6 border-2 border-foreground rounded-sm" />
                        GlobalLens
                    </div>
                    {/* Placeholder Logo 3 */}
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-6 h-6 bg-foreground/50 rotate-45" />
                        OptiTech
                    </div>
                    {/* Placeholder Logo 4 */}
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-6 h-6 border-[3px] border-foreground rounded-full" />
                        Visionary
                    </div>
                </div>
            </div>
        </section>
    );
}
