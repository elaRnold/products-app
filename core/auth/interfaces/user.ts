export interface User {
  id: number;
  email: string;
  username: string;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
  address?: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthError {
  message: string;
  status?: number;
}
