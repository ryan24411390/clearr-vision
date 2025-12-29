import { AlertCircle, MapPin, Phone, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./form-section";
import { FormErrors } from "./use-order-form";

interface CustomerDetailsProps {
    customerName: string;
    setCustomerName: (name: string) => void;
    phoneNumber: string;
    setPhoneNumber: (phone: string) => void;
    address: string;
    setAddress: (address: string) => void;
    errors: FormErrors;
    touched: Record<string, boolean>;
    handleBlur: (field: keyof FormErrors) => void;
    validateField: (field: keyof FormErrors, value: string) => string;
    setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}

export function CustomerDetails({
    customerName,
    setCustomerName,
    phoneNumber,
    setPhoneNumber,
    address,
    setAddress,
    errors,
    touched,
    handleBlur,
    validateField,
    setErrors
}: CustomerDetailsProps) {
    const handleChange = (field: keyof FormErrors, value: string, setter: (val: string) => void) => {
        setter(value);
        if (touched[field]) {
            const error = validateField(field, value);
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-base font-semibold">
                <SectionHeader
                    icon={<User className="h-4 w-4 text-primary" />}
                    title="Your Details"
                    subtitle="আপনার তথ্য"
                />
            </h4>

            <div className="space-y-4">
                {/* Customer Name */}
                <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-sm font-medium">
                        Full Name <span className="text-muted-foreground">(পুরো নাম)</span> <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="customerName"
                            value={customerName}
                            onChange={(e) => handleChange("customerName", e.target.value, setCustomerName)}
                            onBlur={() => handleBlur("customerName")}
                            placeholder="আপনার নাম লিখুন"
                            className={cn(
                                "h-12 pl-10 bg-background/50",
                                errors.customerName && touched.customerName ? "border-destructive focus-visible:ring-destructive" : ""
                            )}
                        />
                    </div>
                    {errors.customerName && touched.customerName && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.customerName}
                        </p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium">
                        Phone Number <span className="text-muted-foreground">(ফোন নম্বর)</span> <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => handleChange("phoneNumber", e.target.value, setPhoneNumber)}
                            onBlur={() => handleBlur("phoneNumber")}
                            placeholder="01XXXXXXXXX"
                            className={cn(
                                "h-12 pl-10 bg-background/50",
                                errors.phoneNumber && touched.phoneNumber ? "border-destructive focus-visible:ring-destructive" : ""
                            )}
                            type="tel"
                        />
                    </div>
                    {errors.phoneNumber && touched.phoneNumber && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.phoneNumber}
                        </p>
                    )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">
                        Delivery Address <span className="text-muted-foreground">(সম্পূর্ণ ঠিকানা)</span> <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <textarea
                            id="address"
                            value={address}
                            onChange={(e) => handleChange("address", e.target.value, setAddress)}
                            onBlur={() => handleBlur("address")}
                            placeholder="বাসা নং, রোড, এলাকা, থানা, জেলা"
                            className={cn(
                                "flex min-h-[80px] w-full rounded-md border bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                errors.address && touched.address ? "border-destructive focus-visible:ring-destructive" : "border-input"
                            )}
                        />
                    </div>
                    {errors.address && touched.address && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.address}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
