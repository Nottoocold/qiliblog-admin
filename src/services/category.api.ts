import httpClient from '@/utils/http';
import { serializeParams } from '@/utils/urlUtils';
import type {
  CategoryCreateParams,
  CategoryCreateResponse,
  CategoryListResponse,
  CategoryPageResponse,
  CategoryQueryParams,
  CategoryResponse,
  CategoryUpdateParams,
  CategoryUpdateResponse,
} from '@/types/category';

export const categoryApi = httpClient.extend(options => ({
  prefixUrl: `${options.prefixUrl}/admin`,
}));

export const getCategoryPage = (params: CategoryQueryParams) => {
  return categoryApi
    .get('category/page', { searchParams: serializeParams(params) })
    .json<CategoryPageResponse>();
};

export const getCategoryList = (params?: CategoryQueryParams) => {
  return categoryApi
    .get('category/list', { searchParams: serializeParams(params ?? {}) })
    .json<CategoryListResponse>();
};

export const getCategory = (id: string) => {
  return categoryApi.get(`category/${id}`).json<CategoryResponse>();
};

export const createCategory = (category: CategoryCreateParams) => {
  return categoryApi.post('category', { json: category }).json<CategoryCreateResponse>();
};

export const updateCategory = (category: CategoryUpdateParams) => {
  return categoryApi.put('category', { json: category }).json<CategoryUpdateResponse>();
};

export const deleteCategory = (id: string) => {
  return categoryApi.delete(`category/${id}`).json<void>();
};
