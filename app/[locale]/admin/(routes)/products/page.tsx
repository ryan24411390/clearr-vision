import { supabaseAdmin } from "@/lib/supabase/admin";
import { ProductsClient } from "@/components/admin/ProductsClient";

export const revalidate = 0;

export default async function ProductsPage() {
    const { data: products } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <ProductsClient products={products || []} />
    );
}
