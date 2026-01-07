"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useMemo, Suspense } from 'react';
import { ProductCard } from "@/components/product/ProductCard";
import { RecentlyViewed } from "@/components/sections/recently-viewed";
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
import { Glasses, Sun, Monitor, Sparkles, LayoutGrid, Loader2 } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

// ... existing imports ...

// Category configuration with labels
const CATEGORIES = [
    { id: "all", label: "সব প্রোডাক্ট", icon: LayoutGrid },
    { id: "reading", label: "রিডিং গ্লাস", icon: Glasses },
    { id: "sunglasses", label: "সানগ্লাস", icon: Sun },
    { id: "blue-cut", label: "ব্লু লাইট", icon: Monitor },
    { id: "premium", label: "প্রিমিয়াম", icon: Sparkles },
] as const;

type SortOption = "relevance" | "price-asc" | "price-desc" | "newest";

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

function ShopContent() {
    const searchParams = useSearchParams();
    const [sortBy, setSortBy] = useState<SortOption>("relevance");

    const activeCategory = searchParams.get('category') || 'all';

    const filteredProducts = useMemo(() => {
        let products = activeCategory === 'all'
            ? [...PRODUCTS]
            : PRODUCTS.filter(product => matchCategory(product.category, activeCategory));

        // Apply Sorting
        switch (sortBy) {
            case "price-asc":
                products.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                products.sort((a, b) => b.price - a.price);
                break;
            case "newest":
                products.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
                break;
            default:
                // Relevance/Default - could be by ID or original order
                break;
        }

        return products;
    }, [activeCategory, sortBy]);

    const activeCategory_ = CATEGORIES.find(c => c.id === activeCategory);
    const activeCategoryLabel = activeCategory_?.label || "সব প্রোডাক্ট";

    return (
        <>
            <div className="mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">হোম</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>শপ</BreadcrumbPage>
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
                    {activeCategory === 'all' ? "সব চশমা" : activeCategoryLabel}
                </h1>
                <p className="text-muted-foreground mt-2">
                    আপনার চেহারা, স্টাইল ও বাজেটের সাথে মানানসই ফ্রেম খুঁজুন।
                </p>
            </div>

            {/* Controls: Category Filters & Sort */}
            <div className="mb-8 flex flex-col items-center gap-6">
                {/* Category Pills */}
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
                                    {category.label}
                                </Button>
                            </Link>
                        );
                    })}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                        <SelectTrigger className="w-[180px] bg-background">
                            <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="সাজান" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="relevance">জনপ্রিয়</SelectItem>
                            <SelectItem value="newest">নতুন কালেকশন</SelectItem>
                            <SelectItem value="price-asc">দাম (কম থেকে বেশি)</SelectItem>
                            <SelectItem value="price-desc">দাম (বেশি থেকে কম)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Results count */}
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                    {filteredProducts.length} টি স্টাইল
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
                    <h3 className="text-lg font-semibold mb-2">কোনো প্রোডাক্ট পাওয়া যায়নি</h3>
                    <p className="text-muted-foreground mb-4">
                        এই ক্যাটাগরিতে এখন কোনো প্রোডাক্ট নেই।
                    </p>
                    <Link href="/shop">
                        <Button variant="outline">সব প্রোডাক্ট দেখুন</Button>
                    </Link>
                </div>
            )}

            {/* Recently Viewed Products */}
            <RecentlyViewed />
        </>
    );
}

function ShopLoading() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}

export default function ShopPage() {
    return (
        <div className="container px-4 py-8 md:px-6 lg:py-12">
            <Suspense fallback={<ShopLoading />}>
                <ShopContent />
            </Suspense>
        </div>
    );
}
