import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getActivityLogs, clearOldActivityLogs } from '@/lib/db/activity-logs';

// GET - Get activity logs
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const entity_type = searchParams.get('entity_type') as any;
        const action = searchParams.get('action') || undefined;
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const startDate = searchParams.get('startDate') || undefined;
        const endDate = searchParams.get('endDate') || undefined;

        const { logs, total } = await getActivityLogs({
            entity_type,
            action,
            limit,
            offset,
            startDate,
            endDate,
        });

        return NextResponse.json({ logs, total });
    } catch (error) {
        console.error('Fetch activity logs error:', error);
        return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
    }
}

// DELETE - Clear old activity logs
export async function DELETE(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const daysOld = parseInt(searchParams.get('daysOld') || '90');

        const deleted = await clearOldActivityLogs(daysOld);

        return NextResponse.json({ success: true, deleted });
    } catch (error) {
        console.error('Clear activity logs error:', error);
        return NextResponse.json({ error: 'Failed to clear activity logs' }, { status: 500 });
    }
}
