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
        <div className="space-y-5">
            <Label className="block">
                <SectionHeader step="৩" title="রঙ এবং পাওয়ার" />
            </Label>
            <div className="grid grid-cols-1 gap-6">
                {/* Color Selection with Swatches */}
                <div className="space-y-3" id="color">
                    <Label htmlFor="color" className="text-sm font-medium text-muted-foreground">
                        ফ্রেমের রঙ
                    </Label>
                    <div className="flex flex-wrap gap-4">
                        {product.availableColors.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => {
                                    setColor(c);
                                    setErrors(prev => ({ ...prev, color: "" }));
                                }}
                                className={cn(
                                    "group relative h-12 w-12 rounded-full border transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20",
                                    color === c ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 shadow-lg" : "border-border/50 hover:border-primary/50 hover:scale-105",
                                    errors.color && touched.color && !color ? "ring-2 ring-destructive" : ""
                                )}
                                style={{ backgroundColor: colorMap[c] || c }}
                                title={c}
                            >
                                {color === c && (
                                    <span className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in duration-200">
                                        <Check className={cn("h-5 w-5 drop-shadow-md", ["White", "Silver", "Shining Silver"].includes(c) ? "text-black" : "text-white")} />
                                    </span>
                                )}
                                <span className="sr-only">{c}</span>

                                {/* Tooltip-ish label on hover */}
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-foreground text-background px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {c}
                                </span>
                            </button>
                        ))}
                    </div>
                    {errors.color && touched.color && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-1 animate-in slide-in-from-left-1">
                            <AlertCircle className="h-3 w-3" /> {errors.color}
                        </p>
                    )}
                    <p className="text-sm mt-1">
                        <span className="text-muted-foreground">নির্বাচিত: </span>
                        <span className="font-semibold text-primary">{color || "কোনটি নয়"}</span>
                    </p>
                </div>

                {/* Power Selection */}
                <div className="space-y-3">
                    <Label htmlFor="power" className="text-sm font-medium text-muted-foreground">
                        লেন্স পাওয়ার
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
                                "h-14 bg-background/30 border-2 backdrop-blur-sm text-base transition-all duration-200",
                                "hover:bg-background/50 hover:border-primary/30",
                                "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                errors.power && touched.power ? "border-destructive ring-destructive/20" : "border-border/50"
                            )}
                        >
                            <SelectValue placeholder="পাওয়ার বাছাই করুন" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {product.availablePowers.map((p) => (
                                <SelectItem key={p} value={p} className="text-base py-3 cursor-pointer">{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.power && touched.power && (
                        <p className="text-xs text-destructive flex items-center gap-1 animate-in slide-in-from-left-1">
                            <AlertCircle className="h-3 w-3" /> {errors.power}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
