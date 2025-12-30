import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
            </div>

            <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
                <p>Product creation form is under construction.</p>
                <p className="text-sm mt-2">Will be implemented in the next phase.</p>
            </div>
        </div>
    );
}
