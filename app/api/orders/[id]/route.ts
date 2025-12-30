import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET single order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;

    if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(data);
}

// PATCH update order status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;

    if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const allowedUpdates = ['status', 'notes'];
    const updates: Record<string, string> = {};

    for (const key of allowedUpdates) {
        if (body[key] !== undefined) {
            updates[key] = body[key];
        }
    }

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Update order error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json(data);
}
