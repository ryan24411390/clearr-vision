import { supabaseAdmin } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

export const revalidate = 0; // Disable static optimization to get fresh data

export default async function AdminDashboard() {
    // Fetch all orders for analytics
    const { data: orders, count: ordersCount } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    // Calculate stats
    const allOrders = orders || [];
    const totalRevenue = allOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((acc, order) => acc + (order.total || 0), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = allOrders.filter(o => new Date(o.created_at) >= today).length;

    const avgOrderValue = allOrders.length > 0
        ? Math.round(totalRevenue / allOrders.filter(o => o.status !== 'cancelled').length)
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Last updated: {new Date().toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>

            {/* Main Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Lifetime
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ordersCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All time orders
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Today&apos;s Orders</CardTitle>
                        <Calendar className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Orders placed today
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Order Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Per verified order
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <DashboardCharts orders={allOrders} />
        </div>
    );
}
