"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";

export default function ContactPage() {
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
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Get in Touch</h1>
                        <p className="text-lg text-muted-foreground">
                            Need help choosing frames? Questions about your order? We respond within 2 hours during office hours.
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
                                        <h3 className="font-bold text-lg mb-1">Email</h3>
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
                                        <h3 className="font-bold text-lg mb-1">Phone</h3>
                                        <a href="tel:0175466566" className="text-muted-foreground hover:text-primary transition-colors">
                                            0175466566
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                                        <a href="https://wa.me/880175466566" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                            0175466566
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            BNS Center, <br />
                                            Sector 7, Uttara, Dhaka
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full h-[300px] rounded-lg overflow-hidden border bg-muted">
                                    <iframe
                                        src="https://maps.google.com/maps?q=BNS+Center+Sector+7+Uttara+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="BNS Center Location"
                                    ></iframe>
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
