import type { ApiResult, BasePageParams, PageResult } from './server';
import type { CategoryVo } from './category';
import type { TagVo } from './tag';

/**
 * 文章状态枚举
 * 0: 草稿(DRAFT)
 * 1: 已发布(PUBLISHED)
 * 2: 私密(PRIVATE)
 */
export enum ArticleStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  PRIVATE = 2,
}

/**
 * 文章视图对象
 */
export interface PostVo {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  coverImage?: string;
  status: number;
  categoryId: string;
  category: CategoryVo;
  tagIds: string[];
  tagList: TagVo[];
  authorId: string;
  authorName: string;
  top: number;
  recommend: number;
  allowComment: number;
  publishAt?: string;
  publishedTime: string;
  modifiedTime: string;
  viewCount: number;
  likeCount: number;
  wordCount: number;
  readTime?: string;
}

/**
 * 文章分页查询参数
 */
export type PostQueryParams = BasePageParams &
  Record<string, unknown> & {
    word?: string; // 关键词搜索（标题、内容）
    status?: number; // 状态筛选: 0草稿, 1已发布, 2私密
    categoryId?: string; // 分类筛选
    tagId?: string; // 标签筛选
    authorId?: string; // 作者筛选
    startDate?: string; // 开始时间
    endDate?: string; // 结束时间
  };

/**
 * 文章创建参数
 */
export interface PostCreateParams {
  title: string;
  slug?: string; // 如果不提供，自动生成
  content: string;
  summary?: string; // 描述, 如果不提供，自动生成
  coverImage?: string;
  status: number;
  categoryId: string;
  tagIds: string[]; // 标签ID列表
  authorId: string;
  top?: number;
  recommend?: number;
  allowComment?: number;
  publishAt?: string; // 定时发布
  [key: string]: unknown; // 索引签名，允许动态字段
}

/**
 * 文章更新参数
 */
export interface PostUpdateParams extends PostCreateParams {
  id: string;
}

/**
 * API 响应类型
 */
export type PostPageResponse = PageResult<PostVo>;
export type PostListResponse = ApiResult<PostVo[]>;
export type PostResponse = ApiResult<PostVo>;
export type PostCreateResponse = ApiResult<PostVo>;
export type PostUpdateResponse = ApiResult<PostVo>;
export type PostDeleteResponse = void;
