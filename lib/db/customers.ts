import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getOrdersByCustomer, Order } from './orders';

export interface CustomerNote {
    id: string;
    customer_phone: string;
    note: string;
    created_by: string;
    created_at: string;
}

export interface Customer {
    phone: string;
    name: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    firstOrderDate: string;
    addresses: string[];
    notes?: CustomerNote[];
    orders?: Order[];
}

// Get customer by phone (derived from orders)
export async function getCustomerByPhone(phone: string): Promise<Customer | null> {
    const orders = await getOrdersByCustomer(phone);

    if (orders.length === 0) {
        return null;
    }

    const addresses = new Set<string>();
    let totalSpent = 0;
    let firstOrderDate = orders[0].created_at;
    let lastOrderDate = orders[0].created_at;
    let customerName = orders[0].customer_name;

    orders.forEach(order => {
        totalSpent += order.total || 0;
        if (order.customer_address) {
            addresses.add(order.customer_address);
        }
        if (new Date(order.created_at) < new Date(firstOrderDate)) {
            firstOrderDate = order.created_at;
        }
        if (new Date(order.created_at) > new Date(lastOrderDate)) {
            lastOrderDate = order.created_at;
            customerName = order.customer_name; // Use the most recent name
        }
    });

    // Get notes for this customer
    const notes = await getCustomerNotes(phone);

    return {
        phone,
        name: customerName,
        totalOrders: orders.length,
        totalSpent,
        lastOrderDate,
        firstOrderDate,
        addresses: Array.from(addresses),
        notes,
        orders,
    };
}

// Get customer notes
export async function getCustomerNotes(phone: string): Promise<CustomerNote[]> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('customer_notes')
        .select('*')
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false });

    if (error) {
        // Table might not exist yet, return empty array
        console.error('Error fetching customer notes:', error);
        return [];
    }

    return (data || []) as CustomerNote[];
}

// Add customer note
export async function addCustomerNote(phone: string, note: string, createdBy: string = 'Admin'): Promise<CustomerNote | null> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('customer_notes')
        .insert({
            customer_phone: phone,
            note,
            created_by: createdBy,
            created_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding customer note:', error);
        return null;
    }

    return data as CustomerNote;
}

// Delete customer note
export async function deleteCustomerNote(noteId: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
        .from('customer_notes')
        .delete()
        .eq('id', noteId);

    if (error) {
        console.error('Error deleting customer note:', error);
        return false;
    }

    return true;
}

// Get all customers (derived from orders)
export async function getAllCustomers(): Promise<Customer[]> {
    const supabase = getSupabaseAdmin();

    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    const customersMap = new Map<string, Customer>();

    (orders || []).forEach((order: Order) => {
        const phone = order.customer_phone;
        if (!phone) return;

        if (!customersMap.has(phone)) {
            customersMap.set(phone, {
                phone,
                name: order.customer_name || 'Guest',
                totalOrders: 0,
                totalSpent: 0,
                lastOrderDate: order.created_at,
                firstOrderDate: order.created_at,
                addresses: [],
            });
        }

        const customer = customersMap.get(phone)!;
        customer.totalOrders += 1;
        customer.totalSpent += (order.total || 0);

        if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
            customer.lastOrderDate = order.created_at;
            customer.name = order.customer_name || customer.name;
        }
        if (new Date(order.created_at) < new Date(customer.firstOrderDate)) {
            customer.firstOrderDate = order.created_at;
        }

        if (order.customer_address && !customer.addresses.includes(order.customer_address)) {
            customer.addresses.push(order.customer_address);
        }
    });

    return Array.from(customersMap.values())
        .sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime());
}
