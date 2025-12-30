import { cookies } from "next/headers";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token")?.value;
    const isAuthenticated = adminToken === process.env.ADMIN_SECRET_TOKEN;

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <AdminSidebar />
            <div className="flex-1 flex flex-col md:ml-72 transition-all duration-300">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto bg-muted/10 p-6 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
