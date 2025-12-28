"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/lib/store/cart";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormData {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    area: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    area?: string;
}

const BANGLADESH_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

function validateForm(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.firstName.trim()) {
        errors.firstName = "First name is required";
    } else if (data.firstName.trim().length < 2) {
        errors.firstName = "First name must be at least 2 characters";
    }

    if (!data.lastName.trim()) {
        errors.lastName = "Last name is required";
    } else if (data.lastName.trim().length < 2) {
        errors.lastName = "Last name must be at least 2 characters";
    }

    if (!data.phone.trim()) {
        errors.phone = "Phone number is required";
    } else if (!BANGLADESH_PHONE_REGEX.test(data.phone.replace(/\s/g, ""))) {
        errors.phone = "Enter a valid Bangladesh phone number (e.g., 01712345678)";
    }

    if (!data.address.trim()) {
        errors.address = "Address is required";
    } else if (data.address.trim().length < 10) {
        errors.address = "Please enter a complete address";
    }

    if (!data.city) {
        errors.city = "City is required";
    }

    if (!data.area.trim()) {
        errors.area = "Area/Thana is required";
    }

    return errors;
}

export function CheckoutForm() {
    const router = useRouter();
    const toast = useToast();
    const { items, clearCart, getCartTotal } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "dhaka",
        area: "",
    });

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleBlur = (field: keyof FormData) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        // Validate single field on blur
        const fieldErrors = validateForm(formData);
        if (fieldErrors[field]) {
            setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
        }
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Validate all fields
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);
        setTouched({
            firstName: true,
            lastName: true,
            phone: true,
            address: true,
            city: true,
            area: true,
        });

        if (Object.keys(validationErrors).length > 0) {
            toast.error("Please fix the errors in the form");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setLoading(true);

        try {
            // Prepare order data
            const orderData = {
                customer: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    area: formData.area,
                },
                items: items.map((item) => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    variant: item.variant,
                })),
                total: getCartTotal(),
                paymentMethod: "COD",
                createdAt: new Date().toISOString(),
            };

            // Simulate API call
            console.log("Order submitted:", orderData);
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Clear cart and redirect
            clearCart();
            toast.success("Order placed successfully!");
            router.push("/order-success");
        } catch {
            toast.error("Failed to place order. Please try again.");
            setLoading(false);
        }
    }

    const getFieldClassName = (field: keyof FormData) => {
        const hasError = touched[field] && errors[field];
        return cn(
            "h-11 bg-background border-border transition-colors",
            hasError && "border-red-500 focus-visible:ring-red-500"
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        onBlur={() => handleBlur("firstName")}
                        placeholder="Rahim"
                        className={getFieldClassName("firstName")}
                    />
                    {touched.firstName && errors.firstName && (
                        <p className="text-xs text-red-500">{errors.firstName}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        onBlur={() => handleBlur("lastName")}
                        placeholder="Ahmed"
                        className={getFieldClassName("lastName")}
                    />
                    {touched.lastName && errors.lastName && (
                        <p className="text-xs text-red-500">{errors.lastName}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="01712345678"
                    className={getFieldClassName("phone")}
                />
                {touched.phone && errors.phone ? (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                ) : (
                    <p className="text-xs text-muted-foreground">
                        Required for delivery coordination
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    onBlur={() => handleBlur("address")}
                    placeholder="House 12, Road 5, Block A..."
                    className={getFieldClassName("address")}
                />
                {touched.address && errors.address && (
                    <p className="text-xs text-red-500">{errors.address}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select
                        value={formData.city}
                        onValueChange={(value) => handleChange("city", value)}
                    >
                        <SelectTrigger
                            id="city"
                            className={cn(
                                "h-11 bg-background border-border",
                                touched.city && errors.city && "border-red-500"
                            )}
                        >
                            <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dhaka">Dhaka</SelectItem>
                            <SelectItem value="chittagong">Chittagong</SelectItem>
                            <SelectItem value="sylhet">Sylhet</SelectItem>
                            <SelectItem value="khulna">Khulna</SelectItem>
                            <SelectItem value="rajshahi">Rajshahi</SelectItem>
                            <SelectItem value="comilla">Comilla</SelectItem>
                            <SelectItem value="rangpur">Rangpur</SelectItem>
                            <SelectItem value="barishal">Barishal</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    {touched.city && errors.city && (
                        <p className="text-xs text-red-500">{errors.city}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="area">Area / Thana</Label>
                    <Input
                        id="area"
                        value={formData.area}
                        onChange={(e) => handleChange("area", e.target.value)}
                        onBlur={() => handleBlur("area")}
                        placeholder="e.g. Gulshan, Dhanmondi"
                        className={getFieldClassName("area")}
                    />
                    {touched.area && errors.area && (
                        <p className="text-xs text-red-500">{errors.area}</p>
                    )}
                </div>
            </div>

            <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                size="lg"
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing Order...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Place Cash on Delivery Order
                    </span>
                )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
                By placing this order, you agree to our{" "}
                <a href="/terms" className="underline hover:text-primary">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline hover:text-primary">
                    Privacy Policy
                </a>
            </p>
        </form>
    );
}
