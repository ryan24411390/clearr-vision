"use client";

import { useState, useEffect } from "react";
import {
    Activity,
    Loader2,
    RefreshCw,
    ShoppingBag,
    Package,
    Users,
    Settings,
    Shield,
    Clock,
    Filter,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/components/ui/toast";

interface ActivityLog {
    id: string;
    action: string;
    entity_type: 'order' | 'product' | 'customer' | 'settings' | 'auth';
    entity_id?: string;
    details?: string;
    user_agent?: string;
    ip_address?: string;
    created_at: string;
}

const entityIcons: Record<ActivityLog['entity_type'], React.ReactNode> = {
    order: <ShoppingBag className="h-4 w-4" />,
    product: <Package className="h-4 w-4" />,
    customer: <Users className="h-4 w-4" />,
    settings: <Settings className="h-4 w-4" />,
    auth: <Shield className="h-4 w-4" />,
};

const entityColors: Record<ActivityLog['entity_type'], string> = {
    order: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    product: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    customer: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    settings: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    auth: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const actionLabels: Record<string, string> = {
    login: "Admin Login",
    logout: "Admin Logout",
    order_created: "Order Created",
    order_updated: "Order Updated",
    order_deleted: "Order Deleted",
    order_bulk_updated: "Orders Bulk Updated",
    product_created: "Product Created",
    product_updated: "Product Updated",
    product_deleted: "Product Deleted",
    product_duplicated: "Product Duplicated",
    product_bulk_deleted: "Products Bulk Deleted",
    customer_note_added: "Customer Note Added",
    customer_note_deleted: "Customer Note Deleted",
    settings_updated: "Settings Updated",
    password_changed: "Password Changed",
};

export default function ActivityLogsPage() {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [entityFilter, setEntityFilter] = useState<string>("all");
    const [clearDialogOpen, setClearDialogOpen] = useState(false);
    const [clearing, setClearing] = useState(false);

    const toast = useToast();
    const limit = 20;

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                limit: limit.toString(),
                offset: (page * limit).toString(),
            });

            if (entityFilter && entityFilter !== "all") {
                params.set("entity_type", entityFilter);
            }

            const res = await fetch(`/api/admin/activity-logs?${params}`, {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs);
                setTotal(data.total);
            } else {
                toast.error("Failed to load activity logs");
            }
        } catch {
            toast.error("Failed to load activity logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, entityFilter]);

    const handleClearOldLogs = async () => {
        setClearing(true);
        try {
            const res = await fetch("/api/admin/activity-logs?daysOld=30", {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(`Cleared ${data.deleted} old logs`);
                setClearDialogOpen(false);
                fetchLogs();
            } else {
                toast.error("Failed to clear logs");
            }
        } catch {
            toast.error("Failed to clear logs");
        } finally {
            setClearing(false);
        }
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Activity className="h-8 w-8" />
                        Activity Logs
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track all admin actions and system events
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={fetchLogs}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setClearDialogOpen(true)}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Old Logs
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={entityFilter} onValueChange={setEntityFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Activities</SelectItem>
                                <SelectItem value="order">Orders</SelectItem>
                                <SelectItem value="product">Products</SelectItem>
                                <SelectItem value="customer">Customers</SelectItem>
                                <SelectItem value="settings">Settings</SelectItem>
                                <SelectItem value="auth">Authentication</SelectItem>
                            </SelectContent>
                        </Select>
                        <Badge variant="secondary">{total} total logs</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Activity Logs Table */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>
                        All admin actions are logged for security and auditing purposes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No activity logs found</p>
                            <p className="text-sm">Activity will be recorded as you use the admin panel</p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[180px]">Timestamp</TableHead>
                                            <TableHead className="w-[120px]">Type</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Details</TableHead>
                                            <TableHead className="w-[150px]">Entity ID</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="text-muted-foreground font-mono text-xs">
                                                    {formatDateTime(log.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`${entityColors[log.entity_type]} border-0 gap-1`}
                                                    >
                                                        {entityIcons[log.entity_type]}
                                                        <span className="capitalize">{log.entity_type}</span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {actionLabels[log.action] || log.action}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                                                    {log.details || "-"}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    {log.entity_id ? (
                                                        <span className="truncate block max-w-[130px]" title={log.entity_id}>
                                                            {log.entity_id}
                                                        </span>
                                                    ) : "-"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total} logs
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                                            disabled={page === 0}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            Page {page + 1} of {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                            disabled={page >= totalPages - 1}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Clear Logs Dialog */}
            <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Clear Old Activity Logs</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all activity logs older than 30 days.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={clearing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleClearOldLogs}
                            disabled={clearing}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {clearing ? "Clearing..." : "Clear Old Logs"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
