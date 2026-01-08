import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductOrderForm } from "@/components/product/product-order-form";
import { ProductHero } from "@/components/product/product-hero";

import { MobileStickyBar } from "@/components/product/mobile-sticky-bar";
import { ProductRelated } from "@/components/product/product-related";
import { TrackProductView } from "@/components/product/TrackProductView";
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
            {/* Track product view for recently viewed feature */}
            <TrackProductView product={product} />

            {/* 1. Immersive Hero Section */}
            <ProductHero product={product} />

            <MobileStickyBar price={product.price} originalPrice={product.originalPrice} />

            <div className="container mx-auto px-4 py-16 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Deep Dive & Details */}
                    <div className="lg:col-span-7 space-y-16">

                        {/* A. Gallery for Detailed View */}
                        <div id="gallery" className="scroll-mt-24">
                            <h3 className="text-2xl font-bold mb-6">গ্যালারি</h3>
                            <ProductGallery images={product.images} />
                        </div>



                        <Separator />

                        {/* C. Specifications Table */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold">টেকনিক্যাল স্পেসিফিকেশন</h3>
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
                            <h3 className="text-xl font-bold">শিপিং ও রিটার্ন</h3>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <div className="flex gap-3">
                                    <Truck className="w-5 h-5 text-primary shrink-0" />
                                    <p><strong>ডেলিভারি:</strong> ঢাকায় ২-৩ দিনে, সারাদেশে ৩-৫ দিনে।</p>
                                </div>
                                <div className="flex gap-3">
                                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                                    <p><strong>ওয়ারেন্টি:</strong> মূল পণ্য উৎপাদকের ওয়ারেন্টি সহ।</p>
                                </div>
                                <div className="flex gap-3">
                                    <Check className="w-5 h-5 text-primary shrink-0" />
                                    <p><strong>রিটার্ন পলিসি:</strong> ত্রুটিপূর্ণ বা ভুল পণ্যে ৭ দিনে সহজ রিটার্ন।</p>
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
                                    <span>দ্রুত ডেলিভারি</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    <span>প্রিমিয়াম কোয়ালিটি</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>ক্যাশ অন ডেলিভারি</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>৭ দিনে রিটার্ন</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Order Form Section (Lives at bottom naturally or above related) */}
                    <div className="lg:hidden col-span-1" id="mobile-order-form">
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold mb-4">অর্ডার সম্পন্ন করুন</h3>
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
