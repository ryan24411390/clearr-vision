"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, RefreshCw, Search, ChevronDown, ChevronUp, Download, Eye, Truck, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CopyableInfo } from "@/components/ui/copyable-info";

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    variant?: {
        color?: string;
        power?: string;
    };
}

interface Order {
    id: string;
    order_number: string;
    order_type: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    customer_city?: string;
    customer_area?: string;
    delivery_location?: string;
    items: OrderItem[];
    subtotal: number;
    delivery_charge: number;
    total: number;
    status: string;
    payment_method: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', icon: Clock, variant: 'secondary' as const },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle2, variant: 'default' as const },
    { value: 'processing', label: 'Processing', icon: Package, variant: 'outline' as const },
    { value: 'shipped', label: 'Shipped', icon: Truck, variant: 'outline' as const },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle2, variant: 'default' as const },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, variant: 'destructive' as const },
];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const toast = useToast();

    const fetchOrders = useCallback(async () => {
        setOrdersLoading(true);
        try {
            const res = await fetch(`/api/orders?status=all&limit=500`, {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setOrdersLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Filtered orders based on status and search
    const filteredOrders = useMemo(() => {
        let result = orders;

        // Filter by status
        if (selectedStatus !== 'all') {
            result = result.filter(o => o.status === selectedStatus);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(o =>
                o.order_number.toLowerCase().includes(query) ||
                o.customer_name.toLowerCase().includes(query) ||
                o.customer_phone.includes(query) ||
                o.customer_address.toLowerCase().includes(query)
            );
        }

        return result;
    }, [orders, selectedStatus, searchQuery]);

    // Export to CSV
    function exportToCSV() {
        if (filteredOrders.length === 0) {
            toast.error("No orders to export");
            return;
        }

        const headers = [
            'Order Number', 'Date', 'Customer Name', 'Phone', 'Address', 'City',
            'Items', 'Subtotal', 'Delivery', 'Total', 'Status', 'Payment Method'
        ];

        const rows = filteredOrders.map(order => [
            order.order_number,
            new Date(order.created_at).toLocaleDateString(),
            order.customer_name,
            order.customer_phone,
            `"${order.customer_address.replace(/"/g, '""')}"`,
            order.customer_city || '',
            `"${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}"`,
            order.subtotal,
            order.delivery_charge,
            order.total,
            order.status,
            order.payment_method
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        toast.success("Orders exported successfully");
    }

    async function updateOrderStatus(orderId: string, newStatus: string) {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include',
            });

            if (res.ok) {
                toast.success("Status updated");
                fetchOrders();
            } else {
                toast.error("Failed to update status");
            }
        } catch {
            toast.error("Failed to update status");
        }
    }

    function getStatusBadge(status: string) {
        const statusOption = STATUS_OPTIONS.find(s => s.value === status);
        const Icon = statusOption?.icon || AlertCircle;

        return (
            <Badge variant={statusOption?.variant || "secondary"} className="gap-1 px-2 py-0.5">
                <Icon className="h-3 w-3" />
                <span className="capitalize">{statusOption?.label || status}</span>
            </Badge>
        );
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    // Get status counts for badges
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: orders.length };
        STATUS_OPTIONS.forEach(status => {
            counts[status.value] = orders.filter(o => o.status === status.value).length;
        });
        return counts;
    }, [orders]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage and track customer orders ({filteredOrders.length})
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportToCSV} disabled={filteredOrders.length === 0} className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchOrders} disabled={ordersLoading} className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <RefreshCw className={`h-4 w-4 mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-2 rounded-lg border border-border/50 backdrop-blur-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by order #, name, phone, or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50 border-none focus-visible:ring-1"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <Button
                        variant={selectedStatus === 'all' ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedStatus('all')}
                        className="whitespace-nowrap rounded-full px-4"
                    >
                        All ({statusCounts.all})
                    </Button>
                    {STATUS_OPTIONS.map((status) => (
                        <Button
                            key={status.value}
                            variant={selectedStatus === status.value ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedStatus(status.value)}
                            className="whitespace-nowrap rounded-full px-4"
                        >
                            {status.label} ({statusCounts[status.value] || 0})
                        </Button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {ordersLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <Card className="p-12 text-center text-muted-foreground border-dashed bg-card/50 flex flex-col items-center justify-center">
                        <div className="p-4 rounded-full bg-muted/50 mb-4">
                            <Search className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-1">No orders found</h3>
                        <p className="max-w-sm mx-auto">
                            {searchQuery ? `No orders matching "${searchQuery}"` : 'No orders have been placed yet.'}
                        </p>
                        {searchQuery && (
                            <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
                                Clear search
                            </Button>
                        )}
                    </Card>
                ) : (
                    filteredOrders.map((order) => {
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <Card key={order.id} className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-200 hover:shadow-md group">
                                <div
                                    className="p-4 cursor-pointer hover:bg-muted/10 transition-colors"
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary mt-1">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <CopyableInfo
                                                        value={order.order_number}
                                                        variant="minimal"
                                                        className="font-mono text-sm font-bold tracking-tight"
                                                    />
                                                    {getStatusBadge(order.status)}
                                                    {order.order_type === 'cart' && (
                                                        <Badge variant="outline" className="text-[10px] px-1.5 h-5 bg-background/50">
                                                            Cart
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-semibold">{order.customer_name}</span>
                                                    <span className="text-muted-foreground">•</span>
                                                    <span className="text-muted-foreground">{order.customer_phone}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(order.created_at)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pl-11 md:pl-0">
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-primary">{formatCurrency(order.total)}</p>
                                                <p className="text-xs text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 rounded-full">
                                                {isExpanded ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-border/50 bg-muted/20 p-6 animate-in slide-in-from-top-2 duration-200">
                                        <div className="grid lg:grid-cols-3 gap-6">
                                            {/* Customer & Shipping */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                    <Truck className="h-3 w-3" /> Customer & Shipping
                                                </h4>
                                                <div className="space-y-3">
                                                    <CopyableInfo
                                                        label="Contact Info"
                                                        value={`${order.customer_name} • ${order.customer_phone}`}
                                                    />
                                                    <CopyableInfo
                                                        label="Shipping Address"
                                                        value={[
                                                            order.customer_address,
                                                            order.customer_area,
                                                            order.customer_city
                                                        ].filter(Boolean).join(', ')}
                                                    />
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="space-y-4 lg:col-span-2">
                                                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                    <Package className="h-3 w-3" /> Order Items
                                                </h4>
                                                <div className="bg-card/50 rounded-lg border border-border/50 overflow-hidden shadow-sm">
                                                    <div className="divide-y divide-border/50">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-center p-3 text-sm hover:bg-muted/30 transition-colors">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                                                                        {idx + 1}
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium">{item.name}</span>
                                                                        <div className="text-muted-foreground text-xs mt-0.5 flex items-center gap-2">
                                                                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">x{item.quantity}</Badge>
                                                                            {item.variant?.color && <span>{item.variant.color}</span>}
                                                                            {item.variant?.power && <span>• {item.variant.power}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <span className="font-mono font-medium">{formatCurrency(item.price * item.quantity)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="bg-muted/30 p-4 border-t border-border/50">
                                                        <div className="space-y-1.5 text-sm">
                                                            <div className="flex justify-between text-muted-foreground">
                                                                <span>Subtotal</span>
                                                                <span>{formatCurrency(order.subtotal)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-muted-foreground">
                                                                <span>Delivery Charge</span>
                                                                <span>{formatCurrency(order.delivery_charge)}</span>
                                                            </div>
                                                            <div className="border-t border-dashed pt-2 mt-2 flex justify-between font-bold text-base">
                                                                <span>Total Amount</span>
                                                                <span className="text-primary">{formatCurrency(order.total)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-between gap-4 pt-2">
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                            className="h-9 w-full sm:max-w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                                                        >
                                                            {STATUS_OPTIONS.map((status) => (
                                                                <option key={status.value} value={status.value}>
                                                                    {status.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <Button size="sm" onClick={() => updateOrderStatus(order.id, order.status)}>
                                                            Update Status
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
