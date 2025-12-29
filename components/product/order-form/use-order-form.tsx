import { useState } from "react";
import { Product } from "@/lib/products";
import { useCartStore } from "@/lib/store/cart";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export interface FormErrors {
    quantity?: string;
    location?: string;
    color?: string;
    power?: string;
    customerName?: string;
    phoneNumber?: string;
    address?: string;
}

export function useOrderForm(product: Product) {
    const router = useRouter();
    const toast = useToast();
    const addItem = useCartStore((state) => state.addItem);

    // Selection States
    const [quantity, setQuantity] = useState<"1" | "2">("2");
    const [location, setLocation] = useState<"inside" | "outside">("inside");
    const [color, setColor] = useState<string>("");
    const [power, setPower] = useState<string>("");

    // Customer Details States
    const [customerName, setCustomerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");

    // Validation State
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Loading States
    const [addingToCart, setAddingToCart] = useState(false);
    const [submittingOrder, setSubmittingOrder] = useState(false);

    // Derived Values
    const price = product.price;
    const qtyNum = parseInt(quantity);
    const subtotal = price * qtyNum;

    // Delivery Logic
    const isFreeDelivery = qtyNum >= 2;
    const deliveryCharge = isFreeDelivery ? 0 : (location === "inside" ? 60 : 100);
    const total = subtotal + deliveryCharge;

    const validateField = (field: keyof FormErrors, value: string) => {
        let error = "";
        switch (field) {
            case "color":
                if (!value) error = "Display color is required";
                break;
            case "power":
                if (!value) error = "Lens power is required";
                break;
            case "customerName":
                if (!value.trim()) error = "Name is required";
                break;
            case "phoneNumber":
                if (!value.trim()) {
                    error = "Phone number is required";
                } else if (!/^01[3-9]\d{8}$/.test(value.replace(/\s+/g, ''))) {
                    error = "Invalid Bangladesh phone number";
                }
                break;
            case "address":
                if (!value.trim()) error = "Address is required";
                break;
        }
        return error;
    };

    const validateSelection = (): boolean => {
        const newErrors: FormErrors = {};

        const colorError = validateField("color", color);
        if (colorError) newErrors.color = colorError;

        const powerError = validateField("power", power);
        if (powerError) newErrors.power = powerError;

        setErrors(prev => ({ ...prev, ...newErrors }));
        setTouched(prev => ({ ...prev, color: true, power: true }));

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please select all product options");
            return false;
        }
        return true;
    };

    const validateCustomerDetails = (): boolean => {
        const newErrors: FormErrors = {};

        const nameError = validateField("customerName", customerName);
        if (nameError) newErrors.customerName = nameError;

        const phoneError = validateField("phoneNumber", phoneNumber);
        if (phoneError) newErrors.phoneNumber = phoneError;

        const addressError = validateField("address", address);
        if (addressError) newErrors.address = addressError;

        setErrors(prev => ({ ...prev, ...newErrors }));
        setTouched(prev => ({
            ...prev,
            customerName: true,
            phoneNumber: true,
            address: true
        }));

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fill in all details correctly");
            return false;
        }
        return true;
    };

    const handleBlur = (field: keyof FormErrors) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const value = field === "customerName" ? customerName :
            field === "phoneNumber" ? phoneNumber :
                field === "address" ? address :
                    field === "color" ? color :
                        field === "power" ? power : "";

        const error = validateField(field, value);
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));
    };

    const createCartItem = () => {
        const variantId = `${color}-${power}`;
        return {
            id: `${product.id}-${variantId}`,
            productId: product.id,
            name: product.name,
            price: price,
            image: product.image,
            quantity: qtyNum,
            variant: {
                color,
                power,
            },
        };
    };

    const handleAddToCart = async () => {
        if (!validateSelection()) return;

        setAddingToCart(true);

        // Small delay for UX feedback
        await new Promise(resolve => setTimeout(resolve, 300));

        addItem(createCartItem());

        toast.success("Added to cart!", {
            description: `${qtyNum}x ${product.name} (${color}, ${power})`,
            action: {
                label: "View Cart",
                onClick: () => router.push("/checkout"),
            }
        });

        setAddingToCart(false);
    };

    const handlePlaceOrder = async () => {
        let isValid = validateSelection();
        isValid = validateCustomerDetails() && isValid; // Evaluate both

        if (!isValid) return;

        setSubmittingOrder(true);

        try {
            // Create order payload for API
            const orderPayload = {
                orderType: 'direct' as const,
                customer: {
                    name: customerName,
                    phone: phoneNumber,
                    address: address,
                },
                deliveryLocation: location === "inside" ? "Inside Dhaka" : "Outside Dhaka",
                items: [{
                    productId: product.id,
                    name: product.name,
                    price: price,
                    quantity: qtyNum,
                    variant: {
                        color,
                        power,
                    },
                }],
                subtotal,
                deliveryCharge,
                total,
                paymentMethod: 'COD',
            };

            // Submit to API
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

            // Show success
            toast.success("Order placed successfully! (অর্ডার সফল হয়েছে!)", {
                description: `Order #${result.orderNumber} - We will contact you soon.`,
            });

            // Navigate to order success page
            router.push("/order-success");

        } catch (error) {
            console.error('Order submission error:', error);
            toast.error("Failed to place order. Please try again.");
            setSubmittingOrder(false);
        }
    };

    return {
        state: {
            quantity,
            location,
            color,
            power,
            customerName,
            phoneNumber,
            address,
            errors,
            touched,
            addingToCart,
            submittingOrder
        },
        setters: {
            setQuantity,
            setLocation,
            setColor,
            setPower,
            setCustomerName,
            setPhoneNumber,
            setAddress,
            setErrors,
            setTouched
        },
        derived: {
            price,
            qtyNum,
            subtotal,
            deliveryCharge,
            isFreeDelivery,
            total
        },
        actions: {
            handleBlur,
            handleAddToCart,
            handlePlaceOrder,
            validateField // helper export if needed
        }
    };
}
