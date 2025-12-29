
import { Product } from "@/lib/products";
import { Link } from "@/lib/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductRelatedProps {
    currentSlug: string;
    products: Product[];
}

export function ProductRelated({ currentSlug, products }: ProductRelatedProps) {
    // Filter out current product and take up to 3
    const relatedProducts = products
        .filter((p) => p.slug !== currentSlug)
        .slice(0, 3);

    if (relatedProducts.length === 0) return null;

    return (
        <section className="py-12 border-t">
            <h2 className="text-2xl font-bold mb-8 text-center">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((product) => (
                    <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        className="group block"
                    >
                        <Card className="h-full border-none shadow-none hover:shadow-lg transition-shadow duration-300">
                            <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {product.isOnSale && (
                                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                                        Sale
                                    </Badge>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                    {product.category}
                                </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-lg">
                                        {formatCurrency(product.price)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-sm text-gray-500 line-through">
                                            {formatCurrency(product.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
