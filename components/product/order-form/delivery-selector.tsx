import { Check, Truck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./form-section";

interface DeliverySelectorProps {
    location: "inside" | "outside";
    setLocation: (loc: "inside" | "outside") => void;
}

export function DeliverySelector({ location, setLocation }: DeliverySelectorProps) {
    return (
        <div className="space-y-3">
            <Label className="block">
                <SectionHeader step="২" title="ডেলিভারি এলাকা" />
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setLocation("inside")}
                    className={cn(
                        "relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 hover:bg-muted/30 hover:border-primary/50",
                        location === "inside"
                            ? "border-primary bg-primary/5 text-foreground shadow-sm ring-1 ring-primary/20"
                            : "border-border/60 bg-transparent text-muted-foreground"
                    )}
                >
                    <div className={cn(
                        "p-3 rounded-full transition-colors",
                        location === "inside" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    )}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></svg> {/* City Icon Placeholder - simplistic */}
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-sm">ঢাকার ভিতরে</span>
                        <span className="text-xs opacity-80">৬০ টাকা</span>
                    </div>
                    {location === "inside" && (
                        <div className="absolute top-3 right-3 text-primary">
                            <Check className="h-4 w-4" />
                        </div>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setLocation("outside")}
                    className={cn(
                        "relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 hover:bg-muted/30 hover:border-primary/50",
                        location === "outside"
                            ? "border-primary bg-primary/5 text-foreground shadow-sm ring-1 ring-primary/20"
                            : "border-border/60 bg-transparent text-muted-foreground"
                    )}
                >
                    <div className={cn(
                        "p-3 rounded-full transition-colors",
                        location === "outside" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    )}>
                        <Truck className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-sm">ঢাকার বাইরে</span>
                        <span className="text-xs opacity-80">১০০ টাকা</span>
                    </div>
                    {location === "outside" && (
                        <div className="absolute top-3 right-3 text-primary">
                            <Check className="h-4 w-4" />
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}
