"use client";

import { useTranslations } from "next-intl";
import { Question } from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";

interface QuizQuestionProps {
    question: Question;
    onAnswer: (answerId: string) => void;
}

export default function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
    const t = useTranslations("Quiz");

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold text-center">{t(question.key)}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {question.answers.map((answer) => (
                    <Button
                        key={answer.id}
                        variant="outline"
                        className="h-auto py-4 text-lg justify-start px-6"
                        onClick={() => onAnswer(answer.id)}
                    >
                        {t(answer.key)}
                    </Button>
                ))}
            </div>
        </div>
    );
}
