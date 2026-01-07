import { getSupabaseAdmin } from '@/lib/supabase/admin';

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    variant?: {
        color?: string;
        power?: string;
    };
}

export interface Order {
    id: string;
    order_number: string;
    order_type: 'direct' | 'cart';
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string | null;
    customer_area: string | null;
    delivery_location: string | null;
    items: OrderItem[];
    subtotal: number;
    delivery_charge: number;
    total: number;
    payment_method: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    notes: string | null;
    created_at: string;
    updated_at: string;
}

// Generate order number
function generateOrderNumber(): string {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CV-${dateStr}-${random}`;
}

// Create order
export async function createOrder(orderData: {
    order_type: 'direct' | 'cart';
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    customer_city?: string | null;
    customer_area?: string | null;
    delivery_location?: string | null;
    items: OrderItem[];
    subtotal: number;
    delivery_charge: number;
    total: number;
    payment_method?: string;
}): Promise<Order> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const order = {
        order_number: generateOrderNumber(),
        order_type: orderData.order_type,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address,
        customer_city: orderData.customer_city || null,
        customer_area: orderData.customer_area || null,
        delivery_location: orderData.delivery_location || null,
        items: orderData.items,
        subtotal: orderData.subtotal,
        delivery_charge: orderData.delivery_charge,
        total: orderData.total,
        payment_method: orderData.payment_method || 'COD',
        status: 'pending' as const,
        notes: null,
        created_at: now,
        updated_at: now,
    };

    const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single();

    if (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
    }

    return data as Order;
}

// Get orders
export async function getOrders(options?: {
    status?: string;
    limit?: number;
    offset?: number;
}): Promise<{ orders: Order[]; total: number }> {
    const supabase = getSupabaseAdmin();

    let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    if (options?.status && options.status !== 'all') {
        query = query.eq('status', options.status);
    }

    if (options?.limit) {
        query = query.limit(options.limit);
    }

    if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching orders:', error);
        return { orders: [], total: 0 };
    }

    return { orders: (data || []) as Order[], total: count || 0 };
}

// Get order by ID
export async function getOrderById(id: string): Promise<Order | null> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching order:', error);
        return null;
    }

    return data as Order;
}

// Update order
export async function updateOrder(id: string, updates: {
    status?: Order['status'];
    notes?: string | null;
}): Promise<Order | null> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('orders')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating order:', error);
        return null;
    }

    return data as Order;
}

// Delete order
export async function deleteOrder(id: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting order:', error);
        return false;
    }

    return true;
}

// Bulk update orders
export async function bulkUpdateOrders(ids: string[], status: Order['status']): Promise<number> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('orders')
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .in('id', ids)
        .select();

    if (error) {
        console.error('Error bulk updating orders:', error);
        return 0;
    }

    return data?.length || 0;
}

// Get orders by customer phone
export async function getOrdersByCustomer(phone: string): Promise<Order[]> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching customer orders:', error);
        return [];
    }

    return (data || []) as Order[];
}
