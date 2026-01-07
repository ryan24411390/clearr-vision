"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import {
    Loader2,
    Save,
    Store,
    Truck,
    CreditCard,
    Bell,
    Plus,
    X,
    RefreshCw,
    Settings as SettingsIcon,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react";

interface StoreSettings {
    store_name_en: string;
    store_name_bn: string;
    store_email: string;
    store_phone: string;
    store_address_en: string;
    store_address_bn: string;
    facebook_url?: string;
    instagram_url?: string;
    whatsapp_number?: string;
}

interface DeliverySettings {
    inside_dhaka_charge: number;
    outside_dhaka_charge: number;
    free_delivery_threshold: number;
    delivery_areas: string[];
}

interface PaymentSettings {
    cod_enabled: boolean;
    bkash_enabled: boolean;
    bkash_number?: string;
    nagad_enabled: boolean;
    nagad_number?: string;
    bank_transfer_enabled: boolean;
    bank_name?: string;
    bank_account_name?: string;
    bank_account_number?: string;
}

interface NotificationSettings {
    order_notification_email: string;
    sms_notifications_enabled: boolean;
    email_notifications_enabled: boolean;
}

interface Settings {
    store: StoreSettings;
    delivery: DeliverySettings;
    payment: PaymentSettings;
    notifications: NotificationSettings;
    updated_at: string;
}

export default function SettingsPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [newArea, setNewArea] = useState("");

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setSettings(data.settings);
            } else {
                toast.error("Failed to load settings");
            }
        } catch {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);

        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    store: settings.store,
                    delivery: settings.delivery,
                    payment: settings.payment,
                    notifications: settings.notifications,
                }),
                credentials: "include",
            });

            if (res.ok) {
                toast.success("Settings saved successfully!");
                const data = await res.json();
                setSettings(data.settings);
            } else {
                toast.error("Failed to save settings");
            }
        } catch {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const updateStore = (updates: Partial<StoreSettings>) => {
        if (!settings) return;
        setSettings({ ...settings, store: { ...settings.store, ...updates } });
    };

    const updateDelivery = (updates: Partial<DeliverySettings>) => {
        if (!settings) return;
        setSettings({ ...settings, delivery: { ...settings.delivery, ...updates } });
    };

    const updatePayment = (updates: Partial<PaymentSettings>) => {
        if (!settings) return;
        setSettings({ ...settings, payment: { ...settings.payment, ...updates } });
    };

    const updateNotifications = (updates: Partial<NotificationSettings>) => {
        if (!settings) return;
        setSettings({ ...settings, notifications: { ...settings.notifications, ...updates } });
    };

    const addDeliveryArea = () => {
        if (!settings || !newArea.trim()) return;
        if (!settings.delivery.delivery_areas.includes(newArea.trim())) {
            updateDelivery({
                delivery_areas: [...settings.delivery.delivery_areas, newArea.trim()]
            });
        }
        setNewArea("");
    };

    const removeDeliveryArea = (area: string) => {
        if (!settings) return;
        updateDelivery({
            delivery_areas: settings.delivery.delivery_areas.filter(a => a !== area)
        });
    };

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setChangingPassword(true);
        try {
            const res = await fetch("/api/admin/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
                credentials: "include",
            });

            if (res.ok) {
                toast.success("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to change password");
            }
        } catch {
            toast.error("Failed to change password");
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-muted-foreground">Failed to load settings</p>
                <Button onClick={fetchSettings}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <SettingsIcon className="h-8 w-8" />
                        Settings
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your store configuration and preferences
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Store Information */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="h-5 w-5" />
                            Store Information
                        </CardTitle>
                        <CardDescription>
                            Basic information about your store
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="store_name_en">Store Name (English)</Label>
                                <Input
                                    id="store_name_en"
                                    value={settings.store.store_name_en}
                                    onChange={(e) => updateStore({ store_name_en: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store_name_bn">Store Name (Bengali)</Label>
                                <Input
                                    id="store_name_bn"
                                    value={settings.store.store_name_bn}
                                    onChange={(e) => updateStore({ store_name_bn: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="store_email">Email</Label>
                                <Input
                                    id="store_email"
                                    type="email"
                                    value={settings.store.store_email}
                                    onChange={(e) => updateStore({ store_email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store_phone">Phone</Label>
                                <Input
                                    id="store_phone"
                                    value={settings.store.store_phone}
                                    onChange={(e) => updateStore({ store_phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="store_address_en">Address (English)</Label>
                            <Textarea
                                id="store_address_en"
                                value={settings.store.store_address_en}
                                onChange={(e) => updateStore({ store_address_en: e.target.value })}
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="store_address_bn">Address (Bengali)</Label>
                            <Textarea
                                id="store_address_bn"
                                value={settings.store.store_address_bn}
                                onChange={(e) => updateStore({ store_address_bn: e.target.value })}
                                rows={2}
                            />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label htmlFor="facebook_url">Facebook URL</Label>
                            <Input
                                id="facebook_url"
                                value={settings.store.facebook_url || ""}
                                onChange={(e) => updateStore({ facebook_url: e.target.value })}
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instagram_url">Instagram URL</Label>
                            <Input
                                id="instagram_url"
                                value={settings.store.instagram_url || ""}
                                onChange={(e) => updateStore({ instagram_url: e.target.value })}
                                placeholder="https://instagram.com/yourpage"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                            <Input
                                id="whatsapp_number"
                                value={settings.store.whatsapp_number || ""}
                                onChange={(e) => updateStore({ whatsapp_number: e.target.value })}
                                placeholder="+880 1XXX-XXXXXX"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Settings */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Delivery Settings
                        </CardTitle>
                        <CardDescription>
                            Configure delivery charges and areas
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="inside_dhaka_charge">Inside Dhaka (BDT)</Label>
                                <Input
                                    id="inside_dhaka_charge"
                                    type="number"
                                    min="0"
                                    value={settings.delivery.inside_dhaka_charge}
                                    onChange={(e) => updateDelivery({ inside_dhaka_charge: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="outside_dhaka_charge">Outside Dhaka (BDT)</Label>
                                <Input
                                    id="outside_dhaka_charge"
                                    type="number"
                                    min="0"
                                    value={settings.delivery.outside_dhaka_charge}
                                    onChange={(e) => updateDelivery({ outside_dhaka_charge: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="free_delivery_threshold">Free Delivery Threshold (BDT)</Label>
                            <Input
                                id="free_delivery_threshold"
                                type="number"
                                min="0"
                                value={settings.delivery.free_delivery_threshold}
                                onChange={(e) => updateDelivery({ free_delivery_threshold: parseFloat(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Set to 0 to disable free delivery
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Delivery Areas</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newArea}
                                    onChange={(e) => setNewArea(e.target.value)}
                                    placeholder="Add new area"
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDeliveryArea())}
                                />
                                <Button type="button" onClick={addDeliveryArea} variant="secondary">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {settings.delivery.delivery_areas.map((area) => (
                                    <Badge key={area} variant="secondary" className="gap-1">
                                        {area}
                                        <button
                                            onClick={() => removeDeliveryArea(area)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Settings */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Methods
                        </CardTitle>
                        <CardDescription>
                            Configure available payment options
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* COD */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="cod_enabled"
                                    checked={settings.payment.cod_enabled}
                                    onCheckedChange={(checked) => updatePayment({ cod_enabled: checked === true })}
                                />
                                <div>
                                    <Label htmlFor="cod_enabled" className="font-medium cursor-pointer">
                                        Cash on Delivery
                                    </Label>
                                    <p className="text-xs text-muted-foreground">Accept cash payment upon delivery</p>
                                </div>
                            </div>
                            <Badge variant={settings.payment.cod_enabled ? "default" : "secondary"}>
                                {settings.payment.cod_enabled ? "Enabled" : "Disabled"}
                            </Badge>
                        </div>

                        {/* bKash */}
                        <div className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="bkash_enabled"
                                        checked={settings.payment.bkash_enabled}
                                        onCheckedChange={(checked) => updatePayment({ bkash_enabled: checked === true })}
                                    />
                                    <div>
                                        <Label htmlFor="bkash_enabled" className="font-medium cursor-pointer">
                                            bKash
                                        </Label>
                                        <p className="text-xs text-muted-foreground">Accept bKash mobile payments</p>
                                    </div>
                                </div>
                                <Badge variant={settings.payment.bkash_enabled ? "default" : "secondary"}>
                                    {settings.payment.bkash_enabled ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>
                            {settings.payment.bkash_enabled && (
                                <div className="space-y-2 pl-7">
                                    <Label htmlFor="bkash_number">bKash Number</Label>
                                    <Input
                                        id="bkash_number"
                                        value={settings.payment.bkash_number || ""}
                                        onChange={(e) => updatePayment({ bkash_number: e.target.value })}
                                        placeholder="01XXXXXXXXX"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Nagad */}
                        <div className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="nagad_enabled"
                                        checked={settings.payment.nagad_enabled}
                                        onCheckedChange={(checked) => updatePayment({ nagad_enabled: checked === true })}
                                    />
                                    <div>
                                        <Label htmlFor="nagad_enabled" className="font-medium cursor-pointer">
                                            Nagad
                                        </Label>
                                        <p className="text-xs text-muted-foreground">Accept Nagad mobile payments</p>
                                    </div>
                                </div>
                                <Badge variant={settings.payment.nagad_enabled ? "default" : "secondary"}>
                                    {settings.payment.nagad_enabled ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>
                            {settings.payment.nagad_enabled && (
                                <div className="space-y-2 pl-7">
                                    <Label htmlFor="nagad_number">Nagad Number</Label>
                                    <Input
                                        id="nagad_number"
                                        value={settings.payment.nagad_number || ""}
                                        onChange={(e) => updatePayment({ nagad_number: e.target.value })}
                                        placeholder="01XXXXXXXXX"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Bank Transfer */}
                        <div className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="bank_transfer_enabled"
                                        checked={settings.payment.bank_transfer_enabled}
                                        onCheckedChange={(checked) => updatePayment({ bank_transfer_enabled: checked === true })}
                                    />
                                    <div>
                                        <Label htmlFor="bank_transfer_enabled" className="font-medium cursor-pointer">
                                            Bank Transfer
                                        </Label>
                                        <p className="text-xs text-muted-foreground">Accept bank transfers</p>
                                    </div>
                                </div>
                                <Badge variant={settings.payment.bank_transfer_enabled ? "default" : "secondary"}>
                                    {settings.payment.bank_transfer_enabled ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>
                            {settings.payment.bank_transfer_enabled && (
                                <div className="space-y-3 pl-7">
                                    <div className="space-y-2">
                                        <Label htmlFor="bank_name">Bank Name</Label>
                                        <Input
                                            id="bank_name"
                                            value={settings.payment.bank_name || ""}
                                            onChange={(e) => updatePayment({ bank_name: e.target.value })}
                                            placeholder="e.g., Dutch-Bangla Bank"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bank_account_name">Account Name</Label>
                                        <Input
                                            id="bank_account_name"
                                            value={settings.payment.bank_account_name || ""}
                                            onChange={(e) => updatePayment({ bank_account_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bank_account_number">Account Number</Label>
                                        <Input
                                            id="bank_account_number"
                                            value={settings.payment.bank_account_number || ""}
                                            onChange={(e) => updatePayment({ bank_account_number: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            Configure notification preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="order_notification_email">Order Notification Email</Label>
                            <Input
                                id="order_notification_email"
                                type="email"
                                value={settings.notifications.order_notification_email}
                                onChange={(e) => updateNotifications({ order_notification_email: e.target.value })}
                                placeholder="admin@example.com"
                            />
                            <p className="text-xs text-muted-foreground">
                                Receive order notifications at this email
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="email_notifications_enabled"
                                        checked={settings.notifications.email_notifications_enabled}
                                        onCheckedChange={(checked) => updateNotifications({ email_notifications_enabled: checked === true })}
                                    />
                                    <div>
                                        <Label htmlFor="email_notifications_enabled" className="font-medium cursor-pointer">
                                            Email Notifications
                                        </Label>
                                        <p className="text-xs text-muted-foreground">Receive email alerts for new orders</p>
                                    </div>
                                </div>
                                <Badge variant={settings.notifications.email_notifications_enabled ? "default" : "secondary"}>
                                    {settings.notifications.email_notifications_enabled ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="sms_notifications_enabled"
                                        checked={settings.notifications.sms_notifications_enabled}
                                        onCheckedChange={(checked) => updateNotifications({ sms_notifications_enabled: checked === true })}
                                    />
                                    <div>
                                        <Label htmlFor="sms_notifications_enabled" className="font-medium cursor-pointer">
                                            SMS Notifications
                                        </Label>
                                        <p className="text-xs text-muted-foreground">Receive SMS alerts for new orders</p>
                                    </div>
                                </div>
                                <Badge variant={settings.notifications.sms_notifications_enabled ? "default" : "secondary"}>
                                    {settings.notifications.sms_notifications_enabled ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Security Section */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Security
                    </CardTitle>
                    <CardDescription>
                        Change your admin password
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="current_password">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="current_password"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new_password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="new_password"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm New Password</Label>
                            <Input
                                id="confirm_password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-muted-foreground">
                            Password must be at least 8 characters long
                        </p>
                        <Button
                            onClick={handlePasswordChange}
                            disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                            variant="secondary"
                        >
                            {changingPassword ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Lock className="h-4 w-4 mr-2" />
                            )}
                            Change Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Last Updated */}
            <div className="text-center text-sm text-muted-foreground">
                Last updated: {new Date(settings.updated_at).toLocaleString()}
            </div>
        </div>
    );
}
