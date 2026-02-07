const BASE_URL = 'https://fakestoreapi.com';

// Dynamic import to avoid circular dependency
// This will be available once useAuthStore is created
let getTokenFn: (() => string | null) | null = null;

export const setGetTokenFn = (fn: () => string | null) => {
  getTokenFn = fn;
};

export interface RequestConfig extends RequestInit {
  url: string;
  requiresAuth?: boolean;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request<T>(config: RequestConfig): Promise<T> {
    const { url, requiresAuth = false, headers = {}, ...restConfig } = config;

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add JWT token if authentication required
    if (requiresAuth && getTokenFn) {
      const token = getTokenFn();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...restConfig,
        headers: requestHeaders,
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP Error: ${response.status}`,
          status: response.status,
          code: errorData.code,
        };
      }

      return await response.json();
    } catch (error: any) {
      // Network errors or parsing errors
      throw {
        message: error.message || 'Network request failed',
        status: error.status,
        code: error.code,
      };
    }
  }

  get<T>(url: string, requiresAuth = false): Promise<T> {
    return this.request<T>({
      url,
      method: 'GET',
      requiresAuth,
    });
  }

  post<T>(url: string, data?: any, requiresAuth = false): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  put<T>(url: string, data?: any, requiresAuth = false): Promise<T> {
    return this.request<T>({
      url,
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  delete<T>(url: string, requiresAuth = false): Promise<T> {
    return this.request<T>({
      url,
      method: 'DELETE',
      requiresAuth,
    });
  }
}

export const httpClient = new HttpClient();
