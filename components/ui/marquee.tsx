"use client";

import { cn } from "@/lib/utils";
import React, { ComponentPropsWithoutRef } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
    /**
     * Optional boolean to reverse the marquee direction.
     */
    reverse?: boolean;
    /**
     * Pause the animation on hover.
     */
    pauseOnHover?: boolean;
    /**
     * Content to scroll.
     */
    children: React.ReactNode;
    /**
     * Number of copies to render for seamless looping. Default is 2.
     */
    repeat?: number;
}

export function Marquee({
    className,
    reverse,
    pauseOnHover = false,
    children,
    repeat = 4,
    ...props
}: MarqueeProps) {
    return (
        <div
            {...props}
            className={cn(
                "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
                className
            )}
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row",
                            reverse && "animate-marquee-reverse",
                            pauseOnHover && "group-hover:[animation-play-state:paused]"
                        )}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
}
