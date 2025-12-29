import { AlertCircle, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn, colorMap } from "@/lib/utils";
import { SectionHeader } from "./form-section";
import { Product } from "@/lib/products";
import { FormErrors } from "./use-order-form";

interface ProductOptionsProps {
    product: Product;
    color: string;
    setColor: (c: string) => void;
    power: string;
    setPower: (p: string) => void;
    errors: FormErrors;
    touched: Record<string, boolean>;
    setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}

export function ProductOptions({
    product,
    color,
    setColor,
    power,
    setPower,
    errors,
    touched,
    setErrors
}: ProductOptionsProps) {
    return (
        <div className="space-y-3">
            <Label className="block">
                <SectionHeader step="3" title="Color & Power" />
            </Label>
            <div className="grid grid-cols-1 gap-4">
                {/* Color Selection with Swatches */}
                <div className="space-y-2">
                    <Label htmlFor="color" className="text-sm font-medium">
                        Frame Color <span className="text-muted-foreground">(রঙ)</span>
                    </Label>
                    <div className="flex flex-wrap gap-3">
                        {product.availableColors.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => {
                                    setColor(c);
                                    setErrors(prev => ({ ...prev, color: "" }));
                                }}
                                className={cn(
                                    "group relative h-10 w-10 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                    color === c ? "border-primary ring-2 ring-primary ring-offset-2 scale-110" : "border-muted-foreground/30 hover:border-primary/50",
                                    errors.color && touched.color && !color ? "ring-2 ring-destructive" : ""
                                )}
                                style={{ backgroundColor: colorMap[c] || c }}
                                title={c}
                            >
                                {color === c && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <Check className={cn("h-4 w-4 drop-shadow-md", ["White", "Silver", "Shining Silver"].includes(c) ? "text-black" : "text-white")} />
                                    </span>
                                )}
                                <span className="sr-only">{c}</span>
                            </button>
                        ))}
                    </div>
                    {errors.color && touched.color && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.color}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                        Selected: <span className="font-medium text-foreground">{color || "None"}</span>
                    </p>
                </div>

                {/* Power Selection */}
                <div className="space-y-2">
                    <Label htmlFor="power" className="text-sm font-medium">
                        Lens Power <span className="text-muted-foreground">(পাওয়ার)</span>
                    </Label>
                    <Select
                        value={power}
                        onValueChange={(v) => {
                            setPower(v);
                            setErrors(prev => ({ ...prev, power: "" }));
                        }}
                    >
                        <SelectTrigger
                            id="power"
                            className={cn(
                                "h-12 bg-background/50 border-input/50 backdrop-blur-sm",
                                errors.power && touched.power ? "border-destructive ring-destructive/20" : ""
                            )}
                        >
                            <SelectValue placeholder="Select Power (পাওয়ার বাছাই করুন)" />
                        </SelectTrigger>
                        <SelectContent>
                            {product.availablePowers.map((p) => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.power && touched.power && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.power}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
