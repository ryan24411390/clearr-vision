"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Preloader from "@/components/ui/preloader";

interface LayoutWrapperProps {
    children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
    const pathname = usePathname();

    // Check if current route is an admin route
    const isAdminRoute = pathname?.includes('/admin');

    // For admin routes, render children directly without site chrome
    if (isAdminRoute) {
        return <>{children}</>;
    }

    // For regular routes, render with Navbar, Footer, etc.
    return (
        <>
            <Preloader />
            <Navbar />
            <main className="flex-1 pt-20">
                {children}
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}
