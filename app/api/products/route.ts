import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createProduct, getProducts } from '@/lib/db/products';

// GET - List products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as 'active' | 'inactive' | 'all' | undefined;
        const category = searchParams.get('category') || undefined;
        const featured = searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined;
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');
        const search = searchParams.get('search') || undefined;

        const { products, total } = await getProducts({ status, category, featured, limit, offset, search });

        return NextResponse.json({ products, total });
    } catch (error) {
        console.error('Fetch products error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST - Create new product (admin only)
export async function POST(request: NextRequest) {
    try {
        // Verify admin token from cookie
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate required fields
        if (!body.name_en || !body.category || body.price === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: name_en, category, price' },
                { status: 400 }
            );
        }

        // Validate price is a positive number
        if (typeof body.price !== 'number' || body.price < 0) {
            return NextResponse.json(
                { error: 'Price must be a positive number' },
                { status: 400 }
            );
        }

        // Validate stock is a non-negative number
        if (body.stock !== undefined && (typeof body.stock !== 'number' || body.stock < 0)) {
            return NextResponse.json(
                { error: 'Stock must be a non-negative number' },
                { status: 400 }
            );
        }

        const product = await createProduct({
            name_en: body.name_en,
            name_bn: body.name_bn,
            category: body.category,
            description_en: body.description_en,
            description_bn: body.description_bn,
            price: body.price,
            sale_price: body.sale_price,
            stock: body.stock ?? 0,
            images: body.images || [],
            colors: body.colors || [],
            powers: body.powers || [],
            is_active: body.is_active ?? true,
            featured: body.featured ?? false,
        });

        console.log('Product created:', product.id, product.name_en);

        return NextResponse.json({
            success: true,
            product,
        });
    } catch (error) {
        console.error('Product creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create product. Please try again.' },
            { status: 500 }
        );
    }
}
