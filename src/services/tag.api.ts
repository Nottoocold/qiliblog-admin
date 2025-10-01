import type { TagPageResponse, TagQueryParams } from '@/types/tag';
import httpClient from '@/utils/http';
import { serializeParams } from '@/utils/urlUtils';

export const tagApi = httpClient.extend(options => ({
  prefixUrl: `${options.prefixUrl}/admin/tag`,
}));

export const getTagPage = (params: TagQueryParams) => {
  return tagApi.get('page', { searchParams: serializeParams(params) }).json<TagPageResponse>();
};
