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
        <div className="space-y-5">
            <h4 className="text-base font-semibold">
                <SectionHeader
                    icon={<User className="h-4 w-4 text-primary" />}
                    title="আপনার তথ্য"
                />
            </h4>

            <div className="space-y-5">
                {/* Customer Name */}
                <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-sm font-medium text-muted-foreground">
                        পুরো নাম <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            id="customerName"
                            name="name"
                            autoComplete="name"
                            value={customerName}
                            onChange={(e) => handleChange("customerName", e.target.value, setCustomerName)}
                            onBlur={() => handleBlur("customerName")}
                            placeholder="আপনার নাম লিখুন"
                            className={cn(
                                "h-14 pl-12 bg-background/30 border-2 backdrop-blur-sm text-base transition-all duration-200",
                                "hover:bg-background/50 hover:border-primary/30",
                                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                errors.customerName && touched.customerName ? "border-destructive focus-visible:ring-destructive" : "border-border/50"
                            )}
                        />
                    </div>
                    {errors.customerName && touched.customerName && (
                        <p className="text-xs text-destructive flex items-center gap-1 animate-in slide-in-from-left-1">
                            <AlertCircle className="h-3 w-3" /> {errors.customerName}
                        </p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-muted-foreground">
                        ফোন নম্বর <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            id="phoneNumber"
                            name="phone"
                            autoComplete="tel"
                            value={phoneNumber}
                            onChange={(e) => handleChange("phoneNumber", e.target.value, setPhoneNumber)}
                            onBlur={() => handleBlur("phoneNumber")}
                            placeholder="01XXXXXXXXX"
                            className={cn(
                                "h-14 pl-12 bg-background/30 border-2 backdrop-blur-sm text-base transition-all duration-200",
                                "hover:bg-background/50 hover:border-primary/30",
                                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                                errors.phoneNumber && touched.phoneNumber ? "border-destructive focus-visible:ring-destructive" : "border-border/50"
                            )}
                            type="tel"
                        />
                    </div>
                    {errors.phoneNumber && touched.phoneNumber && (
                        <p className="text-xs text-destructive flex items-center gap-1 animate-in slide-in-from-left-1">
                            <AlertCircle className="h-3 w-3" /> {errors.phoneNumber}
                        </p>
                    )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-muted-foreground">
                        সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <textarea
                            id="address"
                            name="address"
                            autoComplete="street-address"
                            value={address}
                            onChange={(e) => handleChange("address", e.target.value, setAddress)}
                            onBlur={() => handleBlur("address")}
                            placeholder="বাসা নং, রোড, এলাকা, থানা, জেলা"
                            className={cn(
                                "flex min-h-[100px] w-full rounded-md border-2 bg-background/30 px-3 py-3 pl-12 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:bg-background/50 hover:border-primary/30",
                                errors.address && touched.address ? "border-destructive focus-visible:ring-destructive" : "border-border/50"
                            )}
                        />
                    </div>
                    {errors.address && touched.address && (
                        <p className="text-xs text-destructive flex items-center gap-1 animate-in slide-in-from-left-1">
                            <AlertCircle className="h-3 w-3" /> {errors.address}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
