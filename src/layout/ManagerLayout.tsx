import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useMemo } from 'react';
import routes from '@/router/router';
import menuUtils from '@/utils/menuUtils';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Breadcrumb, theme, type MenuProps } from 'antd';
import RightContent from '@/components/RightContent/RightContent';
import type { RouterItem } from '@/types/route';

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
  // 存储当前选中的菜单keyPath
  const [selectedKeyPath, setSelectedKeyPath] = useState<string[]>([]);

  const menus = useMemo(() => menuUtils.generateMenus(routes), []);
  console.log('routes', routes);
  console.log('menus', menus);

  const menuClick: MenuProps['onClick'] = info => {
    console.log('菜单点击:', info.key, info.keyPath);
    if (info.key !== location.pathname) {
      setSelectedKeyPath(info.keyPath);
      // console.log('当前路径:', location.pathname);
      // console.log('跳转:', info.key);
      navigate(info.key);
    }
  };

  // 在路由配置中查找对应的路由信息
  const findRoute = (routes: RouterItem[], key: string): RouterItem | undefined => {
    for (const route of routes) {
      if (route.meta?.key === key) {
        return route;
      }
      if (route.children) {
        const found = findRoute(route.children, key);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  };

  // 根据菜单keyPath生成面包屑数据
  const generateBreadcrumbsFromKeyPath = (keyPath: string[], routes: RouterItem[]) => {
    const breadcrumbItems = keyPath
      .slice()
      .reverse()
      .map(key => {
        const route = findRoute(routes, key);
        return route
          ? {
              title: route.meta?.title || key,
              href: route.path,
            }
          : {
              title: key,
              href: key,
            };
      });

    return breadcrumbItems.map((item, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { href, ...rest } = item;
      return index == breadcrumbItems.length - 1 ? { ...rest } : item;
    });
    // return breadcrumbItems;
  };

  // 生成当前页面的面包屑数据
  const currentBreadcrumbs = selectedKeyPath.length
    ? generateBreadcrumbsFromKeyPath(selectedKeyPath, routes)
    : [{ title: '首页', href: '/' }];

  console.log('current breads', currentBreadcrumbs);

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
          onClick={menuClick}
          defaultSelectedKeys={[location.pathname === '/' ? '/home' : location.pathname]}
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
          <Breadcrumb items={currentBreadcrumbs} style={{ margin: '0 0 16px 0' }} />
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
