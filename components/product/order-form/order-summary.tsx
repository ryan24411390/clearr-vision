import { ArrowRight, Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryProps {
    qtyNum: number;
    subtotal: number;
    total: number;
    deliveryCharge: number;
    isFreeDelivery: boolean;
    location: "inside" | "outside";
    handlePlaceOrder: () => void;
    submittingOrder: boolean;
}

export function OrderSummary({
    qtyNum,
    subtotal,
    total,
    deliveryCharge,
    isFreeDelivery,
    location,
    handlePlaceOrder,
    submittingOrder,
}: OrderSummaryProps) {

    return (
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/10 dark:from-white/5 dark:to-white/5 border border-white/10 p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="space-y-4 mb-8 relative z-10">
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full" />
                    অর্ডার সামারি
                </h4>
                <div className="space-y-3">
                    <div className="flex justify-between text-base text-muted-foreground">
                        <span>সাবটোটাল ({qtyNum} {qtyNum > 1 ? 'পিস' : 'পিস'})</span>
                        <span className="text-foreground font-medium">{formatCurrency(subtotal, "en")}</span>
                    </div>
                    <div className="flex justify-between text-base text-muted-foreground">
                        <span>ডেলিভারি ({location === "inside" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে"})</span>
                        <span className={isFreeDelivery ? "text-green-500 font-bold" : "text-foreground font-medium"}>
                            {isFreeDelivery ? "ফ্রি" : formatCurrency(deliveryCharge, "en")}
                        </span>
                    </div>
                </div>

                {isFreeDelivery && (
                    <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                        <div className="bg-green-500 text-white p-1 rounded-full">
                            <Truck className="h-3 w-3" />
                        </div>
                        <p className="text-sm text-green-600 font-medium">
                            অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন
                        </p>
                    </div>
                )}

                <div className="border-t border-border/50 pt-4 mt-4">
                    <div className="flex justify-between items-end">
                        <span className="text-lg font-bold text-muted-foreground">সর্বমোট</span>
                        <span className="text-3xl font-bold text-primary tracking-tight">{formatCurrency(total, "en")}</span>
                    </div>
                </div>
            </div>

            {/* Place Order Button */}
            <div className="relative z-10">
                <Button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="w-full text-lg font-bold py-7 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 group overflow-hidden"
                    disabled={submittingOrder}
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                    <span className="relative flex items-center gap-2">
                        {submittingOrder ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                প্রসেস হচ্ছে...
                            </>
                        ) : (
                            <>
                                অর্ডার কনফার্ম করুন
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </span>
                </Button>
            </div>

            <div className="mt-6 flex justify-center gap-4 text-[10px] md:text-xs text-muted-foreground font-medium opacity-70">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    ক্যাশ অন ডেলিভারি
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    ৭ দিনে রিটার্ন
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    জেনুইন প্রোডাক্ট
                </div>
            </div>
        </div>
    );
}
