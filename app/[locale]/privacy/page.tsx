import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
    const t = useTranslations('Legal');

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">{t('privacyTitle')}</h1>
            <p className="text-muted-foreground mb-8">{t('lastUpdated')}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access or disclosure.
                    </p>
                </section>
            </div>
        </div>
    );
}
