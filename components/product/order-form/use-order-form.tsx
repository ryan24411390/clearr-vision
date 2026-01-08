import { useState, useEffect } from "react";
import { Product } from "@/lib/products";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export interface FormErrors {
    quantity?: string;
    location?: string;
    color?: string;
    power?: string;
    age?: string;
    customerName?: string;
    phoneNumber?: string;
    address?: string;
}

export function useOrderForm(product: Product) {
    const router = useRouter();
    const toast = useToast();

    // Selection States
    const [quantity, setQuantity] = useState<"1" | "2">("2");
    const [location, setLocation] = useState<"inside" | "outside">("inside");
    const [color, setColor] = useState<string>("");
    const [power, setPower] = useState<string>("");
    const [age, setAge] = useState<string>("");

    // Customer Details States
    const [customerName, setCustomerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");

    // Validation State
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Loading States
    const [submittingOrder, setSubmittingOrder] = useState(false);

    // Hydrate customer details from localStorage on mount
    useEffect(() => {
        const savedCustomer = localStorage.getItem('customerInfo');
        if (savedCustomer) {
            try {
                const { name, phone, address } = JSON.parse(savedCustomer);
                if (name) setCustomerName(name);
                if (phone) setPhoneNumber(phone);
                if (address) setAddress(address);
            } catch (e) {
                console.error("Failed to parse saved customer info", e);
            }
        }
    }, []);

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
                if (!value) error = "রঙ নির্বাচন করুন";
                break;
            case "power":
                if (!value) error = "পাওয়ার নির্বাচন করুন";
                break;
            case "age":
                if (power === "Don't know power" && !value) error = "বয়স নির্বাচন করুন";
                break;
            case "customerName":
                if (!value.trim()) error = "নাম লিখুন";
                break;
            case "phoneNumber":
                if (!value.trim()) {
                    error = "ফোন নম্বর লিখুন";
                } else if (!/^01[3-9]\d{8}$/.test(value.replace(/\s+/g, ''))) {
                    error = "সঠিক ফোন নম্বর দিন";
                }
                break;
            case "address":
                if (!value.trim()) error = "ঠিকানা লিখুন";
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

        const ageError = validateField("age", age);
        if (ageError) newErrors.age = ageError;

        setErrors(prev => ({ ...prev, ...newErrors }));
        setTouched(prev => ({ ...prev, color: true, power: true, age: true }));

        if (Object.keys(newErrors).length > 0) {
            toast.error("সব অপশন নির্বাচন করুন");
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
            toast.error("সব তথ্য সঠিকভাবে পূরণ করুন");
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
                        field === "power" ? power :
                            field === "age" ? age : "";

        const error = validateField(field, value);
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));
    };

    const scrollToError = (currentErrors: FormErrors) => {
        const errorFields = Object.keys(currentErrors) as (keyof FormErrors)[];
        if (errorFields.length === 0) return;

        // Priority order for scrolling (top to bottom)
        const fieldOrder: (keyof FormErrors)[] = ['color', 'power', 'age', 'customerName', 'phoneNumber', 'address'];

        for (const field of fieldOrder) {
            if (currentErrors[field]) {
                const element = document.getElementById(field);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Focus if it's an input
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                        element.focus();
                    }
                    break;
                }
            }
        }
    };

    const handlePlaceOrder = async () => {
        // Validate all sections
        const selectionValid = validateSelection();
        const customerValid = validateCustomerDetails();
        const isValid = selectionValid && customerValid;

        if (!isValid) {
            // Re-calculate errors to ensure we have the latest set for scrolling
            // (Note: state updates are async, so we use the logic from validation functions implicitly
            // or we can just rely on the fact that we called setErrors in validation functions.
            // But since setErrors is async, 'errors' might not be updated yet. 
            // We need to gather errors manually here or wait.
            // To be safe and synchronous, we can reconstruct the errors here.)

            const currentErrors: FormErrors = {};
            // Re-run validation logic locally to get immediate error object
            if (!color) currentErrors.color = "রঙ নির্বাচন করুন";
            if (!power) currentErrors.power = "পাওয়ার নির্বাচন করুন";
            if (power === "Don't know power" && !age) currentErrors.age = "বয়স নির্বাচন করুন";
            if (!customerName.trim()) currentErrors.customerName = "নাম লিখুন";
            if (!phoneNumber.trim()) currentErrors.phoneNumber = "ফোন নম্বর লিখুন";
            else if (!/^01[3-9]\d{8}$/.test(phoneNumber.replace(/\s+/g, ''))) currentErrors.phoneNumber = "সঠিক ফোন নম্বর দিন";
            if (!address.trim()) currentErrors.address = "ঠিকানা লিখুন";

            scrollToError(currentErrors);
            return;
        }

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
                deliveryLocation: location === "inside" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে",
                customerAge: age, // Send age with the order if captured
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

            // Save customer info for next time
            localStorage.setItem('customerInfo', JSON.stringify({
                name: customerName,
                phone: phoneNumber,
                address: address
            }));

            // Store order info for success page
            localStorage.setItem('lastOrder', JSON.stringify({
                ...orderPayload,
                orderNumber: result.orderNumber,
                orderDate: new Date().toISOString(),
            }));

            // Show success
            toast.success("অর্ডার সফল হয়েছে!", {
                description: `অর্ডার #${result.orderNumber} - শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।`,
            });

            // Track Purchase event with Meta Pixel
            if (typeof window !== 'undefined' && 'fbq' in window) {
                // @ts-ignore
                window.fbq('track', 'Purchase', {
                    content_name: product.name,
                    content_ids: [product.id],
                    content_type: 'product',
                    value: total,
                    currency: 'BDT',
                    num_items: qtyNum,
                });
            }

            // Navigate to order success page
            router.push("/order-success");

        } catch (error) {
            console.error('Order submission error:', error);
            toast.error("অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
            setSubmittingOrder(false);
        }
    };

    return {
        state: {
            quantity,
            location,
            color,
            power,
            age,
            customerName,
            phoneNumber,
            address,
            errors,
            touched,
            submittingOrder
        },
        setters: {
            setQuantity,
            setLocation,
            setColor,
            setPower,
            setAge,
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
            handlePlaceOrder,
            validateField
        }
    };
}
