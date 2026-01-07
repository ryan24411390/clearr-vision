"use client";

import QuizContainer from "@/components/quiz/QuizContainer";

export default function QuizPage() {
    return (
        <div className="container py-16 px-4 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Find Your Perfect Power</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Three questions. Thirty seconds. The right power for your eyes.
                </p>
            </div>

            <QuizContainer />
        </div>
    );
}
