"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
    return (
        <div className="container px-4 py-20 text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">অর্ডার সফল হয়েছে!</h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                আপনার অর্ডারের জন্য ধন্যবাদ। শীঘ্রই আমরা ডেলিভারি বিষয়ে আপনার সাথে যোগাযোগ করব।
            </p>

            <div className="flex justify-center gap-4">
                <Button asChild size="lg">
                    <Link href="/shop">আরও কিনুন</Link>
                </Button>
            </div>
        </div>
    );
}
