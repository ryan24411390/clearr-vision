"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="flex gap-2">
            <Button
                variant={locale === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => switchLocale("en")}
            >
                EN
            </Button>
            <Button
                variant={locale === "bn" ? "default" : "outline"}
                size="sm"
                onClick={() => switchLocale("bn")}
            >
                বাংলা
            </Button>
        </div>
    );
}
