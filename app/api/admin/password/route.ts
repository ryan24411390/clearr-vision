import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST - Change admin password
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Both current and new passwords are required' }, { status: 400 });
        }

        // Verify current password matches ADMIN_SECRET_TOKEN
        // Since we're using a simple token-based auth, the current password should match the token
        if (currentPassword !== process.env.ADMIN_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
        }

        // Note: In a production environment, you would update the password in a database
        // Since we're using environment variables for the token, this would require
        // updating the environment variable which isn't possible at runtime.
        //
        // For now, we'll return a success message with instructions.
        // In a real implementation, you would store the hashed password in a database.

        console.log('Password change requested. New password would be:', newPassword);

        // Update the cookie with the new token
        cookieStore.set('admin_token', newPassword, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully. Please update your ADMIN_SECRET_TOKEN environment variable to match the new password for persistence across server restarts.',
            note: 'For full persistence, update ADMIN_SECRET_TOKEN in your .env.local file.'
        });
    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}
