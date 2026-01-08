"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { Product } from "@/lib/products";
import { useToast } from "@/components/ui/toast";
import { Check, Loader2, ShoppingBag, AlertCircle, MapPin } from "lucide-react";

interface QuickOrderModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

interface FormErrors {
    color?: string;
    power?: string;
    customerName?: string;
    phoneNumber?: string;
    address?: string;
}

type DeliveryLocation = "inside" | "outside";

export function QuickOrderModal({ product, isOpen, onClose }: QuickOrderModalProps) {
    const router = useRouter();
    const toast = useToast();


    // Form states
    const [color, setColor] = useState<string>("");
    const [power, setPower] = useState<string>("");
    const [customerName, setCustomerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation>("outside");

    // Validation and loading states
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delivery pricing
    const deliveryCharge = deliveryLocation === "inside" ? 60 : 100;
    const total = product.price + deliveryCharge;

    const validateField = (field: keyof FormErrors, value: string): string => {
        switch (field) {
            case "color":
                return !value ? "কালার সিলেক্ট করুন" : "";
            case "power":
                return !value ? "পাওয়ার সিলেক্ট করুন" : "";
            case "customerName":
                return !value.trim() ? "নাম আবশ্যক" :
                    value.trim().length < 2 ? "নাম কমপক্ষে ২ অক্ষরের হতে হবে" : "";
            case "phoneNumber":
                if (!value.trim()) return "ফোন নাম্বার আবশ্যক";
                // Basic BD phone validation: starts with 01, followed by 3-9, then 8 digits
                if (!/^01[3-9]\d{8}$/.test(value.replace(/\s+/g, ''))) {
                    return "সঠিক ফোন নাম্বার দিন (01XXXXXXXXX)";
                }
                return "";
            case "address":
                return !value.trim() ? "ঠিকানা আবশ্যক" :
                    value.trim().length < 10 ? "বিস্তারিত ঠিকানা দিন (এলাকা/রোড/বাসা)" : "";
            default:
                return "";
        }
    };

    const handleBlur = (field: keyof FormErrors) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const value = field === "customerName" ? customerName :
            field === "phoneNumber" ? phoneNumber :
                field === "address" ? address :
                    field === "color" ? color :
                        field === "power" ? power : "";

        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleInputChange = (field: keyof FormErrors, value: string) => {
        // Update the value
        switch (field) {
            case "customerName":
                setCustomerName(value);
                break;
            case "phoneNumber":
                setPhoneNumber(value);
                break;
            case "address":
                setAddress(value);
                break;
        }

        // Clear error if touched and valid
        if (touched[field]) {
            const error = validateField(field, value);
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    const validateAll = (): boolean => {
        const newErrors: FormErrors = {};

        const colorError = validateField("color", color);
        if (colorError) newErrors.color = colorError;

        const powerError = validateField("power", power);
        if (powerError) newErrors.power = powerError;

        const nameError = validateField("customerName", customerName);
        if (nameError) newErrors.customerName = nameError;

        const phoneError = validateField("phoneNumber", phoneNumber);
        if (phoneError) newErrors.phoneNumber = phoneError;

        const addressError = validateField("address", address);
        if (addressError) newErrors.address = addressError;

        setErrors(newErrors);
        setTouched({
            color: true,
            power: true,
            customerName: true,
            phoneNumber: true,
            address: true
        });

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateAll()) {
            toast.error("প্রয়োজনীয় তথ্যগুলো সঠিকভাবে পূরণ করুন");
            return;
        }

        setIsSubmitting(true);

        try {
            const orderPayload = {
                orderType: 'direct' as const,
                customer: {
                    name: customerName,
                    phone: phoneNumber,
                    address: address,
                },
                deliveryLocation: deliveryLocation === "inside" ? "Inside Dhaka" : "Outside Dhaka",
                items: [{
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    variant: {
                        color,
                        power,
                    },
                }],
                subtotal: product.price,
                deliveryCharge,
                total,
                paymentMethod: 'COD',
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit order');
            }

            const result = await response.json();

            // Store order info for success page
            localStorage.setItem('lastOrder', JSON.stringify({
                ...orderPayload,
                orderNumber: result.orderNumber,
                orderDate: new Date().toISOString(),
            }));

            toast.success("অর্ডার সফল হয়েছে!", {
                description: `অর্ডার #${result.orderNumber} - শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।`,
            });

            // Reset form and close modal
            resetForm();
            onClose();

            // Navigate to success page
            router.push("/order-success");

        } catch (error) {
            console.error('Order submission error:', error);
            toast.error("অর্ডার করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।");
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setColor("");
        setPower("");
        setCustomerName("");
        setPhoneNumber("");
        setAddress("");
        setDeliveryLocation("outside");
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Optional: Don't fully reset form on close if user accidentally closes it?
            // For now, keeping original behavior but maybe keeping state is better UX.
            // resetForm(); // Let's keep data if they re-open? No, usually separate instances.
            resetForm();
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
                <DialogHeader className="border-b border-border pb-4">
                    <DialogTitle className="text-xl flex items-center gap-2 font-bold">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        অর্ডার করুন
                    </DialogTitle>
                    <DialogDescription>
                        {product.name} অর্ডার করতে নিচের ফর্মটি পূরণ করুন
                    </DialogDescription>
                </DialogHeader>

                {/* Product Info */}
                <div className="flex gap-4 py-4 border-b border-border">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-semibold text-foreground line-clamp-2 text-sm">
                            {product.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-lg font-bold text-primary">
                                {formatCurrency(product.price, "BDT")}
                            </p>
                            {product.originalPrice && (
                                <p className="text-sm text-muted-foreground line-through">
                                    {formatCurrency(product.originalPrice, "BDT")}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-5 py-2">
                    {/* Product Options */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="quick-color" className="text-sm font-medium">
                                ফ্রেমের কালার <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={color}
                                onValueChange={(v) => {
                                    setColor(v);
                                    if (touched.color) {
                                        setErrors(prev => ({ ...prev, color: validateField("color", v) }));
                                    }
                                }}
                            >
                                <SelectTrigger
                                    id="quick-color"
                                    className={cn("bg-background", errors.color && touched.color && "border-red-500 focus:ring-red-500")}
                                    onBlur={() => handleBlur("color")}
                                >
                                    <SelectValue placeholder="কালার সিলেক্ট করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    {product.availableColors.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.color && touched.color && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.color}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="quick-power" className="text-sm font-medium">
                                আপনার চোখের পাওয়ার সিলেক্ট করুন: <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={power}
                                onValueChange={(v) => {
                                    setPower(v);
                                    if (touched.power) {
                                        setErrors(prev => ({ ...prev, power: validateField("power", v) }));
                                    }
                                }}
                            >
                                <SelectTrigger
                                    id="quick-power"
                                    className={cn("bg-background", errors.power && touched.power && "border-red-500 focus:ring-red-500")}
                                    onBlur={() => handleBlur("power")}
                                >
                                    <SelectValue placeholder="পাওয়ার সিলেক্ট করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    {product.availablePowers.map((p) => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.power && touched.power && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.power}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground border-b border-border pb-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            ডেলিভারি তথ্য
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">ডেলিভারি এরিয়া</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant={deliveryLocation === 'inside' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-auto py-3 justify-start px-4",
                                        deliveryLocation === 'inside' ? "border-primary" : "border-border"
                                    )}
                                    onClick={() => setDeliveryLocation('inside')}
                                >
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-sm font-semibold">ঢাকার ভিতরে</span>
                                        <span className="text-xs opacity-90">৬০ টাকা</span>
                                    </div>
                                </Button>
                                <Button
                                    type="button"
                                    variant={deliveryLocation === 'outside' ? 'default' : 'outline'}
                                    className={cn(
                                        "h-auto py-3 justify-start px-4",
                                        deliveryLocation === 'outside' ? "border-primary" : "border-border"
                                    )}
                                    onClick={() => setDeliveryLocation('outside')}
                                >
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-sm font-semibold">ঢাকার বাইরে</span>
                                        <span className="text-xs opacity-90">১০০ টাকা</span>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="quick-name" className="text-sm font-medium">
                                আপনার নাম <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="quick-name"
                                placeholder="আপনার পূর্ণ নাম লিখুন"
                                value={customerName}
                                onChange={(e) => handleInputChange("customerName", e.target.value)}
                                onBlur={() => handleBlur("customerName")}
                                className={cn("bg-background", errors.customerName && touched.customerName && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.customerName && touched.customerName && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.customerName}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="quick-phone" className="text-sm font-medium">
                                ফোন নাম্বার <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="quick-phone"
                                placeholder="01XXXXXXXXX"
                                value={phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                onBlur={() => handleBlur("phoneNumber")}
                                className={cn("bg-background", errors.phoneNumber && touched.phoneNumber && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.phoneNumber && touched.phoneNumber && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.phoneNumber}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="quick-address" className="text-sm font-medium">
                                ডেলিভারি ঠিকানা <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="quick-address"
                                placeholder="বাসা নং, রোড নং, এলাকা..."
                                value={address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                onBlur={() => handleBlur("address")}
                                rows={2}
                                className={cn("bg-background resize-none", errors.address && touched.address && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.address && touched.address && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.address}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm border border-border/50">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">সাবটোটাল</span>
                            <span>{formatCurrency(product.price, "BDT")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                            <span>{formatCurrency(deliveryCharge, "BDT")}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-border pt-2 text-base">
                            <span>সর্বমোট</span>
                            <span className="text-primary">{formatCurrency(total, "BDT")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-center pt-1">
                            ক্যাশ অন ডেলিভারি (COD) এর মাধ্যমে পেমেন্ট করুন
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        className="flex-1 border-border"
                        disabled={isSubmitting}
                    >
                        বাতিল
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-primary/90 gap-2 font-semibold"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                প্রসেস হচ্ছে...
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" />
                                অর্ডার কনফার্ম করুন
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
