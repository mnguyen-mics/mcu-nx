export type StatusCode = 'ok' | 'error';

interface ApiResponse {
  status: StatusCode;
}

export interface DataResponse<T> extends ApiResponse {
  data: T;
}

export interface DataListResponse<T> extends ApiResponse {
  data: T[];
  count: number;
  first_result?: number;
  max_results?: number;
  total?: number;
}