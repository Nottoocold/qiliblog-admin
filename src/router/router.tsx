import type { RouteObject } from 'react-router-dom';
import Login from '../pages/login/login.tsx';
import ErrorPage from '../pages/ErrorPage.tsx';
import ManagerLayout from '@/layout/managerLayout.tsx';
import type { ItemType } from 'antd/es/menu/interface';

export type RouterItem = RouteObject & {
  meta?: ItemType & {
    hideInMenu?: boolean;
    hideInBreadcrumb?: boolean;
  };
  children?: RouterItem[];
};

const routes: RouterItem[] = [
  {
    path: '/login',
    element: <Login />,
    meta: {
      key: 'login',
      title: '登录',
      hideInMenu: true,
      hideInBreadcrumb: true,
    },
  },
  {
    path: '/',
    element: <ManagerLayout />,
    errorElement: <ErrorPage />,
    meta: {
      key: 'home',
      title: '首页',
      hideInMenu: false,
      hideInBreadcrumb: false,
    },
  },
];

export default routes;
