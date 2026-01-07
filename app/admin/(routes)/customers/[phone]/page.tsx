import { getCustomerByPhone } from "@/lib/db/customers";
import { CustomerDetailClient } from "@/components/admin/CustomerDetailClient";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface CustomerDetailPageProps {
    params: Promise<{ phone: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
    const { phone } = await params;
    const decodedPhone = decodeURIComponent(phone);
    const customer = await getCustomerByPhone(decodedPhone);

    if (!customer) {
        notFound();
    }

    return <CustomerDetailClient customer={customer} />;
}
