"use client";

import { useState } from "react";
import { ArrowLeft, Phone, MapPin, ShoppingBag, Calendar, Clock, Plus, Trash2, User, Send, Package, CreditCard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
import { Link, useRouter } from "@/lib/navigation";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
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
    order_type: 'direct' | 'cart';
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    items: OrderItem[];
    subtotal: number;
    delivery_charge: number;
    total: number;
    payment_method: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    notes: string | null;
    created_at: string;
}

interface CustomerNote {
    id: string;
    customer_phone: string;
    note: string;
    created_by: string;
    created_at: string;
}

interface Customer {
    phone: string;
    name: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    firstOrderDate: string;
    addresses: string[];
    notes?: CustomerNote[];
    orders?: Order[];
}

interface CustomerDetailClientProps {
    customer: Customer;
}

const statusColors: Record<Order['status'], string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    processing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function CustomerDetailClient({ customer: initialCustomer }: CustomerDetailClientProps) {
    const [customer, setCustomer] = useState(initialCustomer);
    const [newNote, setNewNote] = useState("");
    const [addingNote, setAddingNote] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<CustomerNote | null>(null);
    const [deletingNote, setDeletingNote] = useState(false);

    const router = useRouter();
    const toast = useToast();

    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        setAddingNote(true);
        try {
            const res = await fetch(`/api/customers/${encodeURIComponent(customer.phone)}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ note: newNote.trim() }),
            });

            if (res.ok) {
                const data = await res.json();
                setCustomer(prev => ({
                    ...prev,
                    notes: [data.note, ...(prev.notes || [])],
                }));
                setNewNote("");
                toast.success("Note added successfully");
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to add note");
            }
        } catch {
            toast.error("Failed to add note");
        } finally {
            setAddingNote(false);
        }
    };

    const handleDeleteNote = async () => {
        if (!noteToDelete) return;

        setDeletingNote(true);
        try {
            const res = await fetch(`/api/customers/${encodeURIComponent(customer.phone)}/notes?noteId=${noteToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                setCustomer(prev => ({
                    ...prev,
                    notes: prev.notes?.filter(n => n.id !== noteToDelete.id) || [],
                }));
                toast.success("Note deleted");
                setNoteToDelete(null);
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to delete note");
            }
        } catch {
            toast.error("Failed to delete note");
        } finally {
            setDeletingNote(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">Customer Details</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        View customer information, order history, and notes
                    </p>
                </div>
            </div>

            {/* Customer Info Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <Avatar className="h-20 w-20 mx-auto border-4 border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                {customer.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="mt-4">{customer.name}</CardTitle>
                        <CardDescription>Customer since {formatDate(customer.firstOrderDate)}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <CopyableInfo value={customer.phone} className="font-mono" />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 rounded-lg bg-muted/50">
                                <div className="text-2xl font-bold text-primary">{customer.totalOrders}</div>
                                <div className="text-xs text-muted-foreground">Total Orders</div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <div className="text-2xl font-bold text-green-600">{formatCurrency(customer.totalSpent)}</div>
                                <div className="text-xs text-muted-foreground">Total Spent</div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Last Order:</span>
                                <span className="font-medium">{formatDate(customer.lastOrderDate)}</span>
                            </div>
                        </div>

                        {customer.addresses.length > 0 && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>Delivery Addresses</span>
                                    </div>
                                    {customer.addresses.map((address, index) => (
                                        <div key={index} className="text-sm p-2 rounded bg-muted/50">
                                            {address}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Notes Section */}
                <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Customer Notes
                                </CardTitle>
                                <CardDescription>
                                    Internal notes about this customer
                                </CardDescription>
                            </div>
                            <Badge variant="secondary">{customer.notes?.length || 0} notes</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Add Note Form */}
                        <div className="flex gap-2">
                            <Textarea
                                placeholder="Add a note about this customer..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={2}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleAddNote}
                                disabled={addingNote || !newNote.trim()}
                                className="self-end"
                            >
                                {addingNote ? (
                                    "Adding..."
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-1" />
                                        Add
                                    </>
                                )}
                            </Button>
                        </div>

                        <Separator />

                        {/* Notes List */}
                        {customer.notes && customer.notes.length > 0 ? (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {customer.notes.map((note) => (
                                    <div key={note.id} className="p-4 rounded-lg bg-muted/50 group">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-sm whitespace-pre-wrap flex-1">{note.note}</p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                                onClick={() => setNoteToDelete(note)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                            <User className="h-3 w-3" />
                                            <span>{note.created_by}</span>
                                            <span>•</span>
                                            <Clock className="h-3 w-3" />
                                            <span>{formatDateTime(note.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No notes yet</p>
                                <p className="text-xs">Add a note to keep track of important information</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order History */}
            <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                Order History
                            </CardTitle>
                            <CardDescription>
                                All orders placed by this customer
                            </CardDescription>
                        </div>
                        <Badge variant="secondary">{customer.orders?.length || 0} orders</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {customer.orders && customer.orders.length > 0 ? (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Order #</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="w-[100px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customer.orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono font-medium">
                                                {order.order_number}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDate(order.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                    <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={`${statusColors[order.status]} uppercase text-[10px] tracking-wider font-semibold border-0`}
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono font-medium">
                                                {formatCurrency(order.total)}
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/admin/orders?highlight=${order.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        View
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No orders yet</p>
                            <p className="text-sm">This customer hasn&apos;t placed any orders</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Note Confirmation */}
            <AlertDialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this note? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deletingNote}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteNote}
                            disabled={deletingNote}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deletingNote ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
