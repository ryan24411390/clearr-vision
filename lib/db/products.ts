import { getSupabaseAdmin } from '@/lib/supabase/admin';

export interface Product {
    id: string;
    name_en: string;
    name_bn?: string;
    category: string;
    description_en?: string;
    description_bn?: string;
    price: number;
    sale_price?: number;
    stock: number;
    images: string[];
    colors?: string[];
    powers?: string[];
    is_active: boolean;
    featured?: boolean;
    created_at: string;
    updated_at: string;
}

// Create product
export async function createProduct(productData: {
    name_en: string;
    name_bn?: string;
    category: string;
    description_en?: string;
    description_bn?: string;
    price: number;
    sale_price?: number;
    stock: number;
    images?: string[];
    colors?: string[];
    powers?: string[];
    is_active?: boolean;
    featured?: boolean;
}): Promise<Product> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const product = {
        name_en: productData.name_en,
        name_bn: productData.name_bn,
        category: productData.category,
        description_en: productData.description_en,
        description_bn: productData.description_bn,
        price: productData.price,
        sale_price: productData.sale_price,
        stock: productData.stock,
        images: productData.images || [],
        colors: productData.colors || [],
        powers: productData.powers || [],
        is_active: productData.is_active ?? true,
        featured: productData.featured ?? false,
        created_at: now,
        updated_at: now,
    };

    const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

    if (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product');
    }

    return data as Product;
}

// Get products
export async function getProducts(options?: {
    status?: 'active' | 'inactive' | 'all';
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
}): Promise<{ products: Product[]; total: number }> {
    const supabase = getSupabaseAdmin();

    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    if (options?.status && options.status !== 'all') {
        query = query.eq('is_active', options.status === 'active');
    }

    if (options?.category) {
        query = query.eq('category', options.category);
    }

    if (options?.featured !== undefined) {
        query = query.eq('featured', options.featured);
    }

    if (options?.search) {
        query = query.or(`name_en.ilike.%${options.search}%,name_bn.ilike.%${options.search}%,category.ilike.%${options.search}%`);
    }

    if (options?.limit) {
        query = query.limit(options.limit);
    }

    if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 100) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return { products: [], total: 0 };
    }

    return { products: (data || []) as Product[], total: count || 0 };
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data as Product;
}

// Update product
export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product | null> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('products')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating product:', error);
        return null;
    }

    return data as Product;
}

// Delete product
export async function deleteProduct(id: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        return false;
    }

    return true;
}

// Get categories
export async function getCategories(): Promise<string[]> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    const categories = new Set(data?.map(p => p.category) || []);
    return Array.from(categories).sort();
}

// Bulk delete products
export async function bulkDeleteProducts(ids: string[]): Promise<number> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('products')
        .delete()
        .in('id', ids)
        .select();

    if (error) {
        console.error('Error bulk deleting products:', error);
        return 0;
    }

    return data?.length || 0;
}

// Duplicate product
export async function duplicateProduct(id: string): Promise<Product | null> {
    const supabase = getSupabaseAdmin();

    // Get the original product
    const original = await getProductById(id);
    if (!original) {
        return null;
    }

    const now = new Date().toISOString();

    // Create a copy with modified name
    const duplicate = {
        name_en: `${original.name_en} (Copy)`,
        name_bn: original.name_bn ? `${original.name_bn} (Copy)` : null,
        category: original.category,
        description_en: original.description_en,
        description_bn: original.description_bn,
        price: original.price,
        sale_price: original.sale_price,
        stock: original.stock,
        images: original.images,
        colors: original.colors,
        powers: original.powers,
        is_active: false, // Set as inactive by default
        featured: false,
        created_at: now,
        updated_at: now,
    };

    const { data, error } = await supabase
        .from('products')
        .insert(duplicate)
        .select()
        .single();

    if (error) {
        console.error('Error duplicating product:', error);
        return null;
    }

    return data as Product;
}

// Get low stock products
export async function getLowStockProducts(threshold: number = 5): Promise<Product[]> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .lte('stock', threshold)
        .eq('is_active', true)
        .order('stock', { ascending: true });

    if (error) {
        console.error('Error fetching low stock products:', error);
        return [];
    }

    return (data || []) as Product[];
}
