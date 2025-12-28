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
    image: string;

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
        name: "Diamond Cut Anti BLU Reading",
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
        image: "/images/products/bold-black.jpg",
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
Power and Non Power options
Premium Quality
Scratch Free
Anti UV, Anti Radiation
Tinted Color frames
Whole Bangladesh Home Delivery
        `.trim(),
        image: "/images/products/rimless-silver.jpg",
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
        image: "/images/products/executive.jpg",
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
Power and Non Power options
Premium Quality
Scratch Free
Anti UV, Anti Radiation
Tinted Color frames
Whole Bangladesh Home Delivery
        `.trim(),
        image: "/images/products/ultra-blue.jpg",
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
