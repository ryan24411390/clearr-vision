import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

interface BentoItemProps {
    children: ReactNode;
    className?: string;
    colSpan?: 1 | 2 | 3 | 4;
    rowSpan?: 1 | 2 | 3 | 4;
}

export function BentoGrid({ children, className }: BentoGridProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]",
                className
            )}
        >
            {children}
        </div>
    );
}

export function BentoItem({ children, className, colSpan = 1, rowSpan = 1 }: BentoItemProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-[var(--glass-border)] bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg",
                // Column Spans
                colSpan === 1 && "md:col-span-1",
                colSpan === 2 && "md:col-span-2",
                colSpan === 3 && "md:col-span-3",
                colSpan === 4 && "md:col-span-4",
                // Row Spans
                rowSpan === 1 && "md:row-span-1",
                rowSpan === 2 && "md:row-span-2",
                rowSpan === 3 && "md:row-span-3",
                rowSpan === 4 && "md:row-span-4",
                className
            )}
        >
            {children}
        </div>
    );
}
