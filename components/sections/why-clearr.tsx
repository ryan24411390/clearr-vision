"use client";

import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
    },
};

export function WhyClearrSection() {
    const t = useTranslations('WhyClearr');

    const BENEFITS = [
        {
            icon: Truck,
            titleKey: "freeDeliveryTitle",
            descKey: "freeDeliveryDesc",
            gradient: "from-blue-500/20 to-blue-600/5",
            iconColor: "text-blue-400"
        },
        {
            icon: ShieldCheck,
            titleKey: "qualityTitle",
            descKey: "qualityDesc",
            gradient: "from-amber-500/20 to-amber-600/5",
            iconColor: "text-amber-400"
        },
        {
            icon: RotateCcw,
            titleKey: "returnsTitle",
            descKey: "returnsDesc",
            gradient: "from-emerald-500/20 to-emerald-600/5",
            iconColor: "text-emerald-400"
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-muted/50 relative overflow-hidden">
            {/* Subtle border lines */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                        {t('sectionTitle')}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {t('sectionDescription')}
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {BENEFITS.map((benefit, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group flex flex-col items-center text-center"
                        >
                            {/* Icon Container */}
                            <motion.div
                                className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${benefit.gradient} border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                                whileHover={{ rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <benefit.icon className={`w-9 h-9 ${benefit.iconColor}`} />

                                {/* Glow effect on hover */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10`} />
                            </motion.div>

                            {/* Content */}
                            <h3 className="text-xl font-bold mb-3 text-foreground">
                                {t(benefit.titleKey)}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed max-w-xs">
                                {t(benefit.descKey)}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
