"use client";

// Simple placeholder for useToast to avoid build errors if the full toaster isn't set up
export function useToast() {
    return {
        toast: (props: any) => {
            console.log("Toast:", props);
            // Fallback alert for now
            if (props.title) alert(props.title + "\n" + (props.description || ""));
        },
    };
}
