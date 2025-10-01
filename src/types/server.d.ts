interface ApiResult<T> {
  errorCode: number;
  errorDesc: string;
  data: T;
}

interface PageData<T> {
  total: number;
  current: number;
  pageSize: number;
  pages: number;
  hasPre: boolean;
  hasNext: boolean;
  list: T[];
}

type PageResult<T> = ApiResult<PageData<T>>;

interface BasePageParams {
  current: number;
  pageSize: number;
  sortBy?: string;
}

export type ApiResult<T> = Readonly<ApiResult<T>>;
export type PageResult<T> = Readonly<PageResult<T>>;
export type BasePageParams = Readonly<BasePageParams>;
