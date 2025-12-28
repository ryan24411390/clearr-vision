"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatCurrency, cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { Check, Truck, Zap, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

interface ProductOrderFormProps {
    product: Product;
}

export function ProductOrderForm({ product }: ProductOrderFormProps) {
    const locale = useLocale();
    const router = useRouter();
    const toast = useToast();
    const addItem = useCartStore((state) => state.addItem);

    // Selection States
    const [quantity, setQuantity] = useState<"1" | "2">("2"); // Default to 2 for upsell
    const [location, setLocation] = useState<"inside" | "outside">("inside");
    const [color, setColor] = useState<string>("");
    const [power, setPower] = useState<string>("");

    // Loading States
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);

    // Derived Values
    const price = product.price;
    const qtyNum = parseInt(quantity);
    const subtotal = price * qtyNum;

    // Delivery Logic
    const isFreeDelivery = qtyNum >= 2;

    const validateSelection = (): boolean => {
        if (!color) {
            toast.error("Please select a frame color");
            return false;
        }
        if (!power) {
            toast.error("Please select a lens power");
            return false;
        }
        return true;
    };

    const createCartItem = () => {
        const variantId = `${color}-${power}`;
        return {
            id: `${product.id}-${variantId}`,
            productId: product.id,
            name: product.name,
            price: price,
            image: product.image,
            quantity: qtyNum,
            variant: {
                color,
                power,
            },
        };
    };

    const handleAddToCart = async () => {
        if (!validateSelection()) return;

        setAddingToCart(true);

        // Small delay for UX feedback
        await new Promise(resolve => setTimeout(resolve, 300));

        addItem(createCartItem());

        toast.success("Added to cart!", {
            description: `${qtyNum}x ${product.name} (${color}, ${power})`,
            action: {
                label: "View Cart",
                onClick: () => router.push("/checkout"),
            },
        });

        setAddingToCart(false);
    };

    const handleBuyNow = async () => {
        if (!validateSelection()) return;

        setBuyingNow(true);

        addItem(createCartItem());

        // Navigate to checkout
        router.push("/checkout");
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border bg-background/50 backdrop-blur-xl shadow-2xl ring-1 ring-white/20">
            {/* Header Accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />

            <div className="p-6 md:p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Order Now
                    </h3>
                    {isFreeDelivery && (
                        <span className="animate-pulse inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-600/20">
                            <Zap className="mr-1 h-3 w-3" /> Free Delivery Active
                        </span>
                    )}
                </div>

                <div className="space-y-8">

                    {/* Quantity Selection - Visual Cards */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold flex items-center gap-2">
                            Select Quantity <span className="text-muted-foreground text-sm font-normal">(কতটি নিবেন?)</span>
                        </Label>
                        <RadioGroup
                            value={quantity}
                            onValueChange={(v) => setQuantity(v as "1" | "2")}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {/* Option 1 */}
                            <label className={cn(
                                "relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all hover:bg-muted/50",
                                quantity === '1' ? "border-primary bg-primary/5 shadow-sm" : "border-muted bg-transparent"
                            )}>
                                <RadioGroupItem value="1" id="qty-1" className="sr-only" />
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-lg">1 Pair</span>
                                    {quantity === '1' && <Check className="h-5 w-5 text-primary" />}
                                </div>
                                <p className="text-sm text-muted-foreground">Standard Delivery Charge</p>
                                <div className="mt-2 text-lg font-bold">{formatCurrency(price, locale)}</div>
                            </label>

                            {/* Option 2 - Recommended */}
                            <label className={cn(
                                "relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all hover:bg-muted/50",
                                quantity === '2' ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20 ring-offset-2" : "border-muted bg-transparent"
                            )}>
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                        Best Value
                                    </span>
                                </div>
                                <RadioGroupItem value="2" id="qty-2" className="sr-only" />
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-lg">2 Pairs</span>
                                    {quantity === '2' && <Check className="h-5 w-5 text-primary" />}
                                </div>
                                <p className="text-sm text-green-600 font-semibold flex items-center">
                                    <Truck className="h-3 w-3 mr-1" /> FREE Delivery
                                </p>
                                <div className="mt-2 text-lg font-bold">{formatCurrency(price * 2, locale)}</div>
                            </label>
                        </RadioGroup>
                    </div>

                    {/* Delivery Location */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Delivery Location</Label>
                        <div className="grid grid-cols-2 gap-3 p-1 bg-muted/50 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setLocation("inside")}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                    location === "inside"
                                        ? "bg-background shadow text-foreground"
                                        : "text-muted-foreground hover:bg-background/50"
                                )}
                            >
                                Inside Dhaka (৳60)
                            </button>
                            <button
                                type="button"
                                onClick={() => setLocation("outside")}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                    location === "outside"
                                        ? "bg-background shadow text-foreground"
                                        : "text-muted-foreground hover:bg-background/50"
                                )}
                            >
                                Outside Dhaka (৳100)
                            </button>
                        </div>
                    </div>

                    {/* Product Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="color" className="text-sm font-medium">Frame Color</Label>
                            <Select value={color} onValueChange={setColor}>
                                <SelectTrigger id="color" className="h-12 bg-background/50 border-input/50 backdrop-blur-sm">
                                    <SelectValue placeholder="Select Color" />
                                </SelectTrigger>
                                <SelectContent>
                                    {product.availableColors.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="power" className="text-sm font-medium">Lens Power</Label>
                            <Select value={power} onValueChange={setPower}>
                                <SelectTrigger id="power" className="h-12 bg-background/50 border-input/50 backdrop-blur-sm">
                                    <SelectValue placeholder="Select Power" />
                                </SelectTrigger>
                                <SelectContent>
                                    {product.availablePowers.map((p) => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Order Summary Footer */}
                    <div className="rounded-xl bg-gradient-to-br from-card to-muted border border-border p-6 shadow-xl">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Subtotal ({qtyNum} {qtyNum > 1 ? 'pairs' : 'pair'})</span>
                                <span className="text-foreground font-medium">{formatCurrency(subtotal, locale)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Delivery ({location === "inside" ? "Dhaka" : "Outside Dhaka"})</span>
                                <span className={isFreeDelivery ? "text-green-500 font-bold" : "text-foreground font-medium"}>
                                    {isFreeDelivery ? "FREE" : formatCurrency(location === "inside" ? 60 : 100, locale)}
                                </span>
                            </div>
                            {isFreeDelivery && (
                                <p className="text-xs text-green-500 flex items-center gap-1">
                                    <Truck className="h-3 w-3" />
                                    Free delivery on 2+ pairs!
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {/* Buy Now - Primary */}
                            <Button
                                type="button"
                                onClick={handleBuyNow}
                                className="w-full text-lg font-bold py-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20"
                                disabled={buyingNow || addingToCart}
                            >
                                {buyingNow ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Buy Now
                                        <ArrowRight className="h-5 w-5" />
                                    </span>
                                )}
                            </Button>

                            {/* Add to Cart - Secondary */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddToCart}
                                className="w-full py-5 border-border hover:bg-muted transition-all duration-300"
                                disabled={addingToCart || buyingNow}
                            >
                                {addingToCart ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                                        Adding...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <ShoppingCart className="h-4 w-4" />
                                        Add to Cart
                                    </span>
                                )}
                            </Button>
                        </div>

                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Payment is Cash on Delivery. 7-day return policy.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
