import type { ApiResult, BasePageParams, PageResult } from './server';

export interface CategoryVo {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  description?: string;
}

export type CategoryPageResponse = PageResult<CategoryVo>;

export type CategoryListResponse = ApiResult<CategoryVo[]>;

export type CategoryResponse = ApiResult<CategoryVo>;

export type CategoryQueryParams = Record<string, unknown | undefined> & BasePageParams;

export interface CategoryCreateParams {
  name: string;
  slug: string;
  description?: string;
}

export interface CategoryUpdateParams extends CategoryCreateParams {
  id: string;
}

export type CategoryCreateResponse = Readonly<ApiResult<CategoryVo>>;

export type CategoryUpdateResponse = Readonly<ApiResult<CategoryVo>>;

export type CategoryDeleteResponse = void;
