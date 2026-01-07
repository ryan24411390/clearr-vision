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
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 md:py-12">
            <TrackProductView product={product} />

            <div className="container max-w-2xl mx-auto px-4">
                {/* Simplified Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                    <p className="text-xl text-primary font-bold">মাত্র {product.price} টাকা</p>
                </div>

                <QuickOrderForm product={product} />

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>নিরাপদ পেমেন্ট এবং দ্রুত ডেলিভারি</p>
                </div>
            </div>
        </div>
    );
}
