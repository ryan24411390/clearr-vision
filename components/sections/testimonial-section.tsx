"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
    {
        name: "তানিয়া আহমেদ",
        role: "ফ্যাশন ডিজাইনার",
        content: "আমি আগে কখনো অনলাইনে চশমা কিনিনি, কিন্তু ক্লিয়ার ভিশন এর কালেকশন দেখে আমি মুগ্ধ। চশমাগুলো যেমন স্টাইলিশ, তেমনি আরামদায়ক।",
        rating: 5,
        location: "ঢাকা"
    },
    {
        name: "করিম চৌধুরী",
        role: "সফটওয়্যার ইঞ্জিনিয়ার",
        content: "সারাদিন কম্পিউটারের সামনে বসে কাজ করতে হয়। ব্লু-লাইট প্রোটেকশন লেন্সগুলো আমার চোখের ব্যথা একদম কমিয়ে দিয়েছে। ১০/১০ রেকমেন্ড করবো!",
        rating: 5,
        location: "চট্টগ্রাম"
    },
    {
        name: "সাদিয়া ইসলাম",
        role: "ব্যাংকার",
        content: "অবিশ্বাস্য সার্ভিস! অর্ডার করার ২ দিনের মধ্যেই হাতে পেয়েছি। প্যাকিংটাও খুব প্রিমিয়াম ছিল। মনে হচ্ছে কোনো লাক্সারি ব্র্যান্ডের চশমা পরছি।",
        rating: 5,
        location: "সিলেট"
    }
];

export function TestimonialSection() {
    return (
        <section className="container mx-auto px-4 py-24 relative">
            {/* Decorative background blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 relative z-10">
                <div className="max-w-2xl">
                    <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-2 block">
                        Customer Stories
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 font-bengali leading-snug">
                        বাংলাদেশের মানুষের <br />
                        <span className="text-primary italic font-serif">আস্থা ও ভালোবাসা।</span>
                    </h2>
                </div>

                <div className="flex items-center gap-4 bg-muted/50 backdrop-blur-sm border border-border px-6 py-3 rounded-full">
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-[10px] text-primary-foreground font-bold shadow-lg">
                                {/* Placeholder Avatar */}
                                {i === 4 ? "50+" : ""}
                            </div>
                        ))}
                    </div>
                    <div className="text-sm font-medium">
                        <span className="font-bold block text-lg leading-none">৫০০+</span>
                        <span className="text-muted-foreground text-xs">হ্যাপি কাস্টমার</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                    <GlassCard
                        key={i}
                        className={cn(
                            "p-8 flex flex-col items-start gap-6 hover:shadow-2xl transition-all duration-500 group border-border",
                            i === 1 ? "md:-mt-8 md:mb-8" : "" // Staggered grid effect
                        )}
                    >
                        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-2 group-hover:scale-110 transition-transform">
                            <Quote className="w-5 h-5 fill-current" />
                        </div>

                        <p className="text-lg font-bengali text-foreground/90 leading-relaxed">
                            "{t.content}"
                        </p>

                        <div className="mt-auto flex items-center justify-between w-full pt-6 border-t border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm font-bengali">{t.name}</h4>
                                    <p className="text-xs text-muted-foreground font-bengali">{t.role}, {t.location}</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5 text-secondary">
                                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
}
