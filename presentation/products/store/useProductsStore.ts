import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product, CreateProductDto } from '@/core/products/interfaces/product';
import { productsActions } from '@/core/products/actions/products-actions';

interface ProductsState {
  // State
  products: Product[];
  localProducts: Product[];
  selectedProduct: Product | null;
  categories: string[];
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  selectProduct: (product: Product | null) => void;
  selectCategory: (category: string | null) => void;
  createLocalProduct: (productDto: CreateProductDto) => Promise<void>;
  clearError: () => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      localProducts: [],
      selectedProduct: null,
      categories: [],
      selectedCategory: null,
      isLoading: false,
      error: null,

      // Fetch all products (API + local)
      fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const apiProducts = await productsActions.fetchAllProducts();
          const { localProducts } = get();
          // Combine API products with local products
          const allProducts = [...localProducts, ...apiProducts];
          set({ products: allProducts, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Error al cargar productos',
            isLoading: false,
          });
        }
      },

      // Fetch products by category
      fetchProductsByCategory: async (category: string) => {
        set({ isLoading: true, error: null, selectedCategory: category });
        try {
          const apiProducts = await productsActions.fetchProductsByCategory(category);
          const { localProducts } = get();
          // Filter local products by category
          const filteredLocalProducts = localProducts.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
          );
          const allProducts = [...filteredLocalProducts, ...apiProducts];
          set({ products: allProducts, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Error al cargar productos',
            isLoading: false,
          });
        }
      },

      // Fetch categories
      fetchCategories: async () => {
        try {
          const categories = await productsActions.fetchCategories();
          set({ categories });
        } catch (error: any) {
          set({ error: error.message || 'Error al cargar categorías' });
        }
      },

      // Create local product
      createLocalProduct: async (productDto: CreateProductDto) => {
        try {
          const { localProducts, products } = get();

          // Generate a unique ID for the local product (using negative IDs)
          const newId = localProducts.length > 0
            ? Math.min(...localProducts.map(p => p.id)) - 1
            : -1;

          const newProduct: Product = {
            id: newId,
            ...productDto,
            rating: {
              rate: 0,
              count: 0,
            },
            isLocal: true,
          };

          const updatedLocalProducts = [newProduct, ...localProducts];
          const updatedAllProducts = [newProduct, ...products];

          set({
            localProducts: updatedLocalProducts,
            products: updatedAllProducts,
          });
        } catch (error: any) {
          set({ error: error.message || 'Error al crear producto' });
          throw error;
        }
      },

      // Select product for detail view
      selectProduct: (product: Product | null) => {
        set({ selectedProduct: product });
      },

      // Select category filter
      selectCategory: (category: string | null) => {
        set({ selectedCategory: category });
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'products-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        localProducts: state.localProducts,
      }),
    }
  )
);
