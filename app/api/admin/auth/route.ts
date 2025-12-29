import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST - Login
export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Simple password check against environment variable
        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        // Get the admin token
        const token = process.env.ADMIN_SECRET_TOKEN;
        if (!token) {
            console.error('ADMIN_SECRET_TOKEN not configured');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Set HTTP-only cookie for admin session (valid for 24 hours)
        const cookieStore = await cookies();
        cookieStore.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin auth error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}

// DELETE - Logout
export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('admin_token');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}

// GET - Check auth status
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        const isAuthenticated = token === process.env.ADMIN_SECRET_TOKEN;

        return NextResponse.json({ authenticated: isAuthenticated });
    } catch {
        return NextResponse.json({ authenticated: false });
    }
}
