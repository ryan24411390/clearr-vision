import { getSupabaseAdmin } from '@/lib/supabase/admin';

export interface ActivityLog {
    id: string;
    action: string;
    entity_type: 'order' | 'product' | 'customer' | 'settings' | 'auth';
    entity_id?: string;
    details?: string;
    user_agent?: string;
    ip_address?: string;
    created_at: string;
}

export type ActivityAction =
    | 'login'
    | 'logout'
    | 'order_created'
    | 'order_updated'
    | 'order_deleted'
    | 'order_bulk_updated'
    | 'product_created'
    | 'product_updated'
    | 'product_deleted'
    | 'product_duplicated'
    | 'product_bulk_deleted'
    | 'customer_note_added'
    | 'customer_note_deleted'
    | 'settings_updated'
    | 'password_changed';

// Log an activity
export async function logActivity(data: {
    action: ActivityAction;
    entity_type: ActivityLog['entity_type'];
    entity_id?: string;
    details?: string;
    user_agent?: string;
    ip_address?: string;
}): Promise<ActivityLog | null> {
    const supabase = getSupabaseAdmin();

    const log = {
        action: data.action,
        entity_type: data.entity_type,
        entity_id: data.entity_id || null,
        details: data.details || null,
        user_agent: data.user_agent || null,
        ip_address: data.ip_address || null,
        created_at: new Date().toISOString(),
    };

    const { data: insertedLog, error } = await supabase
        .from('activity_logs')
        .insert(log)
        .select()
        .single();

    if (error) {
        // Table might not exist yet, log error but don't crash
        console.error('Error logging activity:', error);
        return null;
    }

    return insertedLog as ActivityLog;
}

// Get activity logs
export async function getActivityLogs(options?: {
    entity_type?: ActivityLog['entity_type'];
    entity_id?: string;
    action?: string;
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
}): Promise<{ logs: ActivityLog[]; total: number }> {
    const supabase = getSupabaseAdmin();

    let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    if (options?.entity_type) {
        query = query.eq('entity_type', options.entity_type);
    }

    if (options?.entity_id) {
        query = query.eq('entity_id', options.entity_id);
    }

    if (options?.action) {
        query = query.eq('action', options.action);
    }

    if (options?.startDate) {
        query = query.gte('created_at', options.startDate);
    }

    if (options?.endDate) {
        query = query.lte('created_at', options.endDate);
    }

    if (options?.limit) {
        query = query.limit(options.limit);
    }

    if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching activity logs:', error);
        return { logs: [], total: 0 };
    }

    return { logs: (data || []) as ActivityLog[], total: count || 0 };
}

// Get recent activity for dashboard
export async function getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
    const { logs } = await getActivityLogs({ limit });
    return logs;
}

// Clear old activity logs (older than specified days)
export async function clearOldActivityLogs(daysOld: number = 90): Promise<number> {
    const supabase = getSupabaseAdmin();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { data, error } = await supabase
        .from('activity_logs')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .select();

    if (error) {
        console.error('Error clearing old activity logs:', error);
        return 0;
    }

    return data?.length || 0;
}
