"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to shop page since cart functionality has been removed
        router.replace("/shop");
    }, [router]);

    return (
        <div className="container py-20 text-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Redirecting to shop...</p>
            </div>
        </div>
    );
}
