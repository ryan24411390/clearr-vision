"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Placeholder, assuming shadcn toast exists or will be added

// Placeholder for missing Toast, can be redundant if component doesn't exist yet.
// Since I haven't checked for toast component, I'll mock a simple alert or console log for now if toast is missing
// to avoid build errors. But generally shadcn init adds it.
// I will verify components/ui later.
// For now, I will omit the toast import to be safe and just focus on store.

interface ProductConfiguratorProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
}

const POWERS = [
    "+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+2.75", "+3.00"
];

const COLORS = [
    { name: "Tortoise", value: "#5c4033" },
    { name: "Black", value: "#000000" },
    { name: "Clear", value: "#e5e5e5" },
];

export function ProductConfigurator({ product }: ProductConfiguratorProps) {
    const [power, setPower] = useState(POWERS[0]);
    const [color, setColor] = useState(COLORS[0]);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        addItem({
            id: `${product.id}-${power}-${color.name}`, // Unique ID for variant
            productId: product.id,
            name: `${product.name} - ${color.name} (${power})`,
            price: product.price,
            image: product.image,
            quantity,
            variant: {
                power,
                color: color.name,
            },
        });
        // Temporary feedback
        alert("Added to cart!");
    };

    return (
        <div className="space-y-6">
            {/* Power Selection */}
            <div>
                <h3 className="text-sm font-medium mb-3">Select Power</h3>
                <div className="grid grid-cols-4 gap-2">
                    {POWERS.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPower(p)}
                            className={`
                px-3 py-2 text-sm border rounded-md transition-all
                ${power === p
                                    ? "border-primary bg-primary text-primary-foreground font-medium"
                                    : "border-input hover:border-gray-400"}
              `}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Not sure? <a href="#" className="underline">Take our vision quiz</a>.
                </p>
            </div>

            {/* Color Selection */}
            <div>
                <h3 className="text-sm font-medium mb-3">Select Color: <span className="text-muted-foreground font-normal">{color.name}</span></h3>
                <div className="flex gap-3">
                    {COLORS.map((c) => (
                        <button
                            key={c.name}
                            onClick={() => setColor(c)}
                            className={`
                w-10 h-10 rounded-full border-2 focus:outline-none transition-all
                ${color.name === c.name ? "border-primary scale-110 ring-2 ring-offset-2 ring-primary/30" : "border-transparent hover:scale-105"}
              `}
                            style={{ backgroundColor: c.value }}
                            aria-label={c.name}
                        />
                    ))}
                </div>
            </div>

            {/* Quantity */}
            <div>
                <h3 className="text-sm font-medium mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-muted-foreground"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-muted-foreground"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                        In Stock
                    </div>
                </div>
            </div>

            <Button size="lg" className="w-full gap-2 text-lg" onClick={handleAddToCart}>
                <ShoppingBag className="h-5 w-5" />
                Add to Cart - {new Intl.NumberFormat("bn-BD", { style: "currency", currency: "BDT", minimumFractionDigits: 0 }).format(product.price * quantity)}
            </Button>
        </div>
    );
}
