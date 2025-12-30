"use client";

import { useState } from "react";
import { LayoutGrid, List, Search, Plus, Filter, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface Product {
    id: string;
    name_en: string;
    name_bn?: string;
    category: string;
    price: number;
    sale_price?: number;
    stock: number;
    images: string[];
    is_active: boolean;
    created_at: string;
}

interface ProductsClientProps {
    products: Product[];
}

export function ProductsClient({ products: initialProducts }: ProductsClientProps) {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

    const filteredProducts = initialProducts.filter(product => {
        const matchesSearch = product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all"
            ? true
            : statusFilter === "active" ? product.is_active : !product.is_active;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your inventory ({filteredProducts.length} items)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin/products/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50 p-1 rounded-lg border border-border/50 backdrop-blur-sm">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9 bg-background/50 border-none focus-visible:ring-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1 bg-background/50 rounded-md border border-border/50 p-1">
                        <Button
                            variant={view === "grid" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setView("grid")}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={view === "list" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setView("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {filteredProducts.length === 0 ? (
                <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed bg-card/50">
                    <div className="relative w-24 h-24 mb-4 opacity-10">
                        <Image src="/logo.png" alt="No products" fill className="object-contain grayscale" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No products found</h3>
                    <p className="text-muted-foreground mb-4 max-w-sm">
                        No products match your search criteria.
                    </p>
                    <Button variant="outline" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}>
                        Clear Filters
                    </Button>
                </Card>
            ) : (
                <>
                    {view === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                                    <div className="aspect-[4/3] relative bg-muted/50 overflow-hidden">
                                        {product.images?.[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name_en}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        {!product.is_active && (
                                            <div className="absolute top-2 left-2 bg-destructive/90 text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shadow-sm">
                                                Inactive
                                            </div>
                                        )}
                                        {product.stock <= 5 && product.stock > 0 && (
                                            <div className="absolute bottom-2 left-2 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shadow-sm">
                                                Low Stock
                                            </div>
                                        )}
                                        {product.stock === 0 && (
                                            <div className="absolute bottom-2 left-2 bg-slate-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shadow-sm">
                                                Out of Stock
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-semibold truncate text-base leading-none mb-1" title={product.name_en}>
                                                {product.name_en}
                                            </h3>
                                            <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-bold text-lg text-primary">
                                                        {formatCurrency(product.price)}
                                                    </span>
                                                    {product.sale_price && (
                                                        <span className="text-xs text-muted-foreground line-through decoration-destructive/50">
                                                            {formatCurrency(product.sale_price)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge variant={product.stock > 0 ? "outline" : "secondary"} className="font-mono text-xs">
                                                {product.stock} in stock
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="border rounded-md bg-card/50 backdrop-blur-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[80px]">Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Stock</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="relative w-10 h-10 rounded overflow-hidden bg-muted">
                                                    {product.images?.[0] && (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name_en}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{product.name_en}</span>
                                                    {product.name_bn && <span className="text-xs text-muted-foreground">{product.name_bn}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={product.is_active ? "default" : "destructive"}
                                                    className="uppercase text-[10px] tracking-wider"
                                                >
                                                    {product.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {formatCurrency(product.price)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline" className={product.stock === 0 ? "border-destructive text-destructive" : ""}>
                                                    {product.stock}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
