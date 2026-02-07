import { httpClient } from '@/core/common/api/httpClient';
import type { Product } from '../interfaces/product';

export const productsApi = {
  async getAllProducts(): Promise<Product[]> {
    return httpClient.get<Product[]>('/products', true);
  },

  async getProduct(id: number): Promise<Product> {
    return httpClient.get<Product>(`/products/${id}`, true);
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    return httpClient.get<Product[]>(`/products/category/${category}`, true);
  },

  async getAllCategories(): Promise<string[]> {
    return httpClient.get<string[]>('/products/categories', true);
  },
};
