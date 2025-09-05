import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import routes from '@/router/router';
import { generateMenus } from '@/utils/menuUtils';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Breadcrumb, theme } from 'antd';
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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menus = generateMenus(routes);
  console.table(menus);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ height: 32, margin: 16, textAlign: 'center' }} />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[menus[0].key]} items={menus} />
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
          <Breadcrumb
            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
            style={{ margin: '0 0 16px 0' }}
          />
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
