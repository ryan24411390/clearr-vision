"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface CopyableInfoProps {
    label?: string;
    value: string;
    className?: string;
    variant?: "default" | "minimal" | "box";
    showLabelOnHover?: boolean;
}

export function CopyableInfo({
    label,
    value,
    className,
    variant = "box",
    showLabelOnHover = false
}: CopyableInfoProps) {
    const toast = useToast();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy");
        }
    };

    if (variant === "minimal") {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <span className="truncate">{value}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <Check className="h-3 w-3 text-green-500" />
                    ) : (
                        <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copy {label || value}</span>
                </Button>
            </div>
        );
    }

    return (
        <div className={cn(
            "group relative flex items-center justify-between gap-3 rounded-md bg-muted/40 border border-border/50 px-3 py-2 transition-all hover:bg-muted/60 hover:border-border",
            className
        )}>
            <div className="min-w-0 flex-1">
                {label && (
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                        {label}
                    </p>
                )}
                <p className="font-medium text-sm truncate font-mono text-foreground/90">
                    {value}
                </p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground hover:bg-background/80"
                onClick={handleCopy}
            >
                {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                    <Copy className="h-3.5 w-3.5" />
                )}
                <span className="sr-only">Copy {label || value}</span>
            </Button>
        </div>
    );
}
