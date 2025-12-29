import { cn } from "@/lib/utils";

interface FormSectionProps {
    children: React.ReactNode;
    className?: string;
}

export function FormSection({ children, className }: FormSectionProps) {
    return (
        <div className={cn("rounded-xl border bg-card/50 p-4 space-y-6", className)}>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

interface SectionHeaderProps {
    step?: string;
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
}

export function SectionHeader({ step, icon, title, subtitle }: SectionHeaderProps) {
    return (
        <div className="flex items-center gap-2 mb-3">
            {step && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-bold">
                    {step}
                </span>
            )}
            {icon && (
                <div className="p-1.5 rounded-full bg-primary/10">
                    {icon}
                </div>
            )}
            <span className="text-base font-semibold">
                {title}
                {subtitle && <span className="text-muted-foreground text-sm font-normal ml-1">({subtitle})</span>}
            </span>
        </div>
    );
}
