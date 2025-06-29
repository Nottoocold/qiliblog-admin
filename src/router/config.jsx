import { createBrowserRouter } from "react-router-dom";
import { UserOutlined, DashboardOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ErrorPage from "../pages/error-page";
import ManagerLayout from "../layout/ManagerLayout";
import Login from "../pages/login/index";
import Dashboard from "../pages/dashboard/index";
import User from "../pages/user/index";
import Role from "../pages/role/index";
import Index from "../pages/index-page";

const routerConfig = [
  {
    path: "/login",
    element: <Login />,
    meta: { title: "登录" },
  },
  {
    path: "/",
    element: <ManagerLayout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        meta: { title: "首页", icon: <DashboardOutlined />, showInMenu: true },
      },
      {
        path: "/user",
        element: <User/>,
        meta: { title: "用户管理", icon: <UserOutlined />, showInMenu: true },
      },
      {
        path: "/role",
        element: <Role/>,
        meta: { title: "角色管理", icon: <UserOutlined />, showInMenu: true },
      },
    ],
  },
];

function getRouteItem(configItem) {
  const { errorElement, children, ...rest } = configItem;
  return {
    ...rest,
    errorElement: errorElement || <ErrorPage />,
    children: children?.map(getRouteItem),
  };
}

// 从路由配置生成菜单项
function generateMenuItems(routes) {
  // 找到根布局路由（通常是 ManagerLayout）
  const rootRoute = routes.find((route) => route.path === "/");

  if (!rootRoute || !rootRoute.children) return [];

  return rootRoute.children
    .filter((child) => child.meta?.showInMenu) // 过滤需要显示在菜单中的项
    .map((child) => ({
      key: child.path,
      icon: child.meta?.icon,
      label: <Link to={child.path}>{child.meta?.title}</Link>,
    }));
}

const router = createBrowserRouter(routerConfig.map(getRouteItem));

export { routerConfig, generateMenuItems };
export default router;
