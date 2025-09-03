import Login from '@/pages/login/login.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import Home from '@/pages/home/home.tsx';
import { HomeOutlined } from '@ant-design/icons';
import type { RouterItem } from '@/types/route';
import ProtectManagerLayout from '@/layout/ProtectManagerLayout';

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
    element: <ProtectManagerLayout />,
    errorElement: <ErrorPage />,
    meta: {
      key: 'root',
      title: '首页',
      hideInMenu: true,
      hideInBreadcrumb: true,
    },
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/home',
        element: <Home />,
        errorElement: <ErrorPage />,
        meta: {
          key: 'home',
          title: '首页',
          icon: <HomeOutlined />,
          hideInMenu: false,
          hideInBreadcrumb: false,
        },
      },
    ],
  },
];

export default routes;
