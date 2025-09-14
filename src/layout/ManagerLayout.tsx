import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useMemo } from 'react';
import routes from '@/router/router';
import menuUtils from '@/utils/menuUtils';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme, type MenuProps } from 'antd';
import RightContent from '@/components/RightContent/RightContent';

const { Header, Sider, Content, Footer } = Layout;

const footerStyle: React.CSSProperties = { textAlign: 'center', height: 65 };

const contentStyle: React.CSSProperties = {
  // margin: '24px 16px',
  margin: 0,
  padding: 24,
  overflowX: 'hidden',
  overflowY: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

export default function ManagerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const menus = useMemo(() => menuUtils.generateMenus(routes), []);

  const menuSelect: MenuProps['onSelect'] = ({ key }) => {
    if (key !== location.pathname) {
      navigate(key);
    }
  };

  // 计算当前路径对应的展开菜单项
  const getDefaultOpenKeys = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const keys: string[] = [];
    let currentPath = '';

    pathSnippets.forEach(snippet => {
      currentPath += `/${snippet}`;
      keys.push(currentPath);
    });

    return keys;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: colorBgContainer }}
      >
        <div style={{ height: 32, margin: 16, textAlign: 'center' }} />
        <Menu
          theme="light"
          mode="inline"
          onSelect={menuSelect}
          selectedKeys={[location.pathname]}
          defaultOpenKeys={getDefaultOpenKeys()}
          items={menus}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: 'sticky',
            top: 0,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* 左边内容 */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          {/* 中间留空 */}
          <div style={{ flex: 1 }} />
          {/* 右边内容 */}
          <div style={{ marginRight: 16 }}>
            <RightContent />
          </div>
        </Header>
        <Content style={contentStyle}>
          <div
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: 12,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={footerStyle}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED.
        </Footer>
      </Layout>
    </Layout>
  );
}
