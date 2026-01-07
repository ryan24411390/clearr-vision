"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Glasses, Sun, Monitor, Smartphone, BookOpen, User, HelpCircle } from "lucide-react"

const ListItem = React.forwardRef<
    React.ElementRef<typeof Link>,
    React.ComponentPropsWithoutRef<typeof Link> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
    return (
        <motion.li
            variants={{
                hidden: { opacity: 0, y: 5 },
                show: { opacity: 1, y: 0 }
            }}
        >
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-foreground/5 hover:text-foreground focus:bg-foreground/5 focus:text-foreground group",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center text-sm font-medium leading-none text-foreground/90 group-hover:text-primary transition-colors">
                        {icon && <span className="mr-2 text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>}
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5 group-hover:text-foreground/70 transition-colors">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </motion.li>
    )
})
ListItem.displayName = "ListItem"

export function MegaMenu() {
    const pathname = usePathname();

    // Check if current route is within a section
    const isShopActive = pathname.startsWith('/shop') || pathname.startsWith('/virtual-try-on');
    const isExploreActive = pathname.startsWith('/quiz') || pathname.startsWith('/blog') || pathname.startsWith('/about');
    const isContactActive = pathname.startsWith('/contact');

    const listVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const components = [
        {
            title: "ভার্চুয়াল ট্রাই-অন",
            href: "/virtual-try-on",
            desc: "দেখুন ফ্রেম আপনার চেহারায় কেমন দেখায়",
            icon: <User className="w-4 h-4" />
        },
        {
            title: "পাওয়ার খুঁজুন",
            href: "/quiz",
            desc: "আপনার জন্য সঠিক লেন্স পাওয়ার বের করুন",
            icon: <Smartphone className="w-4 h-4" />
        },
        {
            title: "ব্লগ",
            href: "/blog",
            desc: "চোখের যত্ন ও স্টাইল গাইড",
            icon: <BookOpen className="w-4 h-4" />
        },
        {
            title: "আমাদের গল্প",
            href: "/about",
            desc: "কেন আমরা Smart Reading শুরু করলাম",
            icon: <HelpCircle className="w-4 h-4" />
        },
    ];

    const triggerBaseClass = "bg-transparent hover:bg-transparent data-[state=open]:bg-transparent focus:bg-transparent font-medium text-base transition-colors duration-300 relative";
    const activeTriggerClass = "text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full";
    const inactiveTriggerClass = "text-foreground/80 hover:text-foreground";

    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(triggerBaseClass, isShopActive ? activeTriggerClass : inactiveTriggerClass)}>
                        শপ
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <motion.ul
                            className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl"
                            initial="hidden"
                            whileInView="show"
                            variants={listVariants}
                        >
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-end rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 no-underline outline-none focus:shadow-md border border-border overflow-hidden relative group hover:border-primary/50 transition-colors duration-500"
                                        href="/shop"
                                    >
                                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                                        <Glasses className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform duration-500" />
                                        <div className="mb-2 mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                            কালেকশন দেখুন
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground font-medium">
                                            আমাদের সব ফ্রেম ব্রাউজ করুন এবং পছন্দের জুড়ি খুঁজুন।
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/shop?category=reading" title="রিডিং গ্লাস" icon={<Glasses className="w-4 h-4" />}>
                                বই, পত্রিকা এবং কাছের কাজের জন্য
                            </ListItem>
                            <ListItem href="/shop?category=sunglasses" title="সানগ্লাস" icon={<Sun className="w-4 h-4" />}>
                                স্টাইলের সাথে UV প্রোটেকশন
                            </ListItem>
                            <ListItem href="/shop?category=computer" title="কম্পিউটার গ্লাস" icon={<Monitor className="w-4 h-4" />}>
                                স্ক্রিন টাইমের জন্য ব্লু লাইট ব্লকিং
                            </ListItem>
                        </motion.ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(triggerBaseClass, isExploreActive ? activeTriggerClass : inactiveTriggerClass)}>
                        এক্সপ্লোর
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <motion.ul
                            className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl"
                            initial="hidden"
                            whileInView="show"
                            variants={listVariants}
                        >
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                    icon={component.icon}
                                >
                                    {component.desc}
                                </ListItem>
                            ))}
                        </motion.ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={cn(
                        navigationMenuTriggerStyle(),
                        triggerBaseClass,
                        isContactActive ? activeTriggerClass : inactiveTriggerClass
                    )}>
                        <Link href="/contact">
                            যোগাযোগ
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
