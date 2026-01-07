import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayesovtarkiuzkbxppdb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZXNvdnRhcmtpdXprYnhwcGRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjY0MDQ3NiwiZXhwIjoyMDgyMjE2NDc2fQ.vlmhGQjTO49SwFveDE0x5CVPL4ohn7KMbMO3q6XI7j0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
    console.log('Setting up database tables...\n');

    // Create orders table
    const { error: ordersError } = await supabase.rpc('exec_sql', {
        sql: `
            CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                order_number TEXT UNIQUE NOT NULL,
                order_type TEXT NOT NULL DEFAULT 'direct',
                customer_name TEXT NOT NULL,
                customer_phone TEXT NOT NULL,
                customer_address TEXT NOT NULL,
                customer_city TEXT,
                customer_area TEXT,
                delivery_location TEXT,
                items JSONB NOT NULL DEFAULT '[]',
                subtotal NUMERIC NOT NULL DEFAULT 0,
                delivery_charge NUMERIC NOT NULL DEFAULT 0,
                total NUMERIC NOT NULL DEFAULT 0,
                payment_method TEXT DEFAULT 'COD',
                status TEXT DEFAULT 'pending',
                notes TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `
    });

    if (ordersError) {
        console.log('Orders table - trying direct insert test...');
    } else {
        console.log('✓ Orders table created');
    }

    // Create products table
    const { error: productsError } = await supabase.rpc('exec_sql', {
        sql: `
            CREATE TABLE IF NOT EXISTS products (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name_en TEXT NOT NULL,
                name_bn TEXT,
                category TEXT NOT NULL,
                description_en TEXT,
                description_bn TEXT,
                price NUMERIC NOT NULL DEFAULT 0,
                sale_price NUMERIC,
                stock INTEGER DEFAULT 0,
                images TEXT[] DEFAULT '{}',
                colors TEXT[] DEFAULT '{}',
                powers TEXT[] DEFAULT '{}',
                is_active BOOLEAN DEFAULT true,
                featured BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `
    });

    if (productsError) {
        console.log('Products table - trying direct insert test...');
    } else {
        console.log('✓ Products table created');
    }

    // Create settings table
    const { error: settingsError } = await supabase.rpc('exec_sql', {
        sql: `
            CREATE TABLE IF NOT EXISTS settings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                store JSONB NOT NULL DEFAULT '{}',
                delivery JSONB NOT NULL DEFAULT '{}',
                payment JSONB NOT NULL DEFAULT '{}',
                notifications JSONB NOT NULL DEFAULT '{}',
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `
    });

    if (settingsError) {
        console.log('Settings table - trying direct insert test...');
    } else {
        console.log('✓ Settings table created');
    }

    // Test if tables exist by trying to select
    console.log('\nTesting table access...');

    const { data: ordersData, error: ordersTestError } = await supabase
        .from('orders')
        .select('id')
        .limit(1);

    if (ordersTestError) {
        console.log('❌ Orders table not accessible:', ordersTestError.message);
        console.log('\n⚠️  You need to create the tables manually in Supabase SQL Editor.');
        console.log('Go to: https://supabase.com/dashboard/project/ayesovtarkiuzkbxppdb/sql/new');
        return false;
    } else {
        console.log('✓ Orders table accessible');
    }

    const { error: productsTestError } = await supabase
        .from('products')
        .select('id')
        .limit(1);

    if (productsTestError) {
        console.log('❌ Products table not accessible:', productsTestError.message);
        return false;
    } else {
        console.log('✓ Products table accessible');
    }

    const { error: settingsTestError } = await supabase
        .from('settings')
        .select('id')
        .limit(1);

    if (settingsTestError) {
        console.log('❌ Settings table not accessible:', settingsTestError.message);
        return false;
    } else {
        console.log('✓ Settings table accessible');
    }

    console.log('\n✅ All tables are ready!');
    return true;
}

setupDatabase().catch(console.error);
