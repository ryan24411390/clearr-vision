"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
    Loader2, Package, RefreshCw, Search, ChevronDown, ChevronUp, Download, Truck,
    CheckCircle2, XCircle, Clock, AlertCircle, Trash2, Printer, StickyNote, Save
} from "lucide-react";
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
    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
    const [bulkStatus, setBulkStatus] = useState("");
    const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
    const [editingNotes, setEditingNotes] = useState<string | null>(null);
    const [notesText, setNotesText] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);
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

    const filteredOrders = useMemo(() => {
        let result = orders;

        if (selectedStatus !== 'all') {
            result = result.filter(o => o.status === selectedStatus);
        }

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

    function exportToCSV() {
        if (filteredOrders.length === 0) {
            toast.error("No orders to export");
            return;
        }

        const headers = [
            'Order Number', 'Date', 'Customer Name', 'Phone', 'Address', 'City',
            'Items', 'Subtotal', 'Delivery', 'Total', 'Status', 'Payment Method', 'Notes'
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
            order.payment_method,
            `"${(order.notes || '').replace(/"/g, '""')}"`
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
                headers: { 'Content-Type': 'application/json' },
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

    async function deleteOrderHandler() {
        if (!deleteOrderId) return;

        try {
            const res = await fetch(`/api/orders/${deleteOrderId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                toast.success("Order deleted");
                setDeleteOrderId(null);
                fetchOrders();
            } else {
                toast.error("Failed to delete order");
            }
        } catch {
            toast.error("Failed to delete order");
        }
    }

    async function bulkUpdateHandler() {
        if (selectedOrders.size === 0 || !bulkStatus) {
            toast.error("Select orders and status");
            return;
        }

        try {
            const res = await fetch('/api/orders/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ids: Array.from(selectedOrders),
                    status: bulkStatus
                }),
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(`Updated ${data.updated} orders`);
                setSelectedOrders(new Set());
                setBulkStatus("");
                fetchOrders();
            } else {
                toast.error("Failed to update orders");
            }
        } catch {
            toast.error("Failed to update orders");
        }
    }

    async function saveNotes(orderId: string) {
        setSavingNotes(true);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: notesText || null }),
                credentials: 'include',
            });

            if (res.ok) {
                toast.success("Notes saved");
                setEditingNotes(null);
                fetchOrders();
            } else {
                toast.error("Failed to save notes");
            }
        } catch {
            toast.error("Failed to save notes");
        } finally {
            setSavingNotes(false);
        }
    }

    function printInvoice(order: Order) {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error("Please allow popups to print invoice");
            return;
        }

        const invoiceHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - ${order.order_number}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .header p { margin: 5px 0; color: #666; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                    .info-box { background: #f9f9f9; padding: 15px; border-radius: 8px; }
                    .info-box h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; }
                    .info-box p { margin: 5px 0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background: #f5f5f5; font-weight: 600; }
                    .totals { text-align: right; }
                    .totals p { margin: 5px 0; }
                    .totals .total { font-size: 18px; font-weight: bold; color: #2563eb; }
                    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Smart Reading</h1>
                    <p>Invoice / Receipt</p>
                </div>
                <div class="info-grid">
                    <div class="info-box">
                        <h3>Order Details</h3>
                        <p><strong>Order:</strong> ${order.order_number}</p>
                        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                        <p><strong>Payment:</strong> ${order.payment_method}</p>
                    </div>
                    <div class="info-box">
                        <h3>Customer Details</h3>
                        <p><strong>Name:</strong> ${order.customer_name}</p>
                        <p><strong>Phone:</strong> ${order.customer_phone}</p>
                        <p><strong>Address:</strong> ${order.customer_address}</p>
                        ${order.customer_city ? `<p><strong>City:</strong> ${order.customer_city}</p>` : ''}
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Variant</th>
                            <th>Qty</th>
                            <th style="text-align: right;">Price</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map((item, idx) => `
                            <tr>
                                <td>${idx + 1}</td>
                                <td>${item.name}</td>
                                <td>${[item.variant?.color, item.variant?.power].filter(Boolean).join(', ') || '-'}</td>
                                <td>${item.quantity}</td>
                                <td style="text-align: right;">&#2547;${item.price}</td>
                                <td style="text-align: right;">&#2547;${item.price * item.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="totals">
                    <p>Subtotal: &#2547;${order.subtotal}</p>
                    <p>Delivery: &#2547;${order.delivery_charge}</p>
                    <p class="total">Total: &#2547;${order.total}</p>
                </div>
                ${order.notes ? `<div style="background: #fff3cd; padding: 10px; border-radius: 4px; margin-top: 20px;"><strong>Notes:</strong> ${order.notes}</div>` : ''}
                <div class="footer">
                    <p>Thank you for shopping with Smart Reading!</p>
                    <p>For any queries, contact us at: +880 1XXX-XXXXXX</p>
                </div>
                <script>window.print(); window.onafterprint = function() { window.close(); }</script>
            </body>
            </html>
        `;

        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
    }

    function toggleOrderSelection(orderId: string) {
        const newSelected = new Set(selectedOrders);
        if (newSelected.has(orderId)) {
            newSelected.delete(orderId);
        } else {
            newSelected.add(orderId);
        }
        setSelectedOrders(newSelected);
    }

    function toggleAllOrders() {
        if (selectedOrders.size === filteredOrders.length) {
            setSelectedOrders(new Set());
        } else {
            setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
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

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: orders.length };
        STATUS_OPTIONS.forEach(status => {
            counts[status.value] = orders.filter(o => o.status === status.value).length;
        });
        return counts;
    }, [orders]);

    return (
        <div className="space-y-6">
            <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The order will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteOrderHandler} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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

            {selectedOrders.size > 0 && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-sm font-medium">
                            {selectedOrders.size} order{selectedOrders.size !== 1 ? 's' : ''} selected
                        </span>
                        <select
                            value={bulkStatus}
                            onChange={(e) => setBulkStatus(e.target.value)}
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                        >
                            <option value="">Select status...</option>
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        <Button size="sm" onClick={bulkUpdateHandler} disabled={!bulkStatus}>
                            Update Selected
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedOrders(new Set())}>
                            Clear Selection
                        </Button>
                    </div>
                </Card>
            )}

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-2 rounded-lg border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Checkbox
                        checked={filteredOrders.length > 0 && selectedOrders.size === filteredOrders.length}
                        onCheckedChange={toggleAllOrders}
                    />
                    <div className="relative flex-1 md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by order #, name, phone, or address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background/50 border-none focus-visible:ring-1"
                        />
                    </div>
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

            <div className="space-y-4" ref={printRef}>
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
                        const isSelected = selectedOrders.has(order.id);

                        return (
                            <Card key={order.id} className={`overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-200 hover:shadow-md group ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                                <div className="p-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleOrderSelection(order.id)}
                                                className="mt-2"
                                            />
                                            <div
                                                className="flex items-start gap-4 flex-1 cursor-pointer"
                                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                            >
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
                                                        {order.notes && (
                                                            <Badge variant="outline" className="text-[10px] px-1.5 h-5 bg-yellow-50 border-yellow-200 text-yellow-700">
                                                                <StickyNote className="h-3 w-3 mr-1" />
                                                                Note
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
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pl-11 md:pl-0">
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-primary">{formatCurrency(order.total)}</p>
                                                <p className="text-xs text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => printInvoice(order)}
                                                    title="Print Invoice"
                                                >
                                                    <Printer className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => setDeleteOrderId(order.id)}
                                                    title="Delete Order"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                >
                                                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-border/50 bg-muted/20 p-6 animate-in slide-in-from-top-2 duration-200">
                                        <div className="grid lg:grid-cols-3 gap-6">
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

                                                <div className="pt-4 border-t border-border/50">
                                                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-3">
                                                        <StickyNote className="h-3 w-3" /> Order Notes
                                                    </h4>
                                                    {editingNotes === order.id ? (
                                                        <div className="space-y-2">
                                                            <Textarea
                                                                value={notesText}
                                                                onChange={(e) => setNotesText(e.target.value)}
                                                                placeholder="Add notes about this order..."
                                                                rows={3}
                                                                className="text-sm"
                                                            />
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => saveNotes(order.id)}
                                                                    disabled={savingNotes}
                                                                >
                                                                    {savingNotes ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                                                                    Save
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => setEditingNotes(null)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="p-3 bg-background/50 rounded-md text-sm cursor-pointer hover:bg-background/80 transition-colors min-h-[60px]"
                                                            onClick={() => {
                                                                setEditingNotes(order.id);
                                                                setNotesText(order.notes || '');
                                                            }}
                                                        >
                                                            {order.notes || <span className="text-muted-foreground italic">Click to add notes...</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

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
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => printInvoice(order)}
                                                    >
                                                        <Printer className="h-4 w-4 mr-2" />
                                                        Print Invoice
                                                    </Button>
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
