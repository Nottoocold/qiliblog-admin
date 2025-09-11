export interface ApiResult<T> {
  errorCode: number;
  errorDesc: string;
  data: T;
}
