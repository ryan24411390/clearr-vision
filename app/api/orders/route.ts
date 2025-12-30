import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    variant?: {
        color?: string;
        power?: string;
    };
}

interface CreateOrderPayload {
    orderType: 'direct' | 'cart';
    customer: {
        name: string;
        phone: string;
        address: string;
        city?: string;
        area?: string;
    };
    deliveryLocation?: string;
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    total: number;
    paymentMethod?: string;
}

// POST - Create new order
export async function POST(request: NextRequest) {
    try {
        const body: CreateOrderPayload = await request.json();

        // Validate required fields
        if (!body.customer?.name || !body.customer?.phone || !body.customer?.address) {
            return NextResponse.json(
                { error: 'Missing required customer fields' },
                { status: 400 }
            );
        }

        if (!body.items || body.items.length === 0) {
            return NextResponse.json(
                { error: 'Order must have at least one item' },
                { status: 400 }
            );
        }

        // Insert order into Supabase
        const { data: order, error } = await supabaseAdmin
            .from('orders')
            .insert({
                order_type: body.orderType || 'direct',
                customer_name: body.customer.name,
                customer_phone: body.customer.phone,
                customer_address: body.customer.address,
                customer_city: body.customer.city || null,
                customer_area: body.customer.area || null,
                delivery_location: body.deliveryLocation || null,
                items: body.items,
                subtotal: body.subtotal,
                delivery_charge: body.deliveryCharge,
                total: body.total,
                payment_method: body.paymentMethod || 'COD',
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to create order' },
                { status: 500 }
            );
        }

        console.log('Order created:', order.order_number);

        return NextResponse.json({
            success: true,
            orderNumber: order.order_number,
            orderId: order.id,
        });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET - List orders (admin only)
export async function GET(request: NextRequest) {
    // Verify admin token from cookie
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;

    if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ orders: data, total: count });
}
