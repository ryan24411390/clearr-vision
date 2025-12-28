"use client";

import { useTranslations } from 'next-intl';

export function StatsSection() {
    return (
        <section className="w-full py-20 bg-primary/5 border-t border-border/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/20">
                    <div className="flex flex-col gap-2 p-4">
                        <span className="text-4xl md:text-5xl font-black text-primary dark:text-secondary">99%</span>
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">UV Protection</span>
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                        <span className="text-4xl md:text-5xl font-black text-primary dark:text-secondary">24h</span>
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Fast Delivery</span>
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                        <span className="text-4xl md:text-5xl font-black text-primary dark:text-secondary">5k+</span>
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Orders Shipped</span>
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                        <span className="text-4xl md:text-5xl font-black text-primary dark:text-secondary">50+</span>
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Style Options</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
