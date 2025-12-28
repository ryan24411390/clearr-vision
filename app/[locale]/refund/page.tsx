import { useTranslations } from 'next-intl';

export default function RefundPage() {
    const t = useTranslations('Legal');

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">{t('refundTitle')}</h1>
            <p className="text-muted-foreground mb-8">{t('lastUpdated')}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">Return Policy</h2>
                    <p>
                        You have 7 days after receiving your item to request a return. The item must be in the same condition that you received it, worn or unused, with tags, and in its original packaging.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">Refunds</h2>
                    <p>
                        We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method.
                    </p>
                </section>
            </div>
        </div>
    );
}
