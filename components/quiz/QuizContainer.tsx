"use client";

import { useState } from "react";
import { QUIZ_QUESTIONS } from "@/lib/quiz-data";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

import { AnimatePresence, motion } from "framer-motion";

export default function QuizContainer() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const t = useTranslations("Quiz");

    const handleAnswer = (answerId: string) => {
        const currentQuestion = QUIZ_QUESTIONS[currentStep];
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerId }));
        setCurrentStep((prev) => prev + 1);
    };

    const handleRetake = () => {
        setAnswers({});
        setCurrentStep(0);
    };

    const isFinished = currentStep >= QUIZ_QUESTIONS.length;
    const currentQuestion = QUIZ_QUESTIONS[currentStep];

    // Progress
    const progress = ((currentStep) / QUIZ_QUESTIONS.length) * 100;

    return (
        <div className="w-full max-w-2xl mx-auto p-6 md:p-12 bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

            {!isFinished && (
                <div className="mb-8 relative z-10">
                    <div className="h-3 w-full bg-secondary/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 text-right font-medium">
                        Step {currentStep + 1} of {QUIZ_QUESTIONS.length}
                    </p>
                </div>
            )}

            <AnimatePresence mode="wait">
                {isFinished ? (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                    >
                        <QuizResults answers={answers} onRetake={handleRetake} />
                    </motion.div>
                ) : (
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <QuizQuestion
                            question={currentQuestion}
                            onAnswer={handleAnswer}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
