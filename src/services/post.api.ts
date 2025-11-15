import httpClient from '@/utils/http';
import { serializeParams } from '@/utils/urlUtils';
import type {
  PostCreateParams,
  PostCreateResponse,
  PostPageResponse,
  PostQueryParams,
  PostResponse,
  PostUpdateParams,
  PostUpdateResponse,
} from '@/types/post';

export const postApi = httpClient.extend(options => ({
  prefixUrl: `${options.prefixUrl}/admin`,
}));

/**
 * 获取文章分页列表
 */
export const getPostPage = (params: PostQueryParams) => {
  return postApi
    .get('post/page', { searchParams: serializeParams(params) })
    .json<PostPageResponse>();
};

/**
 * 获取文章详情
 */
export const getPost = (id: string) => {
  return postApi.get(`post/${id}`).json<PostResponse>();
};

/**
 * 更新文章
 */
export const updatePost = (post: PostUpdateParams) => {
  return postApi.put('post', { json: post }).json<PostUpdateResponse>();
};

/**
 * 删除文章
 */
export const deletePost = (id: string) => {
  return postApi.delete(`post/${id}`).json<void>();
};

/**
 * 批量删除文章
 */
export const batchDeletePosts = (ids: string[]) => {
  return postApi.delete('post/batch', { json: { ids } }).json<void>();
};

/**
 * 创建草稿文章
 */
export const createDraftPost = (post: PostCreateParams) => {
  return postApi.post('post/draft', { json: post }).json<PostResponse>();
};

/**
 * 创建并发布文章
 */
export const createAndPublishPost = (post: PostCreateParams) => {
  return postApi.post('post/direct/publish', { json: post }).json<PostResponse>();
};

/**
 * 发布文章
 */
export const publishPost = (id: string) => {
  return postApi.post(`post/${id}/publish`).json<PostResponse>();
};

/**
 * 取消发布文章
 */
export const unpublishPost = (id: string) => {
  return postApi.post(`post/${id}/unpublish`).json<PostResponse>();
};

/**
 * 复制文章
 */
export const copyPost = (id: string) => {
  return postApi.post(`post/${id}/copy`).json<PostCreateResponse>();
};
