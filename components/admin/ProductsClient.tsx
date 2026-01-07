"use client";

import { useState } from "react";
import { LayoutGrid, List, Search, Plus, MoreHorizontal, Edit, Trash2, RefreshCw, Copy, AlertTriangle, CheckSquare, Square, X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/navigation";
import { useRouter } from "@/lib/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

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
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "lowstock">("all");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [products, setProducts] = useState(initialProducts);
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
    const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [duplicating, setDuplicating] = useState<string | null>(null);

    const router = useRouter();
    const toast = useToast();

    const LOW_STOCK_THRESHOLD = 5;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesStatus = true;
        if (statusFilter === "active") {
            matchesStatus = product.is_active;
        } else if (statusFilter === "inactive") {
            matchesStatus = !product.is_active;
        } else if (statusFilter === "lowstock") {
            matchesStatus = product.stock <= LOW_STOCK_THRESHOLD && product.is_active;
        }

        return matchesSearch && matchesStatus;
    });

    const lowStockCount = products.filter(p => p.stock <= LOW_STOCK_THRESHOLD && p.is_active).length;

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/products/${productToDelete.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                toast.success("Product deleted successfully");
                setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
                setSelectedProducts(prev => {
                    const next = new Set(prev);
                    next.delete(productToDelete.id);
                    return next;
                });
                setDeleteModalOpen(false);
                setProductToDelete(null);
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to delete product");
            }
        } catch {
            toast.error("Failed to delete product");
        } finally {
            setDeleting(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.size === 0) return;

        setBulkDeleting(true);
        try {
            const res = await fetch('/api/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'delete',
                    ids: Array.from(selectedProducts)
                }),
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(`${data.deleted} products deleted successfully`);
                setProducts(prev => prev.filter(p => !selectedProducts.has(p.id)));
                setSelectedProducts(new Set());
                setBulkDeleteModalOpen(false);
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to delete products");
            }
        } catch {
            toast.error("Failed to delete products");
        } finally {
            setBulkDeleting(false);
        }
    };

    const handleDuplicate = async (product: Product) => {
        setDuplicating(product.id);
        try {
            const res = await fetch('/api/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'duplicate',
                    id: product.id
                }),
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(`Product duplicated as "${data.product.name_en}"`);
                setProducts(prev => [data.product, ...prev]);
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to duplicate product");
            }
        } catch {
            toast.error("Failed to duplicate product");
        } finally {
            setDuplicating(null);
        }
    };

    const toggleProductSelection = (productId: string) => {
        setSelectedProducts(prev => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
            }
            return next;
        });
    };

    const toggleAllSelection = () => {
        if (selectedProducts.size === filteredProducts.length) {
            setSelectedProducts(new Set());
        } else {
            setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
        }
    };

    const handleRefresh = () => {
        router.refresh();
    };

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
                    <Button variant="outline" size="icon" onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Link href="/admin/products/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockCount > 0 && (
                <Card className="p-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-amber-800 dark:text-amber-200">Low Stock Alert</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                {lowStockCount} product{lowStockCount > 1 ? 's' : ''} {lowStockCount > 1 ? 'are' : 'is'} running low on stock (5 or fewer items)
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-300"
                            onClick={() => setStatusFilter("lowstock")}
                        >
                            View Items
                        </Button>
                    </div>
                </Card>
            )}

            {/* Bulk Actions Bar */}
            {selectedProducts.size > 0 && (
                <Card className="p-3 border-primary/20 bg-primary/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckSquare className="h-5 w-5 text-primary" />
                            <span className="font-medium">
                                {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProducts(new Set())}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Clear
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setBulkDeleteModalOpen(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete Selected
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

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
                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-1 bg-background/50 rounded-md border border-border/50 p-1">
                        {(["all", "active", "inactive", "lowstock"] as const).map((status) => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? "secondary" : "ghost"}
                                size="sm"
                                className="h-8 px-3 text-xs capitalize"
                                onClick={() => setStatusFilter(status)}
                            >
                                {status === "lowstock" ? (
                                    <span className="flex items-center gap-1">
                                        Low Stock
                                        {lowStockCount > 0 && (
                                            <Badge variant="destructive" className="h-4 px-1 text-[10px]">
                                                {lowStockCount}
                                            </Badge>
                                        )}
                                    </span>
                                ) : status}
                            </Button>
                        ))}
                    </div>

                    {/* View Toggle */}
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
                        {products.length === 0
                            ? "Get started by adding your first product."
                            : "No products match your search criteria."}
                    </p>
                    {products.length === 0 ? (
                        <Link href="/admin/products/new">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Product
                            </Button>
                        </Link>
                    ) : (
                        <Button variant="outline" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}>
                            Clear Filters
                        </Button>
                    )}
                </Card>
            ) : (
                <>
                    {view === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm relative">
                                    {/* Selection Checkbox */}
                                    <div className="absolute top-2 left-2 z-10">
                                        <div
                                            className={`p-1 rounded bg-background/80 backdrop-blur-sm border border-border/50 cursor-pointer transition-opacity ${selectedProducts.has(product.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleProductSelection(product.id);
                                            }}
                                        >
                                            {selectedProducts.has(product.id) ? (
                                                <CheckSquare className="h-5 w-5 text-primary" />
                                            ) : (
                                                <Square className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>
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
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/quick-order/${product.id}`;
                                                            navigator.clipboard.writeText(url);
                                                            toast.success("Link Copied");
                                                        }}
                                                    >
                                                        <Share2 className="mr-2 h-4 w-4" />
                                                        Copy Quick Link
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDuplicate(product)}
                                                        disabled={duplicating === product.id}
                                                    >
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        {duplicating === product.id ? "Duplicating..." : "Duplicate"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleDeleteClick(product)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        {!product.is_active && (
                                            <div className="absolute top-10 left-2 bg-destructive/90 text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shadow-sm">
                                                Inactive
                                            </div>
                                        )}
                                        {product.stock <= LOW_STOCK_THRESHOLD && product.stock > 0 && (
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
                                                    {product.sale_price && product.sale_price > product.price && (
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
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                                                onCheckedChange={toggleAllSelection}
                                            />
                                        </TableHead>
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
                                        <TableRow
                                            key={product.id}
                                            className={selectedProducts.has(product.id) ? "bg-primary/5" : ""}
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedProducts.has(product.id)}
                                                    onCheckedChange={() => toggleProductSelection(product.id)}
                                                />
                                            </TableCell>
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
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        product.stock === 0
                                                            ? "border-destructive text-destructive"
                                                            : product.stock <= LOW_STOCK_THRESHOLD
                                                                ? "border-amber-500 text-amber-600"
                                                                : ""
                                                    }
                                                >
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
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                const url = `${window.location.origin}/quick-order/${product.id}`;
                                                                navigator.clipboard.writeText(url);
                                                                toast.success("Link Copied");
                                                            }}
                                                        >
                                                            <Share2 className="mr-2 h-4 w-4" />
                                                            Copy Quick Link
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDuplicate(product)}
                                                            disabled={duplicating === product.id}
                                                        >
                                                            <Copy className="mr-2 h-4 w-4" />
                                                            {duplicating === product.id ? "Duplicating..." : "Duplicate"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => handleDeleteClick(product)}
                                                        >
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{productToDelete?.name_en}&quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete Confirmation Dialog */}
            <AlertDialog open={bulkDeleteModalOpen} onOpenChange={setBulkDeleteModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {selectedProducts.size} Products</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedProducts.size} selected product{selectedProducts.size > 1 ? 's' : ''}?
                            This action cannot be undone and will permanently remove these products from your inventory.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={bulkDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBulkDelete}
                            disabled={bulkDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {bulkDeleting ? "Deleting..." : `Delete ${selectedProducts.size} Products`}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
