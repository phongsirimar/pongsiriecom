'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const exists = get().items.some((i) => i.id === product.id);
        if (exists) {
          set((state) => ({ items: state.items.filter((i) => i.id !== product.id) }));
          toast.success('Removed from wishlist');
        } else {
          set((state) => ({ items: [...state.items, product] }));
          toast.success('Added to wishlist');
        }
      },

      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== productId) })),

      isWishlisted: (productId) => get().items.some((i) => i.id === productId),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage)
      ),
    }
  )
);

