"use client";

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { ProductCard } from "@/components/product/ProductCard";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumbs"
import { Link } from "@/lib/navigation";
import { PRODUCTS } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Glasses, Sun, Monitor, Sparkles, LayoutGrid } from "lucide-react";

// Category configuration with translation keys
const CATEGORIES = [
    { id: "all", labelKey: "allProducts", icon: LayoutGrid },
    { id: "reading", labelKey: "readingGlasses", icon: Glasses },
    { id: "sunglasses", labelKey: "sunglasses", icon: Sun },
    { id: "blue-cut", labelKey: "blueLight", icon: Monitor },
    { id: "premium", labelKey: "premium", icon: Sparkles },
] as const;

// Map URL category params to product categories
function matchCategory(productCategory: string, filterCategory: string): boolean {
    const categoryLower = productCategory.toLowerCase();

    switch (filterCategory) {
        case "all":
            return true;
        case "reading":
            return categoryLower.includes("reading");
        case "sunglasses":
            return categoryLower.includes("sunglasses") || categoryLower.includes("sun");
        case "blue-cut":
            return categoryLower.includes("blue") || categoryLower.includes("anti blue");
        case "premium":
            return categoryLower.includes("premium") || categoryLower.includes("luxury");
        default:
            return true;
    }
}

export default function ShopPage() {
    const t = useTranslations('Shop');
    const searchParams = useSearchParams();

    const activeCategory = searchParams.get('category') || 'all';

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'all') {
            return PRODUCTS;
        }
        return PRODUCTS.filter(product => matchCategory(product.category, activeCategory));
    }, [activeCategory]);

    const activeCategory_ = CATEGORIES.find(c => c.id === activeCategory);
    const activeCategoryLabel = activeCategory_ ? t(activeCategory_.labelKey) : t('allProducts');

    return (
        <div className="container px-4 py-8 md:px-6 lg:py-12">
            <div className="mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">{t('home')}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{t('shop')}</BreadcrumbPage>
                        </BreadcrumbItem>
                        {activeCategory !== 'all' && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{activeCategoryLabel}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </>
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex flex-col mb-8 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight">
                    {activeCategory === 'all' ? t('title') : activeCategoryLabel}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {t('description')}
                </p>
            </div>

            {/* Category Filters */}
            <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                    {CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        const isActive = activeCategory === category.id;

                        return (
                            <Link
                                key={category.id}
                                href={category.id === 'all' ? '/shop' : `/shop?category=${category.id}`}
                            >
                                <Button
                                    variant={isActive ? "default" : "outline"}
                                    size="sm"
                                    className={cn(
                                        "gap-2 rounded-full transition-all",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "border-border hover:bg-muted hover:border-primary/50"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {t(category.labelKey)}
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Results count */}
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                    {t('showingResults', { count: filteredProducts.length })}
                </p>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Glasses className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t('noProducts')}</h3>
                    <p className="text-muted-foreground mb-4">
                        {t('noProductsDesc')}
                    </p>
                    <Link href="/shop">
                        <Button variant="outline">{t('viewAll')}</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
