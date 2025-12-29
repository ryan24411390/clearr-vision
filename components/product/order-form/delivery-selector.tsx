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
                <SectionHeader step="2" title="Delivery Location" subtitle="ডেলিভারি এলাকা" />
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1 bg-muted/50 rounded-lg">
                <button
                    type="button"
                    onClick={() => setLocation("inside")}
                    className={cn(
                        "w-full px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                        location === "inside"
                            ? "bg-background shadow text-foreground ring-1 ring-border"
                            : "text-muted-foreground hover:bg-background/50"
                    )}
                >
                    Inside Dhaka (৳60)
                </button>
                <button
                    type="button"
                    onClick={() => setLocation("outside")}
                    className={cn(
                        "w-full px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                        location === "outside"
                            ? "bg-background shadow text-foreground ring-1 ring-border"
                            : "text-muted-foreground hover:bg-background/50"
                    )}
                >
                    Outside Dhaka (৳100)
                </button>
            </div>
        </div>
    );
}
