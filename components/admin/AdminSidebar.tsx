"use client";

import { Link, usePathname } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    Settings,
    LogOut,
    ChevronRight
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    // { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("hidden md:flex flex-col h-screen w-72 bg-card border-r border-border fixed left-0 top-0 shadow-sm z-50", className)}>
            <div className="p-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight block leading-none">Smart Reading</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Admin Panel</span>
                    </div>
                </div>
            </div>

            <Separator className="opacity-50" />

            <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                <div className="px-4 mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main Menu</p>
                </div>
                {sidebarItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                                {item.label}
                            </div>
                            {isActive && <ChevronRight className="h-3 w-3 opacity-80" />}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-border bg-muted/5">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={async () => {
                        await fetch('/api/admin/auth', { method: 'DELETE' });
                        window.location.href = '/admin'; // Force reload/redirect
                    }}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
