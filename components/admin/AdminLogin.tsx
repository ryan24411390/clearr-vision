"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "@/lib/navigation";

export function AdminLogin() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoginLoading(true);

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
                credentials: 'include',
            });

            if (res.ok) {
                toast.success("Login successful");
                // Refresh the page to trigger layout middleware/getServerSideProps equivalent logic
                // or simpler: just let layout re-render if it reacts to state, 
                // but since layout is server component logic mostly, we might need a router refresh
                router.refresh();
            } else {
                toast.error("Invalid password");
            }
        } catch {
            toast.error("Login failed");
        } finally {
            setLoginLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/20">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-2xl">Admin Access</CardTitle>
                    <p className="text-muted-foreground">Enter password to continue</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loginLoading || !password}>
                            {loginLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
