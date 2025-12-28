"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Plus, Eye, Check } from "lucide-react";
import { useLocale } from "next-intl";
import { Product } from "@/lib/products";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const locale = useLocale();
    const router = useRouter();
    const toast = useToast();
    const addItem = useCartStore((state) => state.addItem);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [color, setColor] = useState<string>("");
    const [power, setPower] = useState<string>("");
    const [isAdding, setIsAdding] = useState(false);

    // Calculate integer discount percentage if applicable
    const discount = (product.originalPrice && product.price < product.originalPrice)
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDialogOpen(true);
    };

    const handleAddToCart = async () => {
        if (!color || !power) {
            toast.error("Please select color and power");
            return;
        }

        setIsAdding(true);

        const variantId = `${color}-${power}`;
        addItem({
            id: `${product.id}-${variantId}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            variant: {
                color,
                power,
            },
        });

        await new Promise(resolve => setTimeout(resolve, 300));

        toast.success("Added to cart!", {
            description: `${product.name} (${color}, ${power})`,
            action: {
                label: "Checkout",
                onClick: () => router.push("/checkout"),
            },
        });

        setIsAdding(false);
        setIsDialogOpen(false);
        setColor("");
        setPower("");
    };

    return (
        <>
            <div className="group relative">
                <Link href={`/shop/${product.slug}`}>
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 border-border bg-card flex flex-col">
                        <div className="relative aspect-square overflow-hidden bg-muted/20">
                            {discount > 0 && (
                                <Badge className="absolute left-2 top-2 z-10 bg-red-500 hover:bg-red-600">
                                    -{discount}%
                                </Badge>
                            )}
                            {product.isNew && !discount && (
                                <Badge className="absolute left-2 top-2 z-10 bg-primary">
                                    New
                                </Badge>
                            )}
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />

                            {/* Quick Add Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Button
                                    size="sm"
                                    onClick={handleQuickAdd}
                                    className="bg-white text-black hover:bg-white/90 gap-2 shadow-lg"
                                >
                                    <Plus className="h-4 w-4" />
                                    Quick Add
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-4 pt-4 flex-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                {product.category}
                            </p>
                            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
                                {product.name}
                            </h3>
                            <div className="mt-2 flex items-baseline gap-2">
                                {product.originalPrice ? (
                                    <>
                                        <span className="font-bold text-lg text-primary">
                                            {formatCurrency(product.price, locale)}
                                        </span>
                                        <span className="text-sm text-muted-foreground line-through">
                                            {formatCurrency(product.originalPrice, locale)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="font-bold text-lg">
                                        {formatCurrency(product.price, locale)}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 gap-2 border-border hover:bg-muted"
                                size="sm"
                            >
                                <Eye className="h-4 w-4" />
                                Details
                            </Button>
                            <Button
                                onClick={handleQuickAdd}
                                className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                                size="sm"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Add
                            </Button>
                        </CardFooter>
                    </Card>
                </Link>
            </div>

            {/* Quick Add Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Quick Add to Cart</DialogTitle>
                        <DialogDescription>
                            Select your options for {product.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-4 py-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground line-clamp-2">
                                {product.name}
                            </h4>
                            <p className="text-lg font-bold text-primary mt-1">
                                {formatCurrency(product.price, locale)}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="quick-color">Frame Color</Label>
                            <Select value={color} onValueChange={setColor}>
                                <SelectTrigger id="quick-color" className="bg-background border-border">
                                    <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                                <SelectContent>
                                    {product.availableColors.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quick-power">Lens Power</Label>
                            <Select value={power} onValueChange={setPower}>
                                <SelectTrigger id="quick-power" className="bg-background border-border">
                                    <SelectValue placeholder="Select power" />
                                </SelectTrigger>
                                <SelectContent>
                                    {product.availablePowers.map((p) => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="flex-1 border-border"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddToCart}
                            disabled={isAdding || !color || !power}
                            className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                        >
                            {isAdding ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4" />
                                    Add to Cart
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
