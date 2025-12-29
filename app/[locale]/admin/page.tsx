"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Loader2, Lock, LogOut, Package, Eye, EyeOff, RefreshCw } from "lucide-react";

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
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const toast = useToast();

    const fetchOrders = useCallback(async () => {
        setOrdersLoading(true);
        try {
            const res = await fetch(`/api/orders?status=${selectedStatus}`, {
                credentials: 'include',
                headers: {
                    'x-admin-token': document.cookie.match(/admin_token=([^;]+)/)?.[1] || ''
                }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            } else if (res.status === 401) {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error("Failed to fetch orders");
        } finally {
            setOrdersLoading(false);
        }
    }, [selectedStatus, toast]);

    // Check if already authenticated
    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch('/api/admin/auth', {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.authenticated) {
                        setIsAuthenticated(true);
                    }
                }
            } catch {
                // Not authenticated
            } finally {
                setIsLoading(false);
            }
        }
        checkAuth();
    }, []);

    // Fetch orders when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, fetchOrders]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoginLoading(true);

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
                credentials: 'include',
            });

            if (res.ok) {
                setIsAuthenticated(true);
                setPassword("");
                toast.success("Login successful");
            } else {
                toast.error("Invalid password");
            }
        } catch {
            toast.error("Login failed");
        } finally {
            setLoginLoading(false);
        }
    }

    async function handleLogout() {
        await fetch('/api/admin/auth', {
            method: 'DELETE',
            credentials: 'include'
        });
        setIsAuthenticated(false);
        setOrders([]);
        toast.success("Logged out");
    }

    async function updateOrderStatus(orderId: string, newStatus: string) {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': document.cookie.match(/admin_token=([^;]+)/)?.[1] || ''
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
        return statusOption || { value: status, label: status, color: 'bg-gray-100 text-gray-800' };
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container max-w-md py-20">
                <Card>
                    <CardHeader className="text-center">
                        <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <CardTitle className="text-2xl">Admin Access</CardTitle>
                        <p className="text-muted-foreground">Enter password to continue</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter admin password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loginLoading || !password}>
                                {loginLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <div className="container py-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <Package className="h-8 w-8" />
                    <h1 className="text-2xl sm:text-3xl font-bold">Orders Dashboard</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchOrders} disabled={ordersLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <Button
                    variant={selectedStatus === 'all' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus('all')}
                >
                    All
                </Button>
                {STATUS_OPTIONS.map((status) => (
                    <Button
                        key={status.value}
                        variant={selectedStatus === status.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedStatus(status.value)}
                    >
                        {status.label}
                    </Button>
                ))}
            </div>

            {/* Orders Count */}
            <p className="text-sm text-muted-foreground mb-4">
                {orders.length} order{orders.length !== 1 ? 's' : ''} found
            </p>

            {/* Orders List */}
            <div className="space-y-4">
                {ordersLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground">
                        No orders found
                    </Card>
                ) : (
                    orders.map((order) => {
                        const statusBadge = getStatusBadge(order.status);
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <Card key={order.id} className="overflow-hidden">
                                <div
                                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-mono text-sm font-medium">{order.order_number}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge.color}`}>
                                                    {statusBadge.label}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {order.order_type === 'cart' ? '(Cart)' : '(Direct)'}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold">{order.customer_name}</h3>
                                            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                                        </div>

                                        <div className="text-right space-y-1">
                                            <p className="text-lg font-bold">৳{order.total.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(order.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t bg-muted/30 p-4 space-y-4">
                                        {/* Customer Details */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium mb-2">Customer Details</h4>
                                                <div className="text-sm space-y-1">
                                                    <p><span className="text-muted-foreground">Name:</span> {order.customer_name}</p>
                                                    <p><span className="text-muted-foreground">Phone:</span> {order.customer_phone}</p>
                                                    <p><span className="text-muted-foreground">Address:</span> {order.customer_address}</p>
                                                    {order.customer_city && (
                                                        <p><span className="text-muted-foreground">City:</span> {order.customer_city}</p>
                                                    )}
                                                    {order.customer_area && (
                                                        <p><span className="text-muted-foreground">Area:</span> {order.customer_area}</p>
                                                    )}
                                                    {order.delivery_location && (
                                                        <p><span className="text-muted-foreground">Delivery:</span> {order.delivery_location}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Summary */}
                                            <div>
                                                <h4 className="font-medium mb-2">Order Summary</h4>
                                                <div className="text-sm space-y-1">
                                                    <p><span className="text-muted-foreground">Subtotal:</span> ৳{order.subtotal.toLocaleString()}</p>
                                                    <p><span className="text-muted-foreground">Delivery:</span> ৳{order.delivery_charge.toLocaleString()}</p>
                                                    <p className="font-medium"><span className="text-muted-foreground">Total:</span> ৳{order.total.toLocaleString()}</p>
                                                    <p><span className="text-muted-foreground">Payment:</span> {order.payment_method}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div>
                                            <h4 className="font-medium mb-2">Items</h4>
                                            <div className="space-y-2">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm bg-background p-2 rounded">
                                                        <div>
                                                            <span className="font-medium">{item.name}</span>
                                                            <span className="text-muted-foreground"> x{item.quantity}</span>
                                                            {item.variant?.color && (
                                                                <span className="text-muted-foreground"> ({item.variant.color})</span>
                                                            )}
                                                            {item.variant?.power && (
                                                                <span className="text-muted-foreground"> - {item.variant.power}</span>
                                                            )}
                                                        </div>
                                                        <span>৳{(item.price * item.quantity).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status Update */}
                                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                                            <span className="text-sm font-medium">Update Status:</span>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className="text-sm border rounded px-2 py-1 bg-background"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {STATUS_OPTIONS.map((status) => (
                                                    <option key={status.value} value={status.value}>
                                                        {status.label}
                                                    </option>
                                                ))}
                                            </select>
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
