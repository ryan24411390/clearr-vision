import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Users, Search, ShoppingBag, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyableInfo } from "@/components/ui/copyable-info";

export const revalidate = 0;

export default async function CustomersPage() {
    const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('*');

    type CustomerStats = {
        name: string;
        phone: string;
        totalOrders: number;
        totalSpent: number;
        lastOrderDate: string;
    };

    const customersMap = new Map<string, CustomerStats>();

    orders?.forEach(order => {
        const phone = order.customer_phone;
        if (!phone) return;

        if (!customersMap.has(phone)) {
            customersMap.set(phone, {
                name: order.customer_name || 'Guest',
                phone: phone,
                totalOrders: 0,
                totalSpent: 0,
                lastOrderDate: order.created_at
            });
        }

        const customer = customersMap.get(phone)!;
        customer.totalOrders += 1;
        customer.totalSpent += (order.total || 0);
        if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
            customer.lastOrderDate = order.created_at;
        }
    });

    const customers = Array.from(customersMap.values())
        .sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime());

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Analytics derived from {orders?.length || 0} orders
                    </p>
                </div>
            </div>

            {customers.length === 0 ? (
                <Card className="p-12 text-center text-muted-foreground border-dashed bg-card/50 flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-muted/50 mb-4 opacity-50">
                        <Users className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No customers found</h3>
                    <p className="max-w-sm">
                        Customer data will appear here once you receive your first order.
                    </p>
                </Card>
            ) : (
                <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="text-right">Total Orders</TableHead>
                                <TableHead className="text-right">Total Spent</TableHead>
                                <TableHead className="text-right">Last Order</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.phone} className="hover:bg-muted/30">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-border">
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                                    {customer.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{customer.name}</span>
                                                <div className="sm:hidden">
                                                    <CopyableInfo
                                                        value={customer.phone}
                                                        variant="minimal"
                                                        className="text-xs text-muted-foreground"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <CopyableInfo
                                            value={customer.phone}
                                            variant="minimal"
                                            className="font-mono text-sm text-muted-foreground"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="secondary" className="font-mono">
                                            {customer.totalOrders}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(customer.totalSpent)}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-sm">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Calendar className="h-3 w-3 opacity-70" />
                                            {new Date(customer.lastOrderDate).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}
