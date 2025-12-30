"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from "recharts";
import { TrendingUp, Clock, CheckCircle, XCircle, Package, Truck, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Order {
    id: string;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
    items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }>;
}

interface DashboardChartsProps {
    orders: Order[];
}

const STATUS_COLORS: Record<string, string> = {
    pending: '#fbbf24', // amber-400
    confirmed: '#60a5fa', // blue-400
    processing: '#a78bfa', // violet-400
    shipped: '#818cf8', // indigo-400
    delivered: '#4ade80', // green-400
    cancelled: '#f87171', // red-400
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export function DashboardCharts({ orders }: DashboardChartsProps) {
    const analytics = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const daysAgo = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

        // Daily orders for chart (last 30 days)
        const dailyData: { date: string; orders: number; revenue: number }[] = [];
        for (let i = 29; i >= 0; i--) {
            const date = daysAgo(i);
            const dateStr = date.toISOString().split('T')[0];
            const dayOrders = orders.filter(o => {
                const orderDate = new Date(o.created_at).toISOString().split('T')[0];
                return orderDate === dateStr;
            });
            dailyData.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                orders: dayOrders.length,
                revenue: dayOrders.reduce((sum, o) => sum + o.total, 0)
            });
        }

        // Status distribution
        const statusCounts = Object.entries(STATUS_LABELS).map(([value, label]) => ({
            name: label,
            value: orders.filter(o => o.status === value).length,
            color: STATUS_COLORS[value]
        })).filter(s => s.value > 0);

        // Weekly comparison
        const thisWeek = orders.filter(o => new Date(o.created_at) >= daysAgo(7));
        const lastWeek = orders.filter(o => {
            const date = new Date(o.created_at);
            return date >= daysAgo(14) && date < daysAgo(7);
        });

        const thisWeekRevenue = thisWeek.reduce((sum, o) => sum + o.total, 0);
        const lastWeekRevenue = lastWeek.reduce((sum, o) => sum + o.total, 0);
        const revenueGrowth = lastWeekRevenue > 0
            ? Math.round(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100)
            : 0;

        // Top products
        const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].revenue += item.price * item.quantity;
            });
        });
        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Recent orders
        const recentOrders = [...orders]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);

        // Status metrics
        const pendingCount = orders.filter(o => o.status === 'pending').length;
        const processingCount = orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length;
        const shippedCount = orders.filter(o => o.status === 'shipped').length;
        const deliveredCount = orders.filter(o => o.status === 'delivered').length;
        const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

        return {
            dailyData,
            statusCounts,
            thisWeekOrders: thisWeek.length,
            lastWeekOrders: lastWeek.length,
            thisWeekRevenue,
            revenueGrowth,
            topProducts,
            recentOrders,
            pendingCount,
            processingCount,
            shippedCount,
            deliveredCount,
            cancelledCount
        };
    }, [orders]);

    const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Status Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <div>
                                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{analytics.pendingCount}</p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-500">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <Package className="h-8 w-8 text-purple-600" />
                            <div>
                                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{analytics.processingCount}</p>
                                <p className="text-xs text-purple-600 dark:text-purple-500">Processing</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <Truck className="h-8 w-8 text-indigo-600" />
                            <div>
                                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{analytics.shippedCount}</p>
                                <p className="text-xs text-indigo-600 dark:text-indigo-500">Shipped</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{analytics.deliveredCount}</p>
                                <p className="text-xs text-green-600 dark:text-green-500">Delivered</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <XCircle className="h-8 w-8 text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-400">{analytics.cancelledCount}</p>
                                <p className="text-xs text-red-600 dark:text-red-500">Cancelled</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Performance */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">This Week Orders</p>
                                <p className="text-3xl font-bold">{analytics.thisWeekOrders}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    vs {analytics.lastWeekOrders} last week
                                </p>
                            </div>
                            <div className={`text-right ${analytics.thisWeekOrders >= analytics.lastWeekOrders ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className={`h-6 w-6 ${analytics.thisWeekOrders < analytics.lastWeekOrders ? 'rotate-180' : ''}`} />
                                <p className="text-sm font-medium">
                                    {analytics.thisWeekOrders >= analytics.lastWeekOrders ? '+' : ''}
                                    {analytics.thisWeekOrders - analytics.lastWeekOrders}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">This Week Revenue</p>
                                <p className="text-3xl font-bold">{formatCurrency(analytics.thisWeekRevenue)}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {analytics.revenueGrowth >= 0 ? '+' : ''}{analytics.revenueGrowth}% from last week
                                </p>
                            </div>
                            <div className={`text-right ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp className={`h-6 w-6 ${analytics.revenueGrowth < 0 ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Orders Trend */}
                <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Order Velocity</CardTitle>
                        <CardDescription>Daily order volume over the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.dailyData}>
                                    <defs>
                                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--popover))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--popover-foreground))',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorOrders)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Chart */}
                <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
                        <CardDescription>Daily revenue performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${formatCurrency(value as number)}`, 'Revenue']}
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--popover))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--popover-foreground))',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        fill="#10b981"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Status Distribution */}
                <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Order Status Distribution</CardTitle>
                        <CardDescription>Current state of all orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full flex items-center justify-center">
                            {analytics.statusCounts.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.statusCounts}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {analytics.statusCounts.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name) => [value as number, name as string]}
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--popover))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                                color: 'hsl(var(--popover-foreground))',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        />
                                        <Legend
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            align="center"
                                            iconType="circle"
                                            wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground text-sm">No orders yet</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Top Performing Products</CardTitle>
                        <CardDescription>Best sellers by revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {analytics.topProducts.length > 0 ? (
                            <div className="space-y-4">
                                {analytics.topProducts.map((product, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0
                                            ${idx === 0 ? 'bg-amber-100/50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                                                idx === 1 ? 'bg-slate-100/50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300' :
                                                    idx === 2 ? 'bg-orange-100/50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                                                        'bg-muted/50 text-muted-foreground'}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate text-foreground">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.quantity} sold</p>
                                        </div>
                                        <span className="font-mono text-sm font-medium">{formatCurrency(product.revenue)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                                No products sold yet
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
                                <CardDescription>Latest orders received</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {analytics.recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {analytics.recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between gap-3 group">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-mono text-xs font-medium bg-muted/50 px-1.5 py-0.5 rounded text-foreground">
                                                    {order.order_number}
                                                </p>
                                                <span className={`h-2 w-2 rounded-full ${STATUS_COLORS[order.status] ? `bg-[${STATUS_COLORS[order.status]}]` : 'bg-gray-400'}`} style={{ backgroundColor: STATUS_COLORS[order.status] }} />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(order.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-sm">{formatCurrency(order.total)}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{order.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                                No orders yet
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
