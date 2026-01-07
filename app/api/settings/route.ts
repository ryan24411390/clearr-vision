import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSettings, updateSettings } from '@/lib/db/settings';

// GET - Get settings
export async function GET() {
    try {
        // Verify admin token from cookie
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings = await getSettings();
        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Fetch settings error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// PATCH - Update settings
export async function PATCH(request: NextRequest) {
    try {
        // Verify admin token from cookie
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const settings = await updateSettings(body);

        console.log('Settings updated');

        return NextResponse.json({ success: true, settings });
    } catch (error) {
        console.error('Update settings error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
