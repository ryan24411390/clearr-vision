"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    description?: string;
    type: ToastType;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { ...toast, id }]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
}

function ToastContainer() {
    const context = useContext(ToastContext);
    if (!context) return null;

    const { toasts, removeToast } = context;

    const getIcon = (type: ToastType) => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "error":
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case "info":
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={cn(
                            "relative flex items-start gap-3 rounded-lg border bg-card p-4 shadow-lg backdrop-blur-sm",
                            toast.type === "success" && "border-green-500/20",
                            toast.type === "error" && "border-red-500/20",
                            toast.type === "info" && "border-blue-500/20"
                        )}
                    >
                        {getIcon(toast.type)}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                                {toast.message}
                            </p>
                            {toast.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {toast.description}
                                </p>
                            )}
                            {toast.action && (
                                <button
                                    onClick={toast.action.onClick}
                                    className="text-xs font-medium text-primary hover:underline mt-2"
                                >
                                    {toast.action.label}
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return {
        success: (message: string, options?: { description?: string; action?: Toast["action"] }) =>
            context.addToast({ message, type: "success", ...options }),
        error: (message: string, options?: { description?: string; action?: Toast["action"] }) =>
            context.addToast({ message, type: "error", ...options }),
        info: (message: string, options?: { description?: string; action?: Toast["action"] }) =>
            context.addToast({ message, type: "info", ...options }),
    };
}
