"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function ContactPage() {
    const t = useTranslations('Contact');
    const toast = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Message sent successfully!", { description: "We'll get back to you soon." });
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t('title')}</h1>
                        <p className="text-lg text-muted-foreground">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-card border p-8 rounded-2xl space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{t('emailTitle')}</h3>
                                        <a href="mailto:support@clearrvision.com" className="text-muted-foreground hover:text-primary transition-colors">
                                            support@clearrvision.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{t('callTitle')}</h3>
                                        <a href="tel:+8801234567890" className="text-muted-foreground hover:text-primary transition-colors">
                                            +880 1234 567 890
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{t('visitTitle')}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {t('address')} <br />
                                            {t('addressCity')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-card border p-8 rounded-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="What's your name?" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="What's your email?" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <textarea
                                        id="message"
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Write your message..."
                                        required
                                    />
                                </div>

                                <div className="flex items-start gap-2 pt-2">
                                    <Checkbox id="consent" required />
                                    <Label htmlFor="consent" className="text-xs text-muted-foreground font-normal leading-4 cursor-pointer">
                                        I consent to use of provided personal data for the purpose of responding to the request as described in Privacy Policy which I have read. I may withdraw my consent at any time.
                                    </Label>
                                </div>

                                <Button type="submit" className="w-full" size="lg">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
