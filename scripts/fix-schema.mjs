import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayesovtarkiuzkbxppdb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZXNvdnRhcmtpdXprYnhwcGRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjY0MDQ3NiwiZXhwIjoyMDgyMjE2NDc2fQ.vlmhGQjTO49SwFveDE0x5CVPL4ohn7KMbMO3q6XI7j0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test by inserting a product with minimal fields first
async function testProductInsert() {
    console.log('Testing product insert with minimal fields...');

    const testProduct = {
        name_en: 'Test Product',
        category: 'test',
        price: 100,
        stock: 10,
        is_active: true,
        featured: false,
        images: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('products')
        .insert(testProduct)
        .select()
        .single();

    if (error) {
        console.log('Insert error:', error);
        console.log('\nMissing column:', error.message);

        // List what columns we need
        console.log('\nThe products table needs these columns:');
        console.log('- id (UUID, auto-generated)');
        console.log('- name_en (TEXT)');
        console.log('- name_bn (TEXT)');
        console.log('- category (TEXT)');
        console.log('- description_en (TEXT)');
        console.log('- description_bn (TEXT)');
        console.log('- price (NUMERIC)');
        console.log('- sale_price (NUMERIC)');
        console.log('- stock (INTEGER)');
        console.log('- images (TEXT[])');
        console.log('- colors (TEXT[])');
        console.log('- powers (TEXT[])');
        console.log('- is_active (BOOLEAN)');
        console.log('- featured (BOOLEAN)');
        console.log('- created_at (TIMESTAMPTZ)');
        console.log('- updated_at (TIMESTAMPTZ)');

        return false;
    }

    console.log('✓ Test product created:', data.id);

    // Clean up test product
    await supabase.from('products').delete().eq('id', data.id);
    console.log('✓ Test product deleted');

    return true;
}

// Check what columns exist
async function checkSchema() {
    console.log('\nChecking current schema...\n');

    // Try to get a product to see column structure
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);

    if (error) {
        console.log('Error accessing products:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log('Current columns in products table:');
        console.log(Object.keys(data[0]));
    } else {
        console.log('Products table is empty, cannot determine columns from data.');
    }
}

async function main() {
    await checkSchema();
    const success = await testProductInsert();

    if (!success) {
        console.log('\n⚠️  Please run the following SQL in Supabase SQL Editor:\n');
        console.log(`-- Drop existing tables and recreate with correct schema
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

CREATE TABLE orders (
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

CREATE TABLE products (
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

CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store JSONB NOT NULL DEFAULT '{}',
    delivery JSONB NOT NULL DEFAULT '{}',
    payment JSONB NOT NULL DEFAULT '{}',
    notifications JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);`);
    } else {
        console.log('\n✅ Database schema is correct!');
    }
}

main().catch(console.error);
