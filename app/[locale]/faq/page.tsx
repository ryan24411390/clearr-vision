import { useTranslations } from 'next-intl';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
    const t = useTranslations('FAQ');

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                <p className="text-muted-foreground text-lg">{t('description')}</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>How do I determine my power?</AccordionTrigger>
                    <AccordionContent>
                        You can take our free "Find Your Power" quiz which uses age and usage patterns to recommend a power. For a precise prescription, we always recommend visiting an optometrist.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>Do you offer blue light blocking?</AccordionTrigger>
                    <AccordionContent>
                        Yes! All our Clearr Vision Pro lenses come with premium blue light blocking technology to protect your eyes from digital eye strain.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>What is your return policy?</AccordionTrigger>
                    <AccordionContent>
                        We offer a 7-day hassle-free return policy. If the glasses don't fit or you're not satisfied, simply return them in original condition for a full refund.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger>How long does shipping take?</AccordionTrigger>
                    <AccordionContent>
                        Orders within Dhaka are delivered in 24-48 hours. Outside Dhaka, delivery typically takes 2-4 business days.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                    <AccordionTrigger>Can I pay with Cash on Delivery?</AccordionTrigger>
                    <AccordionContent>
                        Absolutely. We offer Cash on Delivery (COD) across all of Bangladesh so you can pay when you receive your glasses.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
