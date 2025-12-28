import { useTranslations } from 'next-intl';

export default function ShippingPage() {
    const t = useTranslations('Legal');

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">{t('shippingTitle')}</h1>
            <p className="text-muted-foreground mb-8">{t('lastUpdated')}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">Domestic Shipping</h2>
                    <p>
                        We offer 2-3 business day shipping across Bangladesh. Orders placed before 2 PM are typically processed the same day.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Shipping Costs</h2>
                    <p>
                        Creating a transparent shipping experience is our priority.
                        <ul className="list-disc pl-5 mt-2">
                            <li>Inside Dhaka: 60 BDT</li>
                            <li>Outside Dhaka: 120 BDT</li>
                            <li>Free shipping on orders over 2500 BDT</li>
                        </ul>
                    </p>
                </section>
            </div>
        </div>
    );
}
