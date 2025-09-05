import Login from '@/pages/login/login.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import Home from '@/pages/home/home.tsx';
import { HomeOutlined, UserOutlined, TagsOutlined, EditOutlined } from '@ant-design/icons';
import type { RouterItem } from '@/types/route';
import ProtectManagerLayout from '@/layout/ProtectManagerLayout';
import User from '@/pages/user/user';
import Tag from '@/pages/tag/tag';
import Post from '@/pages/post/post';

const routes: RouterItem[] = [
  {
    path: '/login',
    element: <Login />,
    meta: {
      key: '/login',
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
      key: '/root',
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
          key: '/home',
          title: '首页',
          icon: <HomeOutlined />,
          hideInMenu: false,
          hideInBreadcrumb: false,
        },
      },
      {
        path: '/user',
        element: <User />,
        errorElement: <ErrorPage />,
        meta: {
          key: '/user',
          title: '用户管理',
          icon: <UserOutlined />,
          hideInMenu: false,
          hideInBreadcrumb: false,
        },
      },
      {
        path: '/tag',
        element: <Tag />,
        errorElement: <ErrorPage />,
        meta: {
          key: '/tag',
          title: '标签管理',
          icon: <TagsOutlined />,
          hideInMenu: false,
          hideInBreadcrumb: false,
        },
      },
      {
        path: '/post',
        element: <Post />,
        errorElement: <ErrorPage />,
        meta: {
          key: '/post',
          title: '文章管理',
          icon: <EditOutlined />,
          hideInMenu: false,
          hideInBreadcrumb: false,
        },
      },
    ],
  },
];

export default routes;
