"use client";

import { User, Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "./AdminSidebar";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminHeader() {
    return (
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <AdminSidebar className="flex w-full h-full static border-none shadow-none" />
                    </SheetContent>
                </Sheet>

                {/* Search (Visual only for now) */}
                <div className="hidden md:flex items-center relative max-w-sm w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-[200px] lg:w-[300px] pl-9 h-9 bg-muted/50 border-muted-foreground/20 focus-visible:bg-background transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
                </Button>

                <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 flex items-center gap-2 rounded-full pl-2 pr-4 hover:bg-muted/50">
                            <Avatar className="h-8 w-8 border border-border">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="@admin" />
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">AD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-sm hidden sm:flex">
                                <span className="font-semibold leading-none">Administrator</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[100px]">System Admin</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Administrator</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    admin@clearr-vision.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
