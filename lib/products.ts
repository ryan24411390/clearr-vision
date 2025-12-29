export type PowerOption =
    | "Blue Cut Zero"
    | "+0.75"
    | "+1.00"
    | "+1.25"
    | "+1.50"
    | "+1.75"
    | "+2.00"
    | "+2.25"
    | "+2.50"
    | "+2.75"
    | "+3.00"
    | "+3.25"
    | "+3.50"
    | "Don't know power";

export type Product = {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number; // For sale items
    discount?: string; // e.g. "42% discount"
    category: string; // "Reading Glasses"
    description: string; // The "Key Features" or "Full Package Includes" content
    image: string; // Primary image (first in gallery)
    images: string[]; // All product images for gallery

    // Attributes for Display Table
    attributes: {
        type?: string;
        modelNo?: string;
        size: string;
        gender: string;
        frameShape: string;
        frameMaterial: string;
        nosePadType?: string;
        packaging: string;
        origin: string;
        colors: string[]; // for display in table
    };

    // Options for Order Form
    availableColors: string[]; // For selection
    availablePowers: PowerOption[];

    // Badges/Flags
    isNew?: boolean;
    isOnSale?: boolean;
    rating?: number;
    reviews?: number;
};

const COMMON_POWERS: PowerOption[] = [
    "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00", "+2.25", "+2.50", "+2.75", "+3.00", "+3.25", "+3.50",
    "Don't know power"
];

const RIMLESS_POWERS: PowerOption[] = [
    "Blue Cut Zero",
    ...COMMON_POWERS
];

export const PRODUCTS: Product[] = [
    {
        id: "1515",
        name: "1515 – Diamond Cut Anti BLU Reading",
        slug: "diamond-cut-anti-blu-reading-1515",
        price: 350,
        category: "Reading Glasses",
        description: `
Pay cash on delivery
Single vision Power
7-day return/Exchange
Whole Bangladesh Delivery
Exclusive Delivery Option
        `.trim(),
        image: "/images/products/1515/1515-black.webp",
        images: [
            "/images/products/1515/1515-black.webp",
            "/images/products/1515/bifocal-hd-1515.webp",
            "/images/products/1515/black-1515.jpeg",
            "/images/products/1515/bifocal-1515.jpeg",
            "/images/products/1515/diamond-cut-1515.jpeg",
            "/images/products/1515/1515-tr.jpeg",
            "/images/products/1515/brown-1515.jpeg"
        ],
        attributes: {
            modelNo: "1515 Blue Cut Reading Black",
            size: "Regular Size (Fit for Every Face)",
            gender: "Unisex",
            frameShape: "As Per Picture",
            frameMaterial: "TR",
            nosePadType: "Fixed/Adjustable",
            colors: ["Black", "Brown (ব্ল্যাক, ব্রাউন)"],
            packaging: "Nine Optic Regular Packaging",
            origin: "Imported from China"
        },
        availableColors: ["Black", "Brown"],
        availablePowers: COMMON_POWERS,
        reviews: 0
    },
    {
        id: "V004",
        name: "Luxury Rimless Anti Blue – V004",
        slug: "luxury-rimless-anti-blue-v004",
        price: 1190,
        category: "Reading Glasses",
        description: `
Luxury Rimless Anti Blue
Power and Non Power options
Premium Quality
Scratch Free and Anti UV, Anti Radiation
Tinted Color (Silver and Gold Frame)
Whole Bangladesh Home Delivery
        `.trim(),
        image: "/images/products/v004/v004-gold-1.jpeg",
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
        attributes: {
            type: "Luxury Rimless Anti Blue",
            size: "Regular Size (Fit for Every Face)",
            gender: "Unisex",
            frameShape: "Diamond Cut Shape",
            frameMaterial: "Rimless Metal Body",
            nosePadType: "Adjustable",
            colors: ["Golden (গোল্ডেন)", "Silver (সিলভার)"],
            packaging: "Nine Optic Regular Packaging",
            origin: "Imported from Abroad"
        },
        availableColors: ["Golden", "Silver"],
        availablePowers: RIMLESS_POWERS
    },
    {
        id: "V007",
        name: "Luxury Rimless Anti Blue – V007",
        slug: "luxury-rimless-anti-blue-v007",
        price: 1100,
        originalPrice: 1900,
        discount: "৳800 off (42% discount)",
        isOnSale: true,
        category: "Reading Glasses",
        description: `
Luxury Rimless Anti Blue Glasses
Premium Quality
Scratch Free and Anti UV, Anti Radiation
Tinted Color (Silver and Gold Frame)
Whole Bangladesh Home Delivery
        `.trim(),
        image: "/images/products/v007/v007-gold-1.jpeg",
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
        attributes: {
            type: "Luxury Rimless Anti Blue Glasses",
            size: "Regular Size (Fit for Every Face)",
            gender: "Unisex",
            frameShape: "Diamond Cut Shape",
            frameMaterial: "Rimless Metal and Carbon Fiber",
            nosePadType: "Adjustable",
            colors: ["Golden (গোল্ডেন)", "Silver (সিলভার)"],
            packaging: "Nine Optic Regular Packaging",
            origin: "Imported from Abroad"
        },
        availableColors: ["Gold/Black", "Shining Silver/Black"], // Deduced from "Color Description" in request
        availablePowers: RIMLESS_POWERS,
        reviews: 0
    },
    {
        id: "V001",
        name: "Premium Anti Blue Reading – V001",
        slug: "premium-anti-blue-reading-v001",
        price: 990,
        category: "Reading Glasses",
        description: `
Luxury Rimless Anti Blue
Power and Non Power options
Premium Quality
Scratch Free and Anti UV, Anti Radiation
Tinted Color (Silver and Gold Frame)
Whole Bangladesh Home Delivery
        `.trim(),
        image: "/images/products/v001/v001-main.webp",
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
        attributes: {
            type: "Luxury Rimless Anti Blue",
            size: "Regular Size (Fit for Every Face)",
            gender: "Unisex",
            frameShape: "Diamond Cut Shape",
            frameMaterial: "Rimless Metal Body",
            nosePadType: "Adjustable",
            colors: ["Golden (গোল্ডেন) only"],
            packaging: "Nine Optic Regular Packaging",
            origin: "Imported from Abroad"
        },
        availableColors: ["Shining Gold", "Shining Silver"], // Deduced from "Color Description"
        availablePowers: COMMON_POWERS // Note: Request lists +0.75 start for V001, effectively common powers
    }
];
