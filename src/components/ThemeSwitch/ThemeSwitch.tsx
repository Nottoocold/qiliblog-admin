import { useThemeStore } from '@/store/userTheme';
import { MoonOutlined, SunOutlined, SyncOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, type MenuProps } from 'antd';
import type React from 'react';
import { useShallow } from 'zustand/shallow';
import { ThemeIcon } from '../CustomerIcon/Theme/Theme';

interface ThemeSwitchProps {
  buttonText?: string;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = props => {
  const { buttonText } = props;
  const { setThemeMode, themeMode, theme } = useThemeStore(
    useShallow(state => ({
      setThemeMode: state.setThemeMode,
      themeMode: state.themeMode,
      theme: state.theme,
    }))
  );

  const items: MenuProps['items'] = [
    {
      key: 'light',
      label: '浅色主题',
      icon: <SunOutlined />,
      extra: themeMode === 'light' && <Badge status="success" />,
    },
    {
      key: 'dark',
      label: '暗色主题',
      icon: <MoonOutlined />,
      extra: themeMode === 'dark' && <Badge status="success" />,
    },
    {
      key: 'system',
      label: '跟随系统',
      icon: <SyncOutlined />,
      extra: themeMode === 'system' && <Badge status="success" />,
    },
  ];

  const onMenuClick: MenuProps['onClick'] = menu => {
    const { key } = menu;
    switch (key) {
      case 'light':
        setThemeMode('light');
        break;
      case 'dark':
        setThemeMode('dark');
        break;
      case 'system':
        setThemeMode('system');
        break;
    }
  };

  return (
    <Dropdown menu={{ items, onClick: onMenuClick }}>
      <Button
        type="text"
        icon={<ThemeIcon style={{ color: theme === 'dark' ? 'white' : 'black' }} />}
      >
        {buttonText ?? ''}
      </Button>
    </Dropdown>
  );
};

export default ThemeSwitch;
