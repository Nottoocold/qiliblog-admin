import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useMemo } from 'react';
import routes from '@/router/router';
import menuUtils from '@/utils/menuUtils';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme, type MenuProps } from 'antd';
import RightContent from '@/components/RightContent/RightContent';
import { useToggle } from 'ahooks';

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
  const [collapsed, setCollapsed] = useToggle(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG, Layout: layoutToken = { headerHeight: 64 } },
  } = theme.useToken();

  const menus = useMemo(() => menuUtils.generateMenus(routes), []);

  // 计算需要展开的菜单项，基于路由配置自动匹配（支持动态路由）
  const computedOpenKeys = useMemo(() => {
    return menuUtils.findOpenMenuKeys(location.pathname, routes);
  }, [location.pathname]);

  // 菜单展开状态，支持用户手动操作
  const [openKeys, setOpenKeys] = React.useState<string[]>(computedOpenKeys);

  // 当路径变化时，更新展开的菜单项
  React.useEffect(() => {
    setOpenKeys(computedOpenKeys);
  }, [computedOpenKeys]);

  const menuSelect: MenuProps['onSelect'] = ({ key }) => {
    if (key !== location.pathname) {
      navigate(key);
    }
  };

  const handleOpenChange: MenuProps['onOpenChange'] = keys => {
    console.log('onOpenChange', keys);
    setOpenKeys(keys);
  };

  // 计算选中的菜单项，基于路由配置自动匹配
  const selectedKeys = useMemo(() => {
    const matchedKey = menuUtils.findMatchedMenuKey(location.pathname, routes);
    // 如果找到匹配的菜单键，返回它；否则返回路径名作为备选
    return matchedKey ? [matchedKey] : [location.pathname];
  }, [location.pathname]);

  const contentHeight =
    window.innerHeight -
    (layoutToken.headerHeight as number) -
    2 * (contentStyle.padding as number) -
    (footerStyle.height as number);

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
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
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          items={menus}
        />
      </Sider>
      <Layout style={{ overflow: 'hidden' }}>
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
            onClick={() => setCollapsed.toggle()}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          {/* 中间留空 */}
          <div style={{ flex: 1 }} />
          {/* 右边内容 */}
          <div style={{ marginRight: 0 }}>
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
              height: contentHeight,
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
