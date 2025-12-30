"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed";
import { formatCurrency } from "@/lib/utils";
import { useLocale } from "next-intl";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RecentlyViewed() {
    const locale = useLocale();
    const products = useRecentlyViewedStore(state => state.products);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render anything until client-side hydration is complete
    if (!mounted) return null;

    // Don't show if no recently viewed products
    if (products.length === 0) return null;

    // Show max 4 products
    const recentProducts = products.slice(0, 4);

    return (
        <section className="py-12 md:py-16">
            <div className="container px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold">Recently Viewed</h2>
                            <p className="text-sm text-muted-foreground">Continue where you left off</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                        <Link href="/shop" className="gap-2">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {recentProducts.map((product) => (
                        <Link key={product.id} href={`/shop/${product.slug}`}>
                            <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 border-border bg-card">
                                <div className="relative aspect-square overflow-hidden bg-muted/20">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                </div>
                                <CardContent className="p-3 md:p-4">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                        {product.category}
                                    </p>
                                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
                                        {product.name}
                                    </h3>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="font-bold text-primary">
                                            {formatCurrency(product.price, locale)}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-xs text-muted-foreground line-through">
                                                {formatCurrency(product.originalPrice, locale)}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-6 sm:hidden">
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/shop" className="gap-2">
                            View All Products <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
