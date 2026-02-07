export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  isLocal?: boolean; // Flag to identify locally created products
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface ProductError {
  message: string;
  status?: number;
}

export interface CreateProductDto {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string; // Base64 string or URI
}
