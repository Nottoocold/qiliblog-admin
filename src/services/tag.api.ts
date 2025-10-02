import type {
  TagCreateParams,
  TagCreateResponse,
  TagPageResponse,
  TagQueryParams,
  TagResponse,
  TagUpdateParams,
  TagUpdateResponse,
} from '@/types/tag';
import httpClient from '@/utils/http';
import { serializeParams } from '@/utils/urlUtils';

export const tagApi = httpClient.extend(options => ({
  prefixUrl: `${options.prefixUrl}/admin`,
}));

export const getTagPage = (params: TagQueryParams) => {
  return tagApi.get('tag/page', { searchParams: serializeParams(params) }).json<TagPageResponse>();
};

export const getTag = (id: string) => {
  return tagApi.get(`tag/${id}`).json<TagResponse>();
};

export const createTag = (tag: TagCreateParams) => {
  return tagApi.post('tag', { json: tag }).json<TagCreateResponse>();
};

export const updateTag = (tag: TagUpdateParams) => {
  return tagApi.put('tag', { json: tag }).json<TagUpdateResponse>();
};

export const deleteTag = (id: string) => {
  return tagApi.delete(`tag/${id}`).json<void>();
};
