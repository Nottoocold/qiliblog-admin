export interface ApiResult<T> {
  errorCode: number;
  errorDesc: string;
  data: T;
}

export type PageResult<T> = ApiResult<{
  total: number;
  current: number;
  pageSize: number;
  pages: number;
  hasPre: boolean;
  hasNext: boolean;
  list: T[];
}>;

export interface SortEntry {
  name: string;
  asc: boolean;
  weight?: number;
}

export interface BasePageParams {
  current: number;
  pageSize: number;
  sortBy?: string;
}
