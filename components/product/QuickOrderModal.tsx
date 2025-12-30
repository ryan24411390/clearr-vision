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
import { formatCurrency } from "@/lib/utils";
import { useLocale } from "next-intl";
import { Product } from "@/lib/products";
import { useToast } from "@/components/ui/toast";
import { Check, Loader2, ShoppingBag, AlertCircle } from "lucide-react";

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

export function QuickOrderModal({ product, isOpen, onClose }: QuickOrderModalProps) {
    const locale = useLocale();
    const router = useRouter();
    const toast = useToast();

    // Form states
    const [color, setColor] = useState<string>("");
    const [power, setPower] = useState<string>("");
    const [customerName, setCustomerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");

    // Validation and loading states
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delivery pricing (default to outside Dhaka for quick order)
    const deliveryCharge = 100; // Outside Dhaka default
    const total = product.price + deliveryCharge;

    const validateField = (field: keyof FormErrors, value: string): string => {
        switch (field) {
            case "color":
                return !value ? "Please select a color" : "";
            case "power":
                return !value ? "Please select lens power" : "";
            case "customerName":
                return !value.trim() ? "Name is required" :
                       value.trim().length < 2 ? "Name must be at least 2 characters" : "";
            case "phoneNumber":
                if (!value.trim()) return "Phone number is required";
                if (!/^01[3-9]\d{8}$/.test(value.replace(/\s+/g, ''))) {
                    return "Enter valid Bangladesh phone (01XXXXXXXXX)";
                }
                return "";
            case "address":
                return !value.trim() ? "Address is required" :
                       value.trim().length < 10 ? "Please provide complete address" : "";
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
            toast.error("Please fill in all required fields");
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
                deliveryLocation: "Outside Dhaka",
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

            toast.success("Order placed successfully!", {
                description: `Order #${result.orderNumber} - We will contact you soon.`,
            });

            // Reset form and close modal
            resetForm();
            onClose();

            // Navigate to success page
            router.push("/order-success");

        } catch (error) {
            console.error('Order submission error:', error);
            toast.error("Failed to place order. Please try again.");
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setColor("");
        setPower("");
        setCustomerName("");
        setPhoneNumber("");
        setAddress("");
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetForm();
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        Quick Order
                    </DialogTitle>
                    <DialogDescription>
                        Fill in your details to order {product.name}
                    </DialogDescription>
                </DialogHeader>

                {/* Product Info */}
                <div className="flex gap-4 py-4 border-b border-border">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground line-clamp-2 text-sm">
                            {product.name}
                        </h4>
                        <p className="text-lg font-bold text-primary mt-1">
                            {formatCurrency(product.price, locale)}
                        </p>
                        {product.originalPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                                {formatCurrency(product.originalPrice, locale)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-4 py-2">
                    {/* Product Options */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="quick-color" className="text-sm">
                                Frame Color <span className="text-red-500">*</span>
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
                                    className={`bg-background border-border ${errors.color && touched.color ? 'border-red-500' : ''}`}
                                    onBlur={() => handleBlur("color")}
                                >
                                    <SelectValue placeholder="Select color" />
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
                            <Label htmlFor="quick-power" className="text-sm">
                                Lens Power <span className="text-red-500">*</span>
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
                                    className={`bg-background border-border ${errors.power && touched.power ? 'border-red-500' : ''}`}
                                    onBlur={() => handleBlur("power")}
                                >
                                    <SelectValue placeholder="Select power" />
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
                    <div className="space-y-3 pt-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Delivery Information
                        </h4>

                        <div className="space-y-1.5">
                            <Label htmlFor="quick-name" className="text-sm">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="quick-name"
                                placeholder="Enter your name"
                                value={customerName}
                                onChange={(e) => handleInputChange("customerName", e.target.value)}
                                onBlur={() => handleBlur("customerName")}
                                className={`bg-background ${errors.customerName && touched.customerName ? 'border-red-500' : ''}`}
                            />
                            {errors.customerName && touched.customerName && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.customerName}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="quick-phone" className="text-sm">
                                Phone Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="quick-phone"
                                placeholder="01XXXXXXXXX"
                                value={phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                onBlur={() => handleBlur("phoneNumber")}
                                className={`bg-background ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : ''}`}
                            />
                            {errors.phoneNumber && touched.phoneNumber && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.phoneNumber}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="quick-address" className="text-sm">
                                Delivery Address <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="quick-address"
                                placeholder="Enter your full address with area/thana"
                                value={address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                onBlur={() => handleBlur("address")}
                                rows={2}
                                className={`bg-background resize-none ${errors.address && touched.address ? 'border-red-500' : ''}`}
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
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(product.price, locale)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Delivery</span>
                            <span>{formatCurrency(deliveryCharge, locale)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t border-border pt-2">
                            <span>Total</span>
                            <span className="text-primary">{formatCurrency(total, locale)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Cash on Delivery (COD)
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
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Placing Order...
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" />
                                Place Order
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
