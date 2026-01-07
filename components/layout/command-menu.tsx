"use client"

import * as React from "react"
import {
    Search,
    ShoppingBag,
    Glasses,
    Sun,
    Monitor,
    Smartphone,
    HelpCircle,
    User,
    CreditCard,
    MapPin,
    Truck,
    Calendar,
    Mail,
    Smile,
    Settings,
    Rocket
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useRouter } from "@/lib/navigation"

export function CommandMenu({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            {children ? (
                <div onClick={() => setOpen(true)}>{children}</div>
            ) : (
                <button
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
                    onClick={() => setOpen(true)}
                >
                    <span className="hidden lg:inline-flex">প্রোডাক্ট খুঁজুন...</span>
                    <span className="inline-flex lg:hidden">খুঁজুন...</span>
                    <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>
            )}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="কমান্ড টাইপ করুন বা খুঁজুন..." />
                <CommandList>
                    <CommandEmpty>কোনো ফলাফল পাওয়া যায়নি।</CommandEmpty>
                    <CommandGroup heading="সাজেশন">
                        <CommandItem onSelect={() => runCommand(() => router.push('/shop'))}>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>সব চশমা</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/power-finder'))}>
                            <Smartphone className="mr-2 h-4 w-4" />
                            <span>পাওয়ার খুঁজুন</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/virtual-try-on'))}>
                            <Smile className="mr-2 h-4 w-4" />
                            <span>ভার্চুয়াল ট্রাই-অন</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="শপ">
                        <CommandItem onSelect={() => runCommand(() => router.push('/shop?category=reading'))}>
                            <Glasses className="mr-2 h-4 w-4" />
                            <span>রিডিং গ্লাস</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/shop?category=sunglasses'))}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>সানগ্লাস</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/shop?category=computer'))}>
                            <Monitor className="mr-2 h-4 w-4" />
                            <span>কম্পিউটার গ্লাস</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="সাহায্য">
                        <CommandItem onSelect={() => runCommand(() => router.push('/track-order'))}>
                            <Truck className="mr-2 h-4 w-4" />
                            <span>অর্ডার ট্র্যাক করুন</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/contact'))}>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span>সাপোর্টে যোগাযোগ</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
