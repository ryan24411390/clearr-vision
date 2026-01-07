"use client";

import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";
import { Eye, Shield, Sun, Monitor, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function TechnologyPage() {
    const technologies = [
        { icon: Shield, color: "primary", title: "Blue Light Blocking", desc: "Our lenses filter harmful blue light from screens, reducing eye strain and improving sleep. Perfect for those who spend a lot of time on computers and phones." },
        { icon: Sun, color: "amber-500", title: "100% UV Protection", desc: "UV400 protection blocks both UVA and UVB rays. Your eyes stay safe from sun damage even on cloudy days." },
        { icon: Eye, color: "green-500", title: "Anti-Glare Coating", desc: "Reduces reflections from screens and overhead lights. See clearly without squinting." },
        { icon: Layers, color: "blue-500", title: "Multi-Layer Coating", desc: "Seven layers of premium coating for durability, clarity, and protection. Each layer serves a specific purpose." },
        { icon: Monitor, color: "purple-500", title: "Digital Eye Strain Relief", desc: "Optimized for modern life. Designed for how eyes are used today." },
        { icon: Zap, color: "rose-500", title: "Scratch Resistant", desc: "Hard coating protects against everyday wear. Lenses stay clear for years, not months." },
    ];

    const processSteps = [
        { title: "Optical Grinding", desc: "Precise cut for your prescription" },
        { title: "Coating", desc: "Seven protective layers applied" },
        { title: "Quality Check", desc: "Every lens inspected by experts" },
        { title: "Frame Fitting", desc: "Perfect alignment for clear vision" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-24 md:py-32 bg-gradient-to-b from-muted/50 to-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="max-w-3xl mx-auto text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Lens Technology
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Every lens combines precise optics with modern protection. No shortcuts.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Technology Grid */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">What's in Our Lenses</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">We use only the best materials and coatings to give your eyes the protection they deserve.</p>
                </div>

                <BentoGrid className="max-w-5xl mx-auto">
                    {technologies.map((tech, index) => (
                        <BentoItem
                            key={index}
                            colSpan={index < 2 ? 2 : 1}
                            className={`p-8 flex flex-col gap-4 bg-${tech.color}/5 hover:bg-${tech.color}/10 transition-colors`}
                        >
                            <div className={`p-3 w-fit rounded-xl bg-${tech.color}/10`}>
                                <tech.icon className={`w-6 h-6 text-${tech.color}`} />
                            </div>
                            <h3 className="text-xl font-bold">{tech.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{tech.desc}</p>
                        </BentoItem>
                    ))}
                </BentoGrid>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How We Make Them</h2>
                        <p className="text-muted-foreground">Every lens goes through a rigorous quality control process</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index + 1) * 0.1 }}
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                    {index + 1}
                                </div>
                                <h3 className="font-semibold mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
