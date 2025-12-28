"use client";

import { useTranslations } from "next-intl";
import QuizContainer from "@/components/quiz/QuizContainer";

export default function QuizPage() {
    const t = useTranslations("Quiz");

    return (
        <div className="container py-16 px-4 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    {t("subtitle")}
                </p>
            </div>

            <QuizContainer />
        </div>
    );
}
