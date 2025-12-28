"use client";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/lib/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
    const { items, getCartTotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Avoid hydration mismatch

    if (items.length === 0) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-muted-foreground mb-8">
                    Add some items to your cart to proceed with checkout.
                </p>
                <Button asChild>
                    <Link href="/shop">Browse Products</Link>
                </Button>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const deliveryFee = 60; // Fixed for now
    const total = subtotal + deliveryFee;

    return (
        <div className="container px-4 py-8 md:px-6 lg:py-12 max-w-6xl">
            <div className="mb-6">
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back to Shop
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Column: Form */}
                <div className="lg:col-span-7">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold mb-2">Checkout</h1>
                        <p className="text-muted-foreground">Complete your order details below.</p>
                    </div>
                    <div className="border rounded-lg p-6 bg-card">
                        <h2 className="text-lg font-semibold mb-6">Shipping Information</h2>
                        <CheckoutForm />
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-muted/30 rounded-lg p-6 border sticky top-20">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-4 mb-4 max-h-[300px] overflow-auto pr-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-16 w-16 rounded overflow-hidden bg-background border flex-shrink-0">
                                        <Image
                                            src={item.image || "/images/placeholder.jpg"}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <p className="font-medium">{item.name}</p>
                                        {item.variant && (
                                            <p className="text-muted-foreground text-xs mt-1">
                                                {item.variant.color}, {item.variant.power}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-sm font-medium">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery</span>
                                <span>{formatPrice(deliveryFee)}</span>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>

                        <div className="mt-6 p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
                            <p className="font-semibold mb-1">Cash on Delivery</p>
                            Pay with cash when your package arrives.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
