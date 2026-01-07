import { Check, Truck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, formatCurrency } from "@/lib/utils";
import { SectionHeader } from "./form-section";

interface QuantitySelectorProps {
    quantity: "1" | "2";
    setQuantity: (val: "1" | "2") => void;
    price: number;
}

export function QuantitySelector({ quantity, setQuantity, price }: QuantitySelectorProps) {

    return (
        <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
                <SectionHeader step="১" title="কতটি নিবেন?" />
            </Label>
            <RadioGroup
                value={quantity}
                onValueChange={(v) => setQuantity(v as "1" | "2")}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
            >
                {/* Option 1 */}
                <label className={cn(
                    "relative flex cursor-pointer flex-col rounded-2xl border-2 p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50 group",
                    quantity === '1' ? "border-primary bg-primary/5 shadow-md" : "border-border/60 bg-white/5 dark:bg-black/20"
                )}>
                    <RadioGroupItem value="1" id="qty-1" className="sr-only" />
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <span className="font-bold text-xl block group-hover:text-primary transition-colors">১ পিস</span>
                            <span className="text-xs text-muted-foreground font-medium">ব্যক্তিগত ব্যবহারের জন্য</span>
                        </div>
                        <div className={cn(
                            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                            quantity === '1' ? "border-primary bg-primary" : "border-muted-foreground/30"
                        )}>
                            {quantity === '1' && <Check className="h-3 w-3 text-white" />}
                        </div>
                    </div>
                    <div className="mt-auto">
                        <p className="text-sm text-muted-foreground mb-1">স্ট্যান্ডার্ড মূল্য</p>
                        <div className="text-xl font-bold font-mono text-foreground">{formatCurrency(price, "en")}</div>
                    </div>
                </label>

                {/* Option 2 - Recommended */}
                <label className={cn(
                    "relative flex cursor-pointer flex-col rounded-2xl border-2 p-5 transition-all duration-300 hover:shadow-xl group overflow-hidden",
                    quantity === '2' ? "border-primary bg-primary/10 shadow-lg ring-1 ring-primary/20" : "border-border/60 bg-white/5 dark:bg-black/20 hover:border-primary/50"
                )}>
                    <div className="absolute top-0 right-0 p-0 overflow-hidden">
                        <div className="bg-gradient-to-l from-primary to-purple-600 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl shadow-sm">
                            বেস্ট অফার
                        </div>
                    </div>

                    <RadioGroupItem value="2" id="qty-2" className="sr-only" />
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <span className="font-bold text-xl block group-hover:text-primary transition-colors">২ পিস</span>
                            <span className="text-xs text-primary font-medium flex items-center gap-1">
                                <Truck className="h-3 w-3" /> ফ্রি ডেলিভারি
                            </span>
                        </div>
                        <div className={cn(
                            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                            quantity === '2' ? "border-primary bg-primary" : "border-muted-foreground/30"
                        )}>
                            {quantity === '2' && <Check className="h-3 w-3 text-white" />}
                        </div>
                    </div>
                    <div className="mt-auto">
                        <p className="text-sm text-muted-foreground mb-1">ভ্যালু প্যাক</p>
                        <div className="text-xl font-bold font-mono text-foreground">{formatCurrency(price * 2, "en")}</div>
                    </div>
                </label>
            </RadioGroup>
        </div>
    );
}
