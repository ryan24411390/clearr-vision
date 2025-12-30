"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed";
import { Product } from "@/lib/products";

interface TrackProductViewProps {
    product: Product;
}

export function TrackProductView({ product }: TrackProductViewProps) {
    const addProduct = useRecentlyViewedStore(state => state.addProduct);

    useEffect(() => {
        // Track the product view
        addProduct({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category,
        });
    }, [product.id, product.name, product.slug, product.price, product.originalPrice, product.image, product.category, addProduct]);

    // This component doesn't render anything
    return null;
}
