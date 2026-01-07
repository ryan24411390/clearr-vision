import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { bulkDeleteProducts, duplicateProduct } from '@/lib/db/products';

// POST - Bulk operations on products
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { action, ids, id } = body;

        if (action === 'delete') {
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return NextResponse.json({ error: 'No product IDs provided' }, { status: 400 });
            }

            const deleted = await bulkDeleteProducts(ids);
            console.log('Bulk deleted products:', deleted);

            return NextResponse.json({ success: true, deleted });
        }

        if (action === 'duplicate') {
            if (!id) {
                return NextResponse.json({ error: 'No product ID provided' }, { status: 400 });
            }

            const newProduct = await duplicateProduct(id);

            if (!newProduct) {
                return NextResponse.json({ error: 'Failed to duplicate product' }, { status: 500 });
            }

            console.log('Product duplicated:', newProduct.id, newProduct.name_en);

            return NextResponse.json({ success: true, product: newProduct });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Bulk operation error:', error);
        return NextResponse.json({ error: 'Failed to perform bulk operation' }, { status: 500 });
    }
}
