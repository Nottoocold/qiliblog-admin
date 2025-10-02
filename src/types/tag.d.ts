import type { ApiResult, BasePageParams, PageResult } from './server';

export interface TagVo {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  description?: string;
}

export type TagPageResponse = PageResult<TagVo>;

export type TagListResponse = ApiResult<TagVo[]>;

export type TagResponse = ApiResult<TagVo>;

export type TagQueryParams = Record<string, unknown | undefined> & BasePageParams;

export interface TagCreateParams {
  name: string;
  slug: string;
  description?: string;
}

export interface TagUpdateParams extends TagCreateParams {
  id: string;
}

export type TagCreateResponse = Readonly<ApiResult<TagVo>>;

export type TagUpdateResponse = Readonly<ApiResult<TagVo>>;

export type TagDeleteResponse = void;
