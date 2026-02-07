export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  status: number;
}
