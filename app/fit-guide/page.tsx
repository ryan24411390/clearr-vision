"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { Ruler, Square, Circle, Hexagon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FitGuidePage() {
    const faceShapes = [
        { icon: Square, shape: "square", title: "Square Face", desc: "Strong jawline, equal width and length", recommend: "Try: Round or oval frames" },
        { icon: Circle, shape: "round", title: "Round Face", desc: "Soft curves, equal width and length", recommend: "Try: Angular or square frames" },
        { icon: Hexagon, shape: "oval", title: "Oval Face", desc: "Balanced proportions, slightly wider at cheekbones", recommend: "Try: Most frames work well" },
        { icon: Hexagon, shape: "heart", title: "Heart Face", desc: "Wide forehead, narrow chin", recommend: "Try: Bottom-heavy frames, aviators" },
    ];

    const measureSteps = [
        { title: "Temple Length", desc: "Measure from the hinge to the tip that goes behind your ear. Standard lengths are 135mm, 140mm, and 145mm." },
        { title: "Bridge Width", desc: "The bridge sits on your nose. Measure the distance between your eyes at the nose bridge." },
        { title: "Lens Width", desc: "Measure the widest part of your current lens. This determines how much of your face the frame will cover." },
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                            <Ruler className="w-4 h-4" />
                            Find Your Perfect Fit
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Frame Fit Guide
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            The right fit makes all the difference. Learn how to choose frames that match your face shape and stay comfortable all day.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Measurement Guide */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">How to Measure</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Follow these simple steps to find your ideal frame size</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
                    {measureSteps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="p-6 rounded-2xl bg-card border border-border"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (index + 1) * 0.1 }}
                        >
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                                {index + 1}
                            </div>
                            <h3 className="font-semibold mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Face Shapes */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Your Face Shape</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">Different face shapes suit different frame styles. Find yours below.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {faceShapes.map((face, index) => (
                            <motion.div
                                key={index}
                                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <face.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-bold text-center mb-2">{face.title}</h3>
                                <p className="text-sm text-muted-foreground text-center mb-4">{face.desc}</p>
                                <div className="pt-4 border-t border-border">
                                    <p className="text-xs font-medium text-primary text-center">{face.recommend}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 container mx-auto px-4">
                <motion.div
                    className="max-w-2xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold mb-4">Still Not Sure?</h2>
                    <p className="text-muted-foreground mb-8">Take our quick quiz to get personalized frame recommendations based on your face shape and style preferences.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/quiz">
                            <Button size="lg" className="h-14 px-8 rounded-xl">
                                Take the Quiz
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/shop">
                            <Button variant="outline" size="lg" className="h-14 px-8 rounded-xl">
                                Browse All Frames
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
