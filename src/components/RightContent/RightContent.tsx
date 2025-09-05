import tokenUtils from '@/utils/tokenUtils';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { App, Avatar, Dropdown, Space, type MenuProps } from 'antd';
import type React from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const items: MenuProps['items'] = [
  {
    key: 'profile',
    label: '个人中心',
    icon: <SettingOutlined />,
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: <LogoutOutlined />,
  },
];

const RightContent: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onMenuClick: MenuProps['onClick'] = useCallback(
    ({ key }: { key: string }) => {
      if (key === 'logout') {
        message.info('退出登录');
        tokenUtils.clearToken();
        navigate('/login');
      } else if (key === 'profile') {
        message.info('个人中心');
      }
    },
    [navigate, message]
  );

  return (
    <Dropdown menu={{ items, onClick: onMenuClick }}>
      <div style={{ cursor: 'pointer', padding: '0', display: 'inline-block' }}>
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span>七里之外</span>
        </Space>
      </div>
    </Dropdown>
  );
};

export default RightContent;
