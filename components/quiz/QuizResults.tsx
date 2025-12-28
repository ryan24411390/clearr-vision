"use client";

import { useTranslations } from "next-intl";
import { calculatePower, QUIZ_QUESTIONS } from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

interface QuizResultsProps {
    answers: Record<string, string>;
    onRetake: () => void;
}

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function QuizResults({ answers, onRetake }: QuizResultsProps) {
    const t = useTranslations("Quiz");
    const [calculating, setCalculating] = useState(true);

    // Calculate results
    // Find value of age answer
    const ageQuestion = QUIZ_QUESTIONS.find(q => q.id === "age");
    const ageAnswerId = answers["age"];
    const ageAnswer = ageQuestion?.answers.find(a => a.id === ageAnswerId);
    const ageValue = (ageAnswer?.value as number) || 0;

    // Find usage
    const usageAnswerId = answers["usage"];
    const usageValue = QUIZ_QUESTIONS.find(q => q.id === "usage")?.answers.find(a => a.id === usageAnswerId)?.value as string;

    const power = calculatePower(ageValue, usageValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCalculating(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (calculating) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-muted border-t-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                </div>
                <h3 className="text-xl font-medium animate-pulse">Analyzing your vision profile...</h3>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-8 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-2">{t("result")}</h2>
                <p className="text-muted-foreground">Based on your age and daily habits</p>
            </motion.div>

            <motion.div
                className="relative group cursor-default"
                whileHover={{ scale: 1.05 }}
            >
                <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/40 transition-colors" />
                <div className="p-12 rounded-full border-4 border-primary/20 bg-background/50 backdrop-blur-md w-64 h-64 flex flex-col items-center justify-center relative z-10 shadow-2xl">
                    <span className="text-muted-foreground text-sm uppercase tracking-widest mb-2">Recommended Power</span>
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">+{power.toFixed(2)}</span>
                </div>
            </motion.div>

            <div className="flex flex-col gap-4 w-full max-w-sm mt-4">
                <Button size="lg" asChild className="w-full text-lg h-14 rounded-full shadow-lg shadow-primary/20">
                    <Link href={`/shop?power=${power}`}>
                        {t("shopRecommended")}
                    </Link>
                </Button>
                <Button variant="ghost" onClick={onRetake} className="hover:bg-transparent hover:text-primary">
                    {t("back")} / Retake Analysis
                </Button>
            </div>
        </div>
    );
}
