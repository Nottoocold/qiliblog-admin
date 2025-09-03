import type { MenuItem, MetaConfig, RouterItem } from '@/types/route';

const generateMenus = (routes: RouterItem[]): MenuItem[] => {
  return routes
    .flatMap(route => {
      // if current route is hide, but it has children, it will recurse to generate menu
      if (route.meta?.hideInMenu && route.children) {
        return generateMenus(route.children);
      }
      if (!route.meta?.hideInMenu) {
        const { key, title, icon } = route.meta || ({} as MetaConfig);
        return [
          {
            key: key || (route.path as string),
            label: title,
            icon: icon,
            children: route.children ? generateMenus(route.children) : undefined,
          },
        ];
      }
      return [];
    })
    .filter(item => Boolean(item.key));
};

export { generateMenus };
