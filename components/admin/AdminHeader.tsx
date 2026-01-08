"use client";

import { useState, useEffect, useRef } from "react";
import { User, Menu, Bell, Search, Package, ShoppingBag, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "./AdminSidebar";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/navigation";
import { useRouter } from "@/lib/navigation";
import { formatCurrency } from "@/lib/utils";

interface SearchResult {
    type: "product" | "order";
    id: string;
    title: string;
    subtitle: string;
    href: string;
    badge?: string;
}

export function AdminHeader() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close search results when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results: SearchResult[] = [];

                // Search products
                const productsRes = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`, {
                    credentials: "include",
                });
                if (productsRes.ok) {
                    const { products } = await productsRes.json();
                    products.forEach((p: { id: string; name_en: string; category: string; price: number; is_active: boolean }) => {
                        results.push({
                            type: "product",
                            id: p.id,
                            title: p.name_en,
                            subtitle: `${p.category} • ${formatCurrency(p.price)}`,
                            href: `/admin/products/${p.id}/edit`,
                            badge: p.is_active ? undefined : "Inactive",
                        });
                    });
                }

                // Search orders
                const ordersRes = await fetch(`/api/orders?limit=100`, {
                    credentials: "include",
                });
                if (ordersRes.ok) {
                    const { orders } = await ordersRes.json();
                    const searchLower = searchQuery.toLowerCase();
                    const matchingOrders = orders
                        .filter((o: { order_number: string; customer_name: string; customer_phone: string }) =>
                            o.order_number.toLowerCase().includes(searchLower) ||
                            o.customer_name.toLowerCase().includes(searchLower) ||
                            o.customer_phone.includes(searchQuery)
                        )
                        .slice(0, 5);

                    matchingOrders.forEach((o: { id: string; order_number: string; customer_name: string; total: number; status: string }) => {
                        results.push({
                            type: "order",
                            id: o.id,
                            title: o.order_number,
                            subtitle: `${o.customer_name} • ${formatCurrency(o.total)}`,
                            href: "/admin/orders",
                            badge: o.status,
                        });
                    });
                }

                setSearchResults(results);
                setShowResults(true);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleResultClick = (result: SearchResult) => {
        setShowResults(false);
        setSearchQuery("");
        router.push(result.href);
    };

    const handleLogout = async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        window.location.href = '/admin';
    };

    return (
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <AdminSidebar className="flex w-full h-full static border-none shadow-none" />
                    </SheetContent>
                </Sheet>

                {/* Functional Search */}
                <div className="hidden md:flex items-center relative" ref={searchRef}>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products, orders..."
                            className="w-[200px] lg:w-[300px] pl-9 pr-8 h-9 bg-muted/50 border-muted-foreground/20 focus-visible:bg-background transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery && setShowResults(true)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setShowResults(false);
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && (
                        <div className="absolute top-full left-0 mt-2 w-[300px] lg:w-[400px] bg-popover border rounded-lg shadow-lg overflow-hidden z-50">
                            {isSearching ? (
                                <div className="p-4 text-center text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                                    <span className="text-sm">Searching...</span>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">
                                    <span className="text-sm">No results found for &quot;{searchQuery}&quot;</span>
                                </div>
                            ) : (
                                <div className="max-h-[400px] overflow-y-auto">
                                    {searchResults.map((result) => (
                                        <button
                                            key={`${result.type}-${result.id}`}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left border-b last:border-b-0"
                                            onClick={() => handleResultClick(result)}
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                {result.type === "product" ? (
                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{result.title}</div>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {result.subtitle}
                                                </div>
                                            </div>
                                            {result.badge && (
                                                <Badge variant="outline" className="text-[10px] capitalize flex-shrink-0">
                                                    {result.badge}
                                                </Badge>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
                </Button>

                <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 flex items-center gap-2 rounded-full pl-2 pr-4 hover:bg-muted/50">
                            <Avatar className="h-8 w-8 border border-border">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="@admin" />
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">AD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-sm hidden sm:flex">
                                <span className="font-semibold leading-none">Administrator</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[100px]">System Admin</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Administrator</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    smaartreading@gmail.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/admin/settings">
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={handleLogout}
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
