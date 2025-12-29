import { ArrowRight, Loader2, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useLocale } from "next-intl";

interface OrderSummaryProps {
    qtyNum: number;
    subtotal: number;
    total: number;
    deliveryCharge: number;
    isFreeDelivery: boolean;
    location: "inside" | "outside";
    handlePlaceOrder: () => void;
    handleAddToCart: () => void;
    submittingOrder: boolean;
    addingToCart: boolean;
}

export function OrderSummary({
    qtyNum,
    subtotal,
    total,
    deliveryCharge,
    isFreeDelivery,
    location,
    handlePlaceOrder,
    handleAddToCart,
    submittingOrder,
    addingToCart,
}: OrderSummaryProps) {
    const locale = useLocale();

    return (
        <div className="rounded-xl bg-gradient-to-br from-card to-muted border border-border p-6 shadow-xl">
            <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-base mb-4">Order Summary</h4>
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal ({qtyNum} {qtyNum > 1 ? 'pairs' : 'pair'})</span>
                    <span className="text-foreground font-medium">{formatCurrency(subtotal, locale)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Delivery ({location === "inside" ? "Dhaka" : "Outside Dhaka"})</span>
                    <span className={isFreeDelivery ? "text-green-500 font-bold" : "text-foreground font-medium"}>
                        {isFreeDelivery ? "FREE" : formatCurrency(deliveryCharge, locale)}
                    </span>
                </div>
                {isFreeDelivery && (
                    <p className="text-xs text-green-500 flex items-center gap-1 bg-green-500/10 p-2 rounded-md">
                        <Truck className="h-3 w-3" />
                        Free delivery applied!
                    </p>
                )}
                <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total <span className="text-muted-foreground font-normal text-sm">(সর্বমোট)</span></span>
                        <span className="text-primary">{formatCurrency(total, locale)}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                {/* Place Order - Primary */}
                <Button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="w-full text-lg font-bold py-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20"
                    disabled={submittingOrder || addingToCart}
                >
                    {submittingOrder ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing Order...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Place Order (অর্ডার করুন)
                            <ArrowRight className="h-5 w-5" />
                        </span>
                    )}
                </Button>

                {/* Add to Cart - Secondary */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddToCart}
                    className="w-full py-5 border-2 border-dashed border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                    disabled={addingToCart || submittingOrder}
                >
                    {addingToCart ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Adding...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                        </span>
                    )}
                </Button>
            </div>

            <div className="mt-4 flex flex-col items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">💵 Cash on Delivery</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                    <span className="flex items-center gap-1">↩️ 7-day return</span>
                </div>
            </div>
        </div>
    );
}
