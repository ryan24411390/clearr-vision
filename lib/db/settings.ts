import { getSupabaseAdmin } from '@/lib/supabase/admin';

export interface StoreSettings {
    store_name_en: string;
    store_name_bn: string;
    store_email: string;
    store_phone: string;
    store_address_en: string;
    store_address_bn: string;
    facebook_url?: string;
    instagram_url?: string;
    whatsapp_number?: string;
}

export interface DeliverySettings {
    inside_dhaka_charge: number;
    outside_dhaka_charge: number;
    free_delivery_threshold: number;
    delivery_areas: string[];
}

export interface PaymentSettings {
    cod_enabled: boolean;
    bkash_enabled: boolean;
    bkash_number?: string;
    nagad_enabled: boolean;
    nagad_number?: string;
    bank_transfer_enabled: boolean;
    bank_name?: string;
    bank_account_name?: string;
    bank_account_number?: string;
}

export interface NotificationSettings {
    order_notification_email: string;
    sms_notifications_enabled: boolean;
    email_notifications_enabled: boolean;
}

export interface Settings {
    id?: string;
    store: StoreSettings;
    delivery: DeliverySettings;
    payment: PaymentSettings;
    notifications: NotificationSettings;
    updated_at: string;
}

const DEFAULT_SETTINGS: Omit<Settings, 'id'> = {
    store: {
        store_name_en: 'Smart Reading',
        store_name_bn: 'স্মার্ট রিডিং',
        store_email: 'contact@smartreading.com',
        store_phone: '+880 1XXX-XXXXXX',
        store_address_en: 'Dhaka, Bangladesh',
        store_address_bn: 'ঢাকা, বাংলাদেশ',
        facebook_url: '',
        instagram_url: '',
        whatsapp_number: '',
    },
    delivery: {
        inside_dhaka_charge: 60,
        outside_dhaka_charge: 120,
        free_delivery_threshold: 0,
        delivery_areas: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Rangpur', 'Barisal', 'Mymensingh'],
    },
    payment: {
        cod_enabled: true,
        bkash_enabled: false,
        bkash_number: '',
        nagad_enabled: false,
        nagad_number: '',
        bank_transfer_enabled: false,
        bank_name: '',
        bank_account_name: '',
        bank_account_number: '',
    },
    notifications: {
        order_notification_email: '',
        sms_notifications_enabled: false,
        email_notifications_enabled: true,
    },
    updated_at: new Date().toISOString(),
};

// Get settings
export async function getSettings(): Promise<Settings> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();

    if (error || !data) {
        // Return defaults if no settings exist
        return DEFAULT_SETTINGS;
    }

    return {
        id: data.id,
        store: data.store || DEFAULT_SETTINGS.store,
        delivery: data.delivery || DEFAULT_SETTINGS.delivery,
        payment: data.payment || DEFAULT_SETTINGS.payment,
        notifications: data.notifications || DEFAULT_SETTINGS.notifications,
        updated_at: data.updated_at || new Date().toISOString(),
    };
}

// Update settings
export async function updateSettings(updates: Partial<{
    store: Partial<StoreSettings>;
    delivery: Partial<DeliverySettings>;
    payment: Partial<PaymentSettings>;
    notifications: Partial<NotificationSettings>;
}>): Promise<Settings> {
    const supabase = getSupabaseAdmin();
    const current = await getSettings();

    const updated = {
        store: { ...current.store, ...updates.store },
        delivery: { ...current.delivery, ...updates.delivery },
        payment: { ...current.payment, ...updates.payment },
        notifications: { ...current.notifications, ...updates.notifications },
        updated_at: new Date().toISOString(),
    };

    if (current.id) {
        // Update existing
        const { data, error } = await supabase
            .from('settings')
            .update(updated)
            .eq('id', current.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating settings:', error);
            throw new Error('Failed to update settings');
        }

        return data as Settings;
    } else {
        // Insert new
        const { data, error } = await supabase
            .from('settings')
            .insert(updated)
            .select()
            .single();

        if (error) {
            console.error('Error creating settings:', error);
            throw new Error('Failed to create settings');
        }

        return data as Settings;
    }
}
