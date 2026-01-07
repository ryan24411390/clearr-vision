import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db/products';

// GET - Get single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await getProductById(id);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Fetch product error:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

// PATCH - Update product (admin only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify admin token from cookie
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Validate price if provided
        if (body.price !== undefined && (typeof body.price !== 'number' || body.price < 0)) {
            return NextResponse.json(
                { error: 'Price must be a positive number' },
                { status: 400 }
            );
        }

        // Validate stock if provided
        if (body.stock !== undefined && (typeof body.stock !== 'number' || body.stock < 0)) {
            return NextResponse.json(
                { error: 'Stock must be a non-negative number' },
                { status: 400 }
            );
        }

        const product = await updateProduct(id, {
            name_en: body.name_en,
            name_bn: body.name_bn,
            category: body.category,
            description_en: body.description_en,
            description_bn: body.description_bn,
            price: body.price,
            sale_price: body.sale_price,
            stock: body.stock,
            images: body.images,
            colors: body.colors,
            powers: body.powers,
            is_active: body.is_active,
            featured: body.featured,
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        console.log('Product updated:', product.id, product.name_en);

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE - Delete product (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify admin token from cookie
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const deleted = await deleteProduct(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        console.log('Product deleted:', id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
