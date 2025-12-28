import { useTranslations } from 'next-intl';

export default function TermsPage() {
    const t = useTranslations('Legal');

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">{t('termsTitle')}</h1>
            <p className="text-muted-foreground mb-8">{t('lastUpdated')}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree, strictly do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">2. Use of License</h2>
                    <p>
                        Permission is granted to verify details and purchase products for personal, non-commercial transitory viewing only.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">3. Governing Law</h2>
                    <p>
                        These terms and conditions are governed by and construed in accordance with the laws of Bangladesh and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                    </p>
                </section>
            </div>
        </div>
    );
}
