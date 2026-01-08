import { notFound } from "next/navigation";
import { QuickOrderForm } from "@/components/product/QuickOrderForm";
import { PRODUCTS, Product as StaticProduct } from "@/lib/products";
import { getProductById, Product as DbProduct } from "@/lib/db/products";
import { TrackProductView } from "@/components/product/TrackProductView";

export async function generateStaticParams() {
    return PRODUCTS.map((product) => ({
        slug: product.slug,
    }));
}

// Adapter to convert DB Product to Static Product interface
function adaptDbProduct(dbProduct: DbProduct): StaticProduct {
    return {
        id: dbProduct.id,
        name: dbProduct.name_en, // Mapping name_en to name
        slug: dbProduct.id, // Use ID as slug for URL consistency if needed internal
        price: dbProduct.price,
        originalPrice: dbProduct.sale_price,
        category: dbProduct.category,
        description: dbProduct.description_en || "",
        image: dbProduct.images?.[0] || "",
        images: dbProduct.images || [],
        attributes: {
            size: "Regular", // Defaults
            gender: "Unisex",
            frameShape: "Standard",
            frameMaterial: "Standard",
            packaging: "Regular Packaging",
            origin: "Imported",
            colors: dbProduct.colors || []
        },
        availableColors: dbProduct.colors || [],
        availablePowers: (dbProduct.powers || []) as any[], // Cast to match PowerOption
        isNew: false,
        reviews: 0
    };
}

export default async function QuickOrderPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // 1. Try finding in Static PRODUCTS
    let product: StaticProduct | undefined = PRODUCTS.find((p) => p.slug === slug);

    // 2. If not found, try finding in DB by ID (slug might be an ID)
    if (!product) {
        const dbProduct = await getProductById(slug);
        if (dbProduct) {
            product = adaptDbProduct(dbProduct);
        }
    }

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black pt-4 pb-8 md:pt-6 md:pb-12">
            <TrackProductView product={product} />

            <div className="container max-w-2xl mx-auto px-4">
                {/* Simplified Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                    <p className="text-xl text-primary font-bold">মাত্র {product.price} টাকা</p>
                </div>

                <QuickOrderForm product={product} />

                {/* Technical Specification Section */}
                <div className="mt-8 border border-zinc-900 dark:border-zinc-100 rounded-lg p-6 bg-white dark:bg-zinc-900 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">টেকনিক্যাল স্পেসিফিকেশন</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                                <span className="text-zinc-700 dark:text-zinc-400">Type</span>
                                <span className="font-bold text-right text-zinc-900 dark:text-zinc-100">Luxury Rimless Anti Blue</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                                <span className="text-zinc-700 dark:text-zinc-400">Gender</span>
                                <span className="font-bold text-right text-zinc-900 dark:text-zinc-100">{product.attributes.gender}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                                <span className="text-zinc-700 dark:text-zinc-400">Frame Material</span>
                                <span className="font-bold text-right text-zinc-900 dark:text-zinc-100">{product.attributes.frameMaterial}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                                <span className="text-zinc-700 dark:text-zinc-400">Colors</span>
                                <span className="font-bold text-right text-zinc-900 dark:text-zinc-100">
                                    {product.availableColors.length > 0 ? product.availableColors.join(", ") : "Multi-color"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                                <span className="text-zinc-700 dark:text-zinc-400">Origin</span>
                                <span className="font-bold text-right text-zinc-900 dark:text-zinc-100">{product.attributes.origin}</span>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                                <span className="text-zinc-700 dark:text-zinc-400">Size</span>
                                <span className="font-bold text-right text-zinc-900 dark:text-zinc-100">{product.attributes.size} Size</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                                <span className="text-zinc-700 dark:text-zinc-400">Frame Shape</span>
                                <span className="font-bold text-right text-zinc-900 dark:text-zinc-100">{product.attributes.frameShape}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                                <span className="text-zinc-700 dark:text-zinc-400">Nose Pad Type</span>
                                <span className="font-bold text-right text-zinc-900 dark:text-zinc-100">Adjustable</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2 last:border-0 last:pb-0">
                                <span className="text-zinc-700 dark:text-zinc-400">Packaging</span>
                                <span className="font-bold text-right text-zinc-900 dark:text-zinc-100">{product.attributes.packaging}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>নিরাপদ পেমেন্ট এবং দ্রুত ডেলিভারি</p>
                </div>
            </div>
        </div>
    );
}
