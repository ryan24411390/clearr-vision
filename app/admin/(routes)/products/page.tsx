import { getProducts } from "@/lib/db/products";
import { ProductsClient } from "@/components/admin/ProductsClient";

export const revalidate = 0;

export default async function ProductsPage() {
    const { products } = await getProducts({ limit: 500 });

    return (
        <ProductsClient products={products} />
    );
}
