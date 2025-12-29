import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RecentlyViewedProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    viewedAt: number;
}

interface RecentlyViewedState {
    products: RecentlyViewedProduct[];
    addProduct: (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => void;
    clearHistory: () => void;
    getRecentProducts: (limit?: number) => RecentlyViewedProduct[];
}

const MAX_RECENT_PRODUCTS = 10;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
    persist(
        (set, get) => ({
            products: [],
            addProduct: (product) => {
                set((state) => {
                    // Remove if already exists
                    const filtered = state.products.filter(p => p.id !== product.id);
                    // Add to front with timestamp
                    const updated = [
                        { ...product, viewedAt: Date.now() },
                        ...filtered
                    ].slice(0, MAX_RECENT_PRODUCTS);
                    return { products: updated };
                });
            },
            clearHistory: () => set({ products: [] }),
            getRecentProducts: (limit = 4) => {
                return get().products.slice(0, limit);
            }
        }),
        {
            name: 'clearr-vision-recently-viewed',
        }
    )
);
