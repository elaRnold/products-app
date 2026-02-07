import { productsApi } from '../api/productsApi';
import type { Product } from '../interfaces/product';

export const productsActions = {
  async fetchAllProducts(): Promise<Product[]> {
    try {
      return await productsApi.getAllProducts();
    } catch (error: any) {
      throw {
        message: error.message || 'Error al cargar productos',
        status: error.status,
      };
    }
  },

  async fetchProduct(id: number): Promise<Product> {
    try {
      return await productsApi.getProduct(id);
    } catch (error: any) {
      throw {
        message: error.message || 'Error al cargar producto',
        status: error.status,
      };
    }
  },

  async fetchProductsByCategory(category: string): Promise<Product[]> {
    try {
      return await productsApi.getProductsByCategory(category);
    } catch (error: any) {
      throw {
        message: error.message || 'Error al cargar productos por categoría',
        status: error.status,
      };
    }
  },

  async fetchCategories(): Promise<string[]> {
    try {
      return await productsApi.getAllCategories();
    } catch (error: any) {
      throw {
        message: error.message || 'Error al cargar categorías',
        status: error.status,
      };
    }
  },
};
