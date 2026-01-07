"use client";

import { Question } from "@/lib/quiz-data";
import { Button } from "@/components/ui/button";

interface QuizQuestionProps {
    question: Question;
    onAnswer: (answerId: string) => void;
}

// Static English text for quiz questions
const QUESTION_TEXT: Record<string, string> = {
    ageQuestion: "What is your age?",
    usageQuestion: "What will you primarily use these glasses for?",
    styleQuestion: "What frame style do you prefer?",
};

const ANSWER_TEXT: Record<string, string> = {
    "under40": "Under 40",
    "40-44": "40-44",
    "45-49": "45-49",
    "50-54": "50-54",
    "55-59": "55-59",
    "60plus": "60+",
    "reading": "Reading (books, newspapers)",
    "computer": "Computer work",
    "classic": "Classic / Rectangular",
    "modern": "Modern / Round",
    "bold": "Bold / Square",
};

export default function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold text-center">{QUESTION_TEXT[question.key] || question.key}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {question.answers.map((answer) => (
                    <Button
                        key={answer.id}
                        variant="outline"
                        className="h-auto py-4 text-lg justify-start px-6"
                        onClick={() => onAnswer(answer.id)}
                    >
                        {ANSWER_TEXT[answer.key] || answer.key}
                    </Button>
                ))}
            </div>
        </div>
    );
}
