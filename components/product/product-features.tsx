"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Shield, Truck } from "lucide-react";

export function ProductFeatures({ description }: { description: string }) {
    // Split description into points if possible, otherwise just show it nicely.
    // Assuming description might be a paragraph, let's try to parse it or just present it beautifully.

    // For this generic component, we'll try to highlight key phrases if they exist, 
    // but primarily we'll focus on readability.

    const features = [
        {
            icon: <Shield className="w-6 h-6 text-blue-500" />,
            title: "Premium Quality",
            text: "Crafted with the finest materials for durability and comfort."
        },
        {
            icon: <Truck className="w-6 h-6 text-green-500" />,
            title: "Fast Delivery",
            text: "Get it delivered to your doorstep within 2-3 days."
        },
        {
            icon: <CheckCircle2 className="w-6 h-6 text-purple-500" />,
            title: "Satisfaction Guarantee",
            text: "7-day easy return policy if you're not completely satisfied."
        }
    ];

    return (
        <div className="py-12 space-y-12">
            <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">Why Choose This?</h3>
                <div className="prose prose-lg text-muted-foreground leading-relaxed">
                    <p>{description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-4 p-4 md:block md:p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                    >
                        <div className="shrink-0 mb-0 md:mb-4 bg-white dark:bg-zinc-800 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm">
                            {feature.icon}
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-1 md:mb-2">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{feature.text}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
