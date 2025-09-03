import type { RouteObject } from 'react-router-dom';

export type MetaConfig = {
  key: string;
  title: string;
  icon?: React.ReactNode;
  hideInMenu?: boolean;
  hideInBreadcrumb?: boolean;
};

export type RouterItem = RouteObject & {
  meta?: MetaConfig;
  children?: RouterItem[];
};

export type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};
