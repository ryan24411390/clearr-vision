import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

        // Send email notification (non-blocking)
        sendOrderNotificationEmail(order).catch(console.error);

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
    // Verify admin token from headers
    const authHeader = request.headers.get('x-admin-token');
    if (authHeader !== process.env.ADMIN_SECRET_TOKEN) {
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

async function sendOrderNotificationEmail(order: {
    order_number: string;
    order_type: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    customer_city?: string;
    customer_area?: string;
    delivery_location?: string;
    items: OrderItem[];
    subtotal: number;
    delivery_charge: number;
    total: number;
    payment_method: string;
}) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        console.warn('ADMIN_EMAIL not configured, skipping email notification');
        return;
    }

    const itemsList = order.items
        .map((item: OrderItem) =>
            `- ${item.name} x${item.quantity} (${item.variant?.color || 'N/A'}, ${item.variant?.power || 'N/A'}) - ৳${item.price * item.quantity}`
        )
        .join('\n');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
        await resend.emails.send({
            from: 'Clearr Vision Orders <onboarding@resend.dev>',
            to: [adminEmail],
            subject: `New Order: ${order.order_number}`,
            text: `
New order received!

Order Number: ${order.order_number}
Order Type: ${order.order_type}

Customer Details:
- Name: ${order.customer_name}
- Phone: ${order.customer_phone}
- Address: ${order.customer_address}
- City: ${order.customer_city || 'N/A'}
- Area: ${order.customer_area || 'N/A'}
- Delivery Location: ${order.delivery_location || 'N/A'}

Items:
${itemsList}

Subtotal: ৳${order.subtotal}
Delivery: ৳${order.delivery_charge}
Total: ৳${order.total}

Payment Method: ${order.payment_method}

---
View in admin: ${appUrl}/en/admin
            `.trim(),
        });
        console.log('Order notification email sent successfully');
    } catch (emailError) {
        console.error('Failed to send order notification email:', emailError);
    }
}
