import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useLocation, Outlet } from "react-router-dom";
import { generateMenuItems, routerConfig } from "@/router/config";
import useTitleSetter from "@/hook/useTitleSetter";
const { Header, Sider, Content, Footer } = Layout;

const ManagerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  useTitleSetter();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="demo-logo-vertical"
          style={{
            height: 42,
            margin: 12,
            borderRadius: borderRadiusLG,
            background: colorBgContainer,
          }}
        >
          logo
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={generateMenuItems(routerConfig)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "calc(100vh - 64px - 64px - 48px - 48px)",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center", height: 64 }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default ManagerLayout;
