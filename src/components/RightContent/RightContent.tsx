import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space, type MenuProps } from 'antd';
import type React from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { logout } from '@/services/auth.api';
import { clearToken } from '@/utils/tokenUtils';
import { useShallow } from 'zustand/shallow';
import { useAntd } from '../AntdAppWrapper/AntdContext';

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
  const { message } = useAntd();
  const { setUserState, user } = useUserStore(
    useShallow(state => ({ setUserState: state.setUserState, user: state.user }))
  );

  const onMenuClick: MenuProps['onClick'] = useCallback(
    ({ key }: { key: string }) => {
      if (key === 'logout') {
        message.info('退出登录');
        // 清理用户信息和认证状态
        logout().then(() => {
          clearToken();
          setUserState(null, false);
          navigate('/login');
        });
      } else if (key === 'profile') {
        message.info('个人中心');
      }
    },
    [navigate, message, setUserState]
  );

  return (
    <Dropdown menu={{ items, onClick: onMenuClick }}>
      <div style={{ cursor: 'pointer', padding: '0', display: 'inline-block' }}>
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span>{user?.nickname}</span>
        </Space>
      </div>
    </Dropdown>
  );
};

export default RightContent;
