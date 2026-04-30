import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  size: string;
  qty: number;
}

export interface Filters {
  category: string | null;
  subCategory: string | null;
  sort: string;
  priceMax: number;
  inStock: boolean;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Filters
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;

  // UI State
  isSideMenuOpen: boolean;
  isFilterPanelOpen: boolean;
  isCartOpen: boolean;
  toggleSideMenu: () => void;
  toggleFilterPanel: () => void;
  toggleCart: (forceOpen?: boolean) => void;
  closeAll: () => void;
}

const defaultFilters: Filters = {
  category: null,
  subCategory: null,
  sort: 'newest',
  priceMax: 15000,
  inStock: false,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (item) => {
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (i) => i.id === item.id && i.size === item.size
          );
          if (existingIndex >= 0) {
            const newCart = [...state.cart];
            newCart[existingIndex].qty += 1;
            return { cart: newCart };
          }
          return { cart: [...state.cart, { ...item, qty: 1 }] };
        });
      },
      removeFromCart: (index) => {
        set((state) => ({
          cart: state.cart.filter((_, i) => i !== index),
        }));
      },
      updateQuantity: (index, qty) => {
        set((state) => {
          const newCart = [...state.cart];
          if (qty <= 0) {
            return { cart: newCart.filter((_, i) => i !== index) };
          }
          newCart[index].qty = qty;
          return { cart: newCart };
        });
      },
      clearCart: () => set({ cart: [] }),
      cartTotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      },
      cartCount: () => {
        return get().cart.reduce((sum, item) => sum + item.qty, 0);
      },

      // Filters
      filters: defaultFilters,
      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },
      resetFilters: () => set({ filters: defaultFilters }),

      // UI State
      isSideMenuOpen: false,
      isFilterPanelOpen: false,
      isCartOpen: false,
      toggleSideMenu: () => {
        set((state) => ({
          isSideMenuOpen: !state.isSideMenuOpen,
          isFilterPanelOpen: false,
          isCartOpen: false,
        }));
      },
      toggleFilterPanel: () => {
        set((state) => ({
          isFilterPanelOpen: !state.isFilterPanelOpen,
          isSideMenuOpen: false,
          isCartOpen: false,
        }));
      },
      toggleCart: (forceOpen) => {
        set((state) => ({
          isCartOpen: forceOpen !== undefined ? forceOpen : !state.isCartOpen,
          isSideMenuOpen: false,
          isFilterPanelOpen: false,
        }));
      },
      closeAll: () => {
        set({
          isSideMenuOpen: false,
          isFilterPanelOpen: false,
          isCartOpen: false,
        });
      },
    }),
    {
      name: 'zamora-store',
      partialize: (state) => ({ cart: state.cart }), // Only persist cart
    }
  )
);
