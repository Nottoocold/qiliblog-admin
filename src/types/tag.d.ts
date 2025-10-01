import type { BasePageParams, PageResult } from './server';

export interface TagVo {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export type TagPageResponse = PageResult<TagVo>;

export type TagListResponse = TagPageResponse['data']['list'];

export type TagQueryParams = Record<string, unknown | undefined> & BasePageParams;

export interface TagCreateParams {
  name: string;
  slug: string;
  description?: string;
}

export interface TagUpdateParams extends TagCreateParams {
  id: string;
}

export type TagCreateResponse = Readonly<TagVo>;

export type TagUpdateResponse = Readonly<TagVo>;

export type TagDeleteResponse = void;
