import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { bulkUpdateOrders, Order } from '@/lib/db/orders';

// POST - Bulk update orders
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { ids, status } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No order IDs provided' }, { status: 400 });
        }

        if (!status) {
            return NextResponse.json({ error: 'No status provided' }, { status: 400 });
        }

        const validStatuses: Order['status'][] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updated = await bulkUpdateOrders(ids, status);

        return NextResponse.json({ success: true, updated });
    } catch (error) {
        console.error('Bulk update error:', error);
        return NextResponse.json({ error: 'Failed to update orders' }, { status: 500 });
    }
}
