import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductOrderForm } from "@/components/product/product-order-form";
import { ProductHero } from "@/components/product/product-hero";
import { ProductFeatures } from "@/components/product/product-features";
import { MobileStickyBar } from "@/components/product/mobile-sticky-bar";
import { ProductRelated } from "@/components/product/product-related";
import { PRODUCTS } from "@/lib/products";
import { Check, ShieldCheck, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// This is required for static export if enabled
export async function generateStaticParams() {
    return PRODUCTS.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = PRODUCTS.find((p) => p.slug === slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            {/* 1. Immersive Hero Section */}
            <ProductHero product={product} />

            <MobileStickyBar price={product.price} originalPrice={product.originalPrice} />

            <div className="container mx-auto px-4 py-16 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Deep Dive & Details */}
                    <div className="lg:col-span-7 space-y-16">

                        {/* A. Gallery for Detailed View */}
                        <div id="gallery" className="scroll-mt-24">
                            <h3 className="text-2xl font-bold mb-6">Gallery</h3>
                            <ProductGallery images={product.images} />
                        </div>

                        <Separator />

                        {/* B. Visual Features & Description */}
                        <ProductFeatures description={product.description} />

                        <Separator />

                        {/* C. Specifications Table */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold">Technical Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                {Object.entries(product.attributes).map(([key, value]) => {
                                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                                    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
                                    const displayValue = Array.isArray(value) ? value.join(", ") : value;

                                    return (
                                        <div key={key} className="flex justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                                            <span className="text-muted-foreground font-medium">{label}</span>
                                            <span className="font-semibold text-foreground text-right">{displayValue}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* D. Shipping Info (Visual) */}
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 space-y-6">
                            <h3 className="text-xl font-bold">Shipping & Returns</h3>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <div className="flex gap-3">
                                    <Truck className="w-5 h-5 text-primary shrink-0" />
                                    <p><strong>Analysis:</strong> 2-3 days delivery inside Dhaka, 3-5 days nationwide.</p>
                                </div>
                                <div className="flex gap-3">
                                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                                    <p><strong>Warranty:</strong> Authentic products with manufacturer warranty.</p>
                                </div>
                                <div className="flex gap-3">
                                    <Check className="w-5 h-5 text-primary shrink-0" />
                                    <p><strong>Return Policy:</strong> 7-day easy return policy if product is damaged or incorrect.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Order Form */}
                    <div className="lg:col-span-5 relative hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            <div id="order-form-container" className="scroll-mt-24">
                                <ProductOrderForm product={product} />
                            </div>

                            {/* Desktop Trust Badges below form */}
                            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground bg-muted/30 p-4 rounded-xl border border-border/50">
                                <div className="flex items-center gap-2">
                                    <Truck className="h-4 w-4 text-primary" />
                                    <span>Fast Delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    <span>Premium Quality</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Cash on Delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>7 Days Return</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Order Form Section (Lives at bottom naturally or above related) */}
                    <div className="lg:hidden col-span-1" id="mobile-order-form">
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold mb-4">Complete Your Order</h3>
                        </div>
                        <ProductOrderForm product={product} />
                    </div>

                </div>

                {/* Related Products Section */}
                <div className="mt-32">
                    <ProductRelated currentSlug={slug} products={PRODUCTS} />
                </div>
            </div>
        </div>
    );
}
