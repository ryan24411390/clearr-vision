import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addCustomerNote, deleteCustomerNote, getCustomerNotes } from '@/lib/db/customers';

// GET - Get customer notes
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ phone: string }> }
) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { phone } = await params;
        const decodedPhone = decodeURIComponent(phone);
        const notes = await getCustomerNotes(decodedPhone);

        return NextResponse.json({ notes });
    } catch (error) {
        console.error('Fetch notes error:', error);
        return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
}

// POST - Add customer note
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ phone: string }> }
) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { phone } = await params;
        const decodedPhone = decodeURIComponent(phone);
        const body = await request.json();

        if (!body.note || typeof body.note !== 'string' || body.note.trim() === '') {
            return NextResponse.json({ error: 'Note is required' }, { status: 400 });
        }

        const note = await addCustomerNote(decodedPhone, body.note.trim(), body.createdBy || 'Admin');

        if (!note) {
            return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
        }

        return NextResponse.json({ success: true, note });
    } catch (error) {
        console.error('Add note error:', error);
        return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
    }
}

// DELETE - Delete customer note
export async function DELETE(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const noteId = searchParams.get('noteId');

        if (!noteId) {
            return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
        }

        const success = await deleteCustomerNote(noteId);

        if (!success) {
            return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete note error:', error);
        return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
    }
}
