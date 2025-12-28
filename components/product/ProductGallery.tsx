"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                <Image
                    src={images[selectedIndex]}
                    alt="Product image"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-auto pb-2">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={cn(
                            "relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border-2",
                            selectedIndex === index
                                ? "border-primary"
                                : "border-transparent hover:border-muted-foreground/50"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`Product thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
