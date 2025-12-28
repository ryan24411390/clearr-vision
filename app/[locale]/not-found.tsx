import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NotFound() {
    // Safe fallback if translations fail availability in 404
    let t;
    try {
        t = useTranslations('NotFound');
    } catch (e) {
        t = (key: string) => {
            const defaults: Record<string, string> = {
                title: "Lost in the void?",
                description: "The page you're looking for seems to have vanished into the ether.",
                backHome: "Return to Clarity",
                help: "Visit Support"
            };
            return defaults[key] || key;
        };
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

            <div className="relative z-10 text-center px-4">
                <h1 className="text-[12rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/10 select-none">
                    404
                </h1>
                <div className="space-y-6 max-w-md mx-auto relative -top-8">
                    <h2 className="text-3xl font-bold tracking-tight">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {t('description')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Button asChild size="lg" className="rounded-full font-bold">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                {t('backHome')}
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full">
                            <Link href="/contact">
                                {t('help')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
