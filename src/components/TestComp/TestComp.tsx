import type React from 'react';
import { useAntd } from '../AntdAppWrapper/AntdContext';
import httpClient, { handleHttpError, refreshManager } from '@/utils/http';
import { Button, Space } from 'antd';
import type { ApiResult } from '@/types/server';

const TestComp: React.FC = () => {
  const { message } = useAntd();
  const concurrentRequests = 5;
  const handleClick = async () => {
    try {
      const res = await httpClient.get('admin/protect').json<ApiResult<string>>();
      message.success(res.data);
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleConcurrentRequests = () => {
    Array.from({ length: concurrentRequests }).forEach(async () => {
      try {
        const res = await httpClient.get('admin/protect').json<ApiResult<string>>();
        message.success(res.data);
      } catch (error) {
        handleHttpError(error);
      }
    });
  };

  const handleRefreshToken = async () => {
    try {
      await refreshManager.refresh();
      message.success('刷新令牌成功');
    } catch (error) {
      handleHttpError(error);
    }
  };
  return (
    <Space>
      <Button type="primary" onClick={handleClick}>
        获取数据
      </Button>
      <Button type="primary" onClick={handleConcurrentRequests}>
        并发{concurrentRequests}个请求
      </Button>
      <Button type="primary" onClick={handleRefreshToken}>
        刷新令牌
      </Button>
    </Space>
  );
};

export default TestComp;
