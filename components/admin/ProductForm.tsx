"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
    Loader2,
    Save,
    X,
    Plus,
    ImagePlus,
    Trash2,
    ArrowLeft,
    Package,
    DollarSign,
    Palette,
    Eye,
} from "lucide-react";
import { Link } from "@/lib/navigation";
import Image from "next/image";

interface Product {
    id?: string;
    name_en: string;
    name_bn?: string;
    category: string;
    description_en?: string;
    description_bn?: string;
    price: number;
    sale_price?: number;
    stock: number;
    images: string[];
    colors?: string[];
    powers?: string[];
    is_active: boolean;
    featured?: boolean;
}

interface ProductFormProps {
    product?: Product;
    mode: "create" | "edit";
}

const DEFAULT_POWERS = [
    "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00",
    "+2.25", "+2.50", "+2.75", "+3.00", "+3.25", "+3.50", "+3.75", "+4.00"
];

const DEFAULT_COLORS = [
    "Black", "Brown", "Navy Blue", "Tortoise", "Gold", "Silver",
    "Rose Gold", "Gunmetal", "Clear", "Red", "Blue", "Green"
];

export function ProductForm({ product, mode }: ProductFormProps) {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    // Form state
    const [formData, setFormData] = useState<Product>({
        name_en: product?.name_en || "",
        name_bn: product?.name_bn || "",
        category: product?.category || "",
        description_en: product?.description_en || "",
        description_bn: product?.description_bn || "",
        price: product?.price || 0,
        sale_price: product?.sale_price,
        stock: product?.stock || 0,
        images: product?.images || [],
        colors: product?.colors || [],
        powers: product?.powers || [],
        is_active: product?.is_active ?? true,
        featured: product?.featured ?? false,
    });

    const [newImageUrl, setNewImageUrl] = useState("");
    const [newColor, setNewColor] = useState("");
    const [customCategory, setCustomCategory] = useState("");

    // Fetch categories on mount
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/products/categories");
                const data = await res.json();
                setCategories(data.categories || []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        }
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Use custom category if selected
            const categoryToUse = formData.category === "__custom__" ? customCategory : formData.category;

            if (!categoryToUse) {
                toast.error("Please select or enter a category");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                category: categoryToUse,
                sale_price: formData.sale_price || undefined,
            };

            const url = mode === "create" ? "/api/products" : `/api/products/${product?.id}`;
            const method = mode === "create" ? "POST" : "PATCH";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            if (res.ok) {
                toast.success(mode === "create" ? "Product created successfully!" : "Product updated successfully!");
                router.push("/admin/products");
                router.refresh();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to save product");
            }
        } catch (error) {
            console.error("Save product error:", error);
            toast.error("Failed to save product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const addImage = () => {
        if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, newImageUrl.trim()]
            }));
            setNewImageUrl("");
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const toggleColor = (color: string) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors?.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...(prev.colors || []), color]
        }));
    };

    const addCustomColor = () => {
        if (newColor.trim() && !formData.colors?.includes(newColor.trim())) {
            setFormData(prev => ({
                ...prev,
                colors: [...(prev.colors || []), newColor.trim()]
            }));
            setNewColor("");
        }
    };

    const togglePower = (power: string) => {
        setFormData(prev => ({
            ...prev,
            powers: prev.powers?.includes(power)
                ? prev.powers.filter(p => p !== power)
                : [...(prev.powers || []), power]
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button type="button" variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {mode === "create" ? "Add New Product" : "Edit Product"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {mode === "create" ? "Create a new product for your store" : "Update product information"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin/products">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {mode === "create" ? "Create Product" : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>
                                Product name and description in English and Bengali
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name_en">Product Name (English) *</Label>
                                    <Input
                                        id="name_en"
                                        value={formData.name_en}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                                        placeholder="e.g., Classic Reading Glasses"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name_bn">Product Name (Bengali)</Label>
                                    <Input
                                        id="name_bn"
                                        value={formData.name_bn}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name_bn: e.target.value }))}
                                        placeholder="e.g., ক্লাসিক রিডিং গ্লাস"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description_en">Description (English)</Label>
                                <Textarea
                                    id="description_en"
                                    value={formData.description_en}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                                    placeholder="Describe the product features, materials, benefits..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description_bn">Description (Bengali)</Label>
                                <Textarea
                                    id="description_bn"
                                    value={formData.description_bn}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description_bn: e.target.value }))}
                                    placeholder="পণ্যের বৈশিষ্ট্য, উপকরণ, সুবিধা বর্ণনা করুন..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="__custom__">+ Custom Category</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {formData.category === "__custom__" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="customCategory">Custom Category *</Label>
                                        <Input
                                            id="customCategory"
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            placeholder="Enter custom category"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing & Stock */}
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Pricing & Inventory
                            </CardTitle>
                            <CardDescription>
                                Set product price, sale price, and stock levels
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (BDT) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sale_price">Sale Price (BDT)</Label>
                                    <Input
                                        id="sale_price"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formData.sale_price || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sale_price: parseFloat(e.target.value) || undefined }))}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock Quantity *</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formData.stock}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImagePlus className="h-5 w-5" />
                                Product Images
                            </CardTitle>
                            <CardDescription>
                                Add image URLs for your product (first image is the main image)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    placeholder="Enter image URL (https://...)"
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                                />
                                <Button type="button" onClick={addImage} variant="secondary">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                                            <Image
                                                src={img}
                                                alt={`Product image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                            {index === 0 && (
                                                <Badge className="absolute top-2 left-2 text-[10px]">Main</Badge>
                                            )}
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {formData.images.length === 0 && (
                                <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                                    <ImagePlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No images added yet</p>
                                    <p className="text-xs">Add image URLs above</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Variants - Colors */}
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Colors
                            </CardTitle>
                            <CardDescription>
                                Select available colors for this product
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {DEFAULT_COLORS.map((color) => (
                                    <Badge
                                        key={color}
                                        variant={formData.colors?.includes(color) ? "default" : "outline"}
                                        className="cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => toggleColor(color)}
                                    >
                                        {color}
                                        {formData.colors?.includes(color) && <X className="h-3 w-3 ml-1" />}
                                    </Badge>
                                ))}
                            </div>

                            {/* Custom colors */}
                            {formData.colors?.filter(c => !DEFAULT_COLORS.includes(c)).map((color) => (
                                <Badge
                                    key={color}
                                    variant="default"
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => toggleColor(color)}
                                >
                                    {color}
                                    <X className="h-3 w-3 ml-1" />
                                </Badge>
                            ))}

                            <div className="flex gap-2">
                                <Input
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    placeholder="Add custom color"
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomColor())}
                                />
                                <Button type="button" onClick={addCustomColor} variant="secondary" size="sm">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Variants - Powers */}
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Lens Powers
                            </CardTitle>
                            <CardDescription>
                                Select available lens powers for reading glasses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {DEFAULT_POWERS.map((power) => (
                                    <Badge
                                        key={power}
                                        variant={formData.powers?.includes(power) ? "default" : "outline"}
                                        className="cursor-pointer hover:opacity-80 transition-opacity font-mono"
                                        onClick={() => togglePower(power)}
                                    >
                                        {power}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked === true }))}
                                />
                                <Label htmlFor="is_active" className="font-normal cursor-pointer">
                                    Active (visible on store)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked === true }))}
                                />
                                <Label htmlFor="featured" className="font-normal cursor-pointer">
                                    Featured Product
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-muted">
                                    {formData.images[0] ? (
                                        <Image
                                            src={formData.images[0]}
                                            alt="Product preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                            No Image
                                        </div>
                                    )}
                                    {!formData.is_active && (
                                        <Badge variant="destructive" className="absolute top-2 left-2">
                                            Inactive
                                        </Badge>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold truncate">
                                        {formData.name_en || "Product Name"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {formData.category || "Category"}
                                    </p>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-lg text-primary">
                                        ৳{formData.price.toLocaleString()}
                                    </span>
                                    {formData.sale_price && formData.sale_price > formData.price && (
                                        <span className="text-sm text-muted-foreground line-through">
                                            ৳{formData.sale_price.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <Badge variant="outline" className="font-mono">
                                    {formData.stock} in stock
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {mode === "edit" && product?.id && (
                        <Card className="bg-card/50 backdrop-blur-sm border-destructive/50">
                            <CardHeader>
                                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full"
                                    onClick={async () => {
                                        if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
                                            try {
                                                const res = await fetch(`/api/products/${product.id}`, {
                                                    method: "DELETE",
                                                    credentials: "include",
                                                });
                                                if (res.ok) {
                                                    toast.success("Product deleted successfully");
                                                    router.push("/admin/products");
                                                    router.refresh();
                                                } else {
                                                    toast.error("Failed to delete product");
                                                }
                                            } catch {
                                                toast.error("Failed to delete product");
                                            }
                                        }
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Product
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </form>
    );
}
