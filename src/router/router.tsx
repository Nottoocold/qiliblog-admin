import type { RouteObject } from 'react-router-dom';
import Login from '../pages/login/login.tsx';
import ErrorPage from '../pages/ErrorPage.tsx';
import * as React from 'react';

// 路由配置，继承了RouteObject，并添加了meta属性
export type RouterItem = RouteObject & {
  meta: {
    key: string;
    title: string; // 页面标题
    name?: string; // 菜单名称，不填写时，使用title
    icon?: React.JSX.Element; // 菜单图标，类型为React.JSX.Element
    hideInMenu?: boolean; // 是否在菜单中隐藏
    hideInBreadcrumb?: boolean; // 是否在面包屑中隐藏
  };
};

const routes: RouterItem[] = [
  {
    path: '/login',
    element: <Login />,
    meta: {
      key: 'login',
      title: '登录',
      name: 'Login',
      hideInMenu: true,
      hideInBreadcrumb: true,
    },
  },
  {
    path: '/',
    element: <div>Hello world!</div>,
    errorElement: <ErrorPage />,
    meta: {
      key: 'home',
      title: '首页',
      name: 'Home',
      hideInMenu: false,
      hideInBreadcrumb: false,
    },
  },
];

export default routes;
