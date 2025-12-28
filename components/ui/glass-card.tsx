import { cn } from "@/lib/utils"; // Ensure you have a utils file for class merging
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] transition-all duration-300",
                hoverEffect && "hover:shadow-lg hover:shadow-secondary/20 hover:border-secondary/50",
                className
            )}
        >
            <div className="relative z-10">{children}</div>

            {/* Subtle Gradient Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    );
}
