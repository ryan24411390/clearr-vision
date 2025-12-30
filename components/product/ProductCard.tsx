"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Eye } from "lucide-react";
import { useLocale } from "next-intl";
import { Product } from "@/lib/products";
import { QuickOrderModal } from "./QuickOrderModal";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const locale = useLocale();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculate integer discount percentage if applicable
    const discount = (product.originalPrice && product.price < product.originalPrice)
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsModalOpen(true);
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

                            {/* Buy Now Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Button
                                    size="sm"
                                    onClick={handleBuyNow}
                                    className="bg-white text-black hover:bg-white/90 gap-2 shadow-lg"
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    Buy Now
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
                                onClick={handleBuyNow}
                                className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                                size="sm"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Buy Now
                            </Button>
                        </CardFooter>
                    </Card>
                </Link>
            </div>

            {/* Quick Order Modal */}
            <QuickOrderModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
