import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductOrderForm } from "@/components/product/product-order-form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Check, ShieldCheck, Truck } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { useLocale } from "next-intl";
import { getFormatter } from "next-intl/server";

// This is required for static export if enabled, but good for performance anyway
export async function generateStaticParams() {
    return PRODUCTS.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const locale = "en"; // Defaulting since we are inside a server component without easy hook access to params locale here without awaiting props properly, but locale is in params too if needed. 
    // Actually we can get locale from params in layout or just use a helper. 
    // For now, formatCurrency handles locale if passed, I'll assume 'en' or pass it through if I extract it.

    const product = PRODUCTS.find((p) => p.slug === slug);

    if (!product) {
        notFound();
    }

    const discount = (product.originalPrice && product.price < product.originalPrice)
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="container px-4 py-8 md:px-6 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Left: Gallery (Mobile: Top) */}
                <div className="space-y-6">
                    {/* We wrap the single image in an array if ProductGallery expects array */}
                    <ProductGallery images={[product.image]} />

                    {/* Attributes Table (Desktop: Under Gallery, Mobile: Under Form? Usually under gallery is fine) */}
                    <div className="bg-muted/10 p-6 rounded-lg border">
                        <h3 className="font-semibold mb-4 text-lg border-b pb-2">Specifications</h3>
                        <div className="space-y-3 text-sm">
                            {Object.entries(product.attributes).map(([key, value]) => {
                                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                                // Format key camelCase to Title Case
                                const label = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
                                const displayValue = Array.isArray(value) ? value.join(", ") : value;

                                return (
                                    <div key={key} className="grid grid-cols-2 gap-4 py-1">
                                        <span className="text-muted-foreground font-medium">{label}</span>
                                        <span className="font-semibold">{displayValue}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Info & Order Form */}
                <div className="flex flex-col gap-6">
                    <div>
                        {discount > 0 && (
                            <Badge className="bg-red-500 hover:bg-red-600 mb-2 text-base px-3 py-1">
                                Save {discount}%
                            </Badge>
                        )}
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-2">
                            {product.name}
                        </h1>
                        <div className="flex items-end gap-3 mb-4">
                            <span className="text-3xl font-bold text-primary">
                                {/* We can't use hook in server component, but we can standardise formatting */}
                                ৳{product.price}
                            </span>
                            {product.originalPrice && (
                                <span className="text-xl text-gray-500 line-through mb-1">
                                    ৳{product.originalPrice}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description / Key Features */}
                    <div className="prose prose-sm max-w-none text-gray-600 bg-blue-50/50 p-4 rounded-lg border-blue-100 border">
                        <p className="whitespace-pre-line font-medium">{product.description}</p>
                    </div>

                    {/* Order Current Product */}
                    <ProductOrderForm product={product} />

                    <Separator className="my-2" />

                    {/* Trust Signals */}
                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Truck className="h-5 w-5 text-primary" />
                            <span>Whole BD Delivery</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <span>Premium Quality</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Cash on Delivery</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Check className="h-5 w-5 text-primary" />
                            <span>7-Day Return</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
