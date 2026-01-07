import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayesovtarkiuzkbxppdb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZXNvdnRhcmtpdXprYnhwcGRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjY0MDQ3NiwiZXhwIjoyMDgyMjE2NDc2fQ.vlmhGQjTO49SwFveDE0x5CVPL4ohn7KMbMO3q6XI7j0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const COMMON_POWERS = [
    "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+2.75", "+3.00", "+3.25", "+3.50",
    "Don't know power"
];

const RIMLESS_POWERS = [
    "Blue Cut Zero",
    ...COMMON_POWERS
];

const products = [
    {
        name_en: "1515 – Diamond Cut Anti BLU Reading",
        name_bn: "১৫১৫ – ডায়মন্ড কাট এন্টি ব্লু রিডিং",
        category: "reading",
        description_en: "Pay cash on delivery\nSingle vision Power\n7-day return/Exchange\nWhole Bangladesh Delivery\nExclusive Delivery Option",
        description_bn: "ক্যাশ অন ডেলিভারি\nসিঙ্গেল ভিশন পাওয়ার\n৭ দিনের রিটার্ন/এক্সচেঞ্জ\nসারা বাংলাদেশে ডেলিভারি\nএক্সক্লুসিভ ডেলিভারি অপশন",
        price: 350,
        stock: 100,
        images: [
            "/images/products/1515/1515-black.webp",
            "/images/products/1515/bifocal-hd-1515.webp",
            "/images/products/1515/black-1515.jpeg",
            "/images/products/1515/bifocal-1515.jpeg",
            "/images/products/1515/diamond-cut-1515.jpeg",
            "/images/products/1515/1515-tr.jpeg",
            "/images/products/1515/brown-1515.jpeg"
        ],
        colors: ["Black", "Brown"],
        powers: COMMON_POWERS,
        is_active: true,
        featured: true
    },
    {
        name_en: "Luxury Rimless Anti Blue – V004",
        name_bn: "লাক্সারি রিমলেস এন্টি ব্লু – V004",
        category: "reading",
        description_en: "Luxury Rimless Anti Blue\nPower and Non Power options\nPremium Quality\nScratch Free and Anti UV, Anti Radiation\nTinted Color (Silver and Gold Frame)\nWhole Bangladesh Home Delivery",
        description_bn: "লাক্সারি রিমলেস এন্টি ব্লু\nপাওয়ার এবং নন পাওয়ার অপশন\nপ্রিমিয়াম কোয়ালিটি\nস্ক্র্যাচ ফ্রি এবং এন্টি UV, এন্টি রেডিয়েশন\nটিন্টেড কালার (সিলভার এবং গোল্ড ফ্রেম)\nসারা বাংলাদেশে হোম ডেলিভারি",
        price: 1190,
        stock: 50,
        images: [
            "/images/products/v004/v004-gold-1.jpeg",
            "/images/products/v004/v004-silver-1.webp",
            "/images/products/v004/v004-silver-2.jpg",
            "/images/products/v004/v004-gold-2.webp",
            "/images/products/v004/v004-gold-3.jpg",
            "/images/products/v004/v004-silver-3.jpg",
            "/images/products/v004/v004-gold-4.jpeg",
            "/images/products/v004/v004-gold-5.jpeg",
            "/images/products/v004/v004-silver-4.jpeg"
        ],
        colors: ["Golden", "Silver"],
        powers: RIMLESS_POWERS,
        is_active: true,
        featured: true
    },
    {
        name_en: "Luxury Rimless Anti Blue – V007",
        name_bn: "লাক্সারি রিমলেস এন্টি ব্লু – V007",
        category: "reading",
        description_en: "Luxury Rimless Anti Blue Glasses\nPremium Quality\nScratch Free and Anti UV, Anti Radiation\nTinted Color (Silver and Gold Frame)\nWhole Bangladesh Home Delivery",
        description_bn: "লাক্সারি রিমলেস এন্টি ব্লু গ্লাস\nপ্রিমিয়াম কোয়ালিটি\nস্ক্র্যাচ ফ্রি এবং এন্টি UV, এন্টি রেডিয়েশন\nটিন্টেড কালার (সিলভার এবং গোল্ড ফ্রেম)\nসারা বাংলাদেশে হোম ডেলিভারি",
        price: 1100,
        sale_price: 1100,
        stock: 75,
        images: [
            "/images/products/v007/v007-gold-1.jpeg",
            "/images/products/v007/v007-gold-2.webp",
            "/images/products/v007/v007-model-1.jpg",
            "/images/products/v007/v007-silver-1.jpeg",
            "/images/products/v007/v007-model-2.jpg",
            "/images/products/v007/v007-silver-2.jpeg",
            "/images/products/v007/v007-gold-3.png",
            "/images/products/v007/v007-silver-3.jpeg",
            "/images/products/v007/v007-gold-4.jpeg"
        ],
        colors: ["Gold/Black", "Shining Silver/Black"],
        powers: RIMLESS_POWERS,
        is_active: true,
        featured: true
    },
    {
        name_en: "Premium Anti Blue Reading – V001",
        name_bn: "প্রিমিয়াম এন্টি ব্লু রিডিং – V001",
        category: "reading",
        description_en: "Luxury Rimless Anti Blue\nPower and Non Power options\nPremium Quality\nScratch Free and Anti UV, Anti Radiation\nTinted Color (Silver and Gold Frame)\nWhole Bangladesh Home Delivery",
        description_bn: "লাক্সারি রিমলেস এন্টি ব্লু\nপাওয়ার এবং নন পাওয়ার অপশন\nপ্রিমিয়াম কোয়ালিটি\nস্ক্র্যাচ ফ্রি এবং এন্টি UV, এন্টি রেডিয়েশন\nটিন্টেড কালার (সিলভার এবং গোল্ড ফ্রেম)\nসারা বাংলাদেশে হোম ডেলিভারি",
        price: 990,
        stock: 60,
        images: [
            "/images/products/v001/v001-main.webp",
            "/images/products/v001/v001-2.jpg",
            "/images/products/v001/v001-3.jpg",
            "/images/products/v001/v001-4.jpeg",
            "/images/products/v001/v001-5.png",
            "/images/products/v001/v001-6.webp",
            "/images/products/v001/v001-7.png",
            "/images/products/v001/v001-8.webp",
            "/images/products/v001/v001-9.webp",
            "/images/products/v001/v001-10.webp"
        ],
        colors: ["Shining Gold", "Shining Silver"],
        powers: COMMON_POWERS,
        is_active: true,
        featured: true
    }
];

async function seedProducts() {
    console.log('Seeding products to Supabase...\n');

    // First, clear existing products (optional - remove if you want to keep existing)
    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
        console.log('Note: Could not clear existing products:', deleteError.message);
    } else {
        console.log('Cleared existing products\n');
    }

    // Insert each product
    for (const product of products) {
        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from('products')
            .insert({
                ...product,
                created_at: now,
                updated_at: now
            })
            .select()
            .single();

        if (error) {
            console.log(`❌ Failed to add "${product.name_en}":`, error.message);
        } else {
            console.log(`✓ Added: ${product.name_en} (ID: ${data.id})`);
        }
    }

    console.log('\n✅ Product seeding complete!');

    // Verify
    const { data: allProducts, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' });

    console.log(`\nTotal products in database: ${count}`);
}

seedProducts().catch(console.error);
