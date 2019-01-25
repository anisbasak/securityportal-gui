export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    code: number;
    message: string;
    id?: string;
  };
}
