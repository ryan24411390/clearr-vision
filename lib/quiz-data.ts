export type Question = {
    id: string;
    key: string; // Translation key for question text
    answers: {
        id: string;
        key: string; // Translation key for answer text
        value: any;
    }[];
};

export const QUIZ_QUESTIONS: Question[] = [
    {
        id: "age",
        key: "ageQuestion",
        answers: [
            { id: "a1", key: "under40", value: 0.75 },
            { id: "a2", key: "40-44", value: 1.00 },
            { id: "a3", key: "45-49", value: 1.50 },
            { id: "a4", key: "50-54", value: 2.00 },
            { id: "a5", key: "55-59", value: 2.50 },
            { id: "a6", key: "60plus", value: 3.00 },
        ],
    },
    {
        id: "usage",
        key: "usageQuestion",
        answers: [
            { id: "u1", key: "reading", value: "reading" },
            { id: "u2", key: "computer", value: "computer" },
        ],
    },
    {
        id: "style",
        key: "styleQuestion",
        answers: [
            { id: "s1", key: "classic", value: "rectangular" },
            { id: "s2", key: "modern", value: "round" },
            { id: "s3", key: "bold", value: "square" },
        ],
    },
];

export function calculatePower(ageValue: number, usage: string): number {
    // Simple logic: if computer usage, might need slightly less power or blue cut
    // keeping it simple for now, just return age based power
    return ageValue;
}
