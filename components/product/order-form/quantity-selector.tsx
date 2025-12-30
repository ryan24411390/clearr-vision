import { Check, Truck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, formatCurrency } from "@/lib/utils";
import { SectionHeader } from "./form-section";
import { useLocale } from "next-intl";

interface QuantitySelectorProps {
    quantity: "1" | "2";
    setQuantity: (val: "1" | "2") => void;
    price: number;
}

export function QuantitySelector({ quantity, setQuantity, price }: QuantitySelectorProps) {
    const locale = useLocale();

    return (
        <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
                <SectionHeader step="1" title="Select Quantity" subtitle="কতটি নিবেন?" />
            </Label>
            <RadioGroup
                value={quantity}
                onValueChange={(v) => setQuantity(v as "1" | "2")}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {/* Option 1 */}
                <label className={cn(
                    "relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all hover:bg-muted/50",
                    quantity === '1' ? "border-primary bg-primary/5 shadow-sm" : "border-muted bg-transparent"
                )}>
                    <RadioGroupItem value="1" id="qty-1" className="sr-only" />
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">1 Pair</span>
                        {quantity === '1' && <Check className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground">Standard Delivery Charge</p>
                    <div className="mt-2 text-lg font-bold">{formatCurrency(price, locale)}</div>
                </label>

                {/* Option 2 - Recommended */}
                <label className={cn(
                    "relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all hover:bg-muted/50 pt-6",
                    quantity === '2' ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20 ring-offset-2" : "border-muted bg-transparent"
                )}>
                    <div className="absolute -top-3 left-6">
                        <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg transform -rotate-2">
                            Best Value
                        </span>
                    </div>
                    <RadioGroupItem value="2" id="qty-2" className="sr-only" />
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">2 Pairs</span>
                        {quantity === '2' && <Check className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="text-sm text-green-600 font-semibold flex items-center">
                        <Truck className="h-3 w-3 mr-1" /> FREE Delivery
                    </p>
                    <div className="mt-2 text-lg font-bold">{formatCurrency(price * 2, locale)}</div>
                </label>
            </RadioGroup>
        </div>
    );
}
