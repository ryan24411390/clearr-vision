import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/db/products';

// Default categories for eyewear
const DEFAULT_CATEGORIES = [
    'Reading Glasses',
    'Blue Light Glasses',
    'Sunglasses',
    'Progressive Lenses',
    'Bifocal Glasses',
    'Computer Glasses',
    'Fashion Frames',
    'Sports Eyewear',
    'Kids Glasses',
    'Accessories',
];

// GET - Get all categories
export async function GET() {
    try {
        const existingCategories = await getCategories();

        // Merge with default categories and remove duplicates
        const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...existingCategories])].sort();

        return NextResponse.json({ categories: allCategories });
    } catch (error) {
        console.error('Fetch categories error:', error);
        return NextResponse.json({ categories: DEFAULT_CATEGORIES });
    }
}
