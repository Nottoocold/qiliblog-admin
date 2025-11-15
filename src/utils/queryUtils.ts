import type { PageResult, BasePageParams } from '@/types/server';

interface TableQueryOptions<T> {
  delay?: number; // 模拟延迟时间
  sortEntry?: { name: string; order: 'asc' | 'desc' | undefined }[];
  transform?: (data: T) => T; // 数据转换函数
}

export const createAntdTableQuery = <T, P extends BasePageParams & Record<string, unknown>>(
  apiCall: (params: P) => Promise<PageResult<T>>,
  options?: TableQueryOptions<T>
) => {
  return async (
    pageParams: { current: number; pageSize: number },
    formData: Record<string, unknown> = {}
  ) => {
    const sortBy = options?.sortEntry
      ?.map(entry => `${entry.name} ${entry.order || 'asc'}`)
      .join(',');
    const params = { ...pageParams, ...formData, sortBy } as P;
    const resp = await apiCall(params);

    // 如果设置了延迟
    const delay = options?.delay ?? 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    // 返回符合 useAntdTable 要求的数据格式
    const result = {
      total: resp.data.total,
      list: options?.transform ? resp.data.list.map(options.transform) : resp.data.list,
    };

    return result;
  };
};
