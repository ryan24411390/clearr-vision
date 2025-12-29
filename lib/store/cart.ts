import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // Product ID + Variant ID
    productId: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    variant?: {
        power?: string;
        color?: string;
    };
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (item) => item.id === newItem.id
                    );

                    if (existingItemIndex > -1) {
                        // Item exists, update quantity
                        const newItems = [...state.items];
                        newItems[existingItemIndex].quantity += newItem.quantity;
                        return { items: newItems };
                    }

                    // New item
                    return { items: [...state.items, newItem] };
                });
            },
            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }));
            },
            updateQuantity: (id, quantity) => {
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter((item) => item.id !== id),
                        };
                    }
                    return {
                        items: state.items.map((item) =>
                            item.id === id ? { ...item, quantity } : item
                        ),
                    };
                });
            },
            clearCart: () => set({ items: [] }),
            getCartTotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },
            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'smart-reading-cart', // unique name for localStorage
        }
    )
);
