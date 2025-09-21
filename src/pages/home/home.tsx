import { useAntd } from '@/components/AntdAppWrapper/AntdContext';
import type { ApiResult } from '@/types/server';
import httpClient, { handleHttpError } from '@/utils/http';
import refreshManager from '@/utils/rtk';
import { Button, Space } from 'antd';
import type React from 'react';

const Home: React.FC = () => {
  const { message } = useAntd();
  const handleClick = async () => {
    try {
      const res = await httpClient.get('admin/protect').json<ApiResult<string>>();
      console.log('res', res);
      message.success(res.data);
    } catch (error) {
      handleHttpError(error);
    }
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
      <Button type="primary" onClick={handleRefreshToken}>
        刷新令牌
      </Button>
    </Space>
  );
};

export default Home;
