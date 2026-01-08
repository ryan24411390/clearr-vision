import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createOrder, getOrders, OrderItem } from '@/lib/db/orders';
import { sendOrderNotificationEmail } from '@/lib/email/resend';

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

        // Create order using Supabase
        const order = await createOrder({
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
        });

        console.log('Order created:', order.order_number);

        // Send email notification to admin (non-blocking)
        sendOrderNotificationEmail({
            orderNumber: order.order_number,
            customerName: body.customer.name,
            customerPhone: body.customer.phone,
            customerAddress: body.customer.address,
            customerCity: body.customer.city || null,
            customerArea: body.customer.area || null,
            deliveryLocation: body.deliveryLocation || null,
            items: body.items,
            subtotal: body.subtotal,
            deliveryCharge: body.deliveryCharge,
            total: body.total,
            paymentMethod: body.paymentMethod || 'COD',
            createdAt: order.created_at || new Date().toISOString(),
        }).then((result) => {
            if (result.success) {
                console.log('Order notification email sent for:', order.order_number);
            } else {
                console.warn('Failed to send order notification email:', result.error);
            }
        }).catch((error) => {
            console.error('Email notification error:', error);
        });

        return NextResponse.json({
            success: true,
            orderNumber: order.order_number,
            orderId: order.id,
        });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create order. Please try again.' },
            { status: 500 }
        );
    }
}

// GET - List orders (admin only)
export async function GET(request: NextRequest) {
    try {
        // Verify admin token from cookie
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const { orders, total } = await getOrders({ status, limit, offset });

        return NextResponse.json({ orders, total });
    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
