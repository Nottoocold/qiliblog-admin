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
        const children = route.children ? generateMenus(route.children) : undefined;
        return [
          {
            key: key || (route.path as string),
            label: title,
            icon: icon,
            ...(children && children.length > 0 ? { children } : {}),
          },
        ];
      }
      return [];
    })
    .filter(item => Boolean(item.key) && Boolean(item.label));
};

/**
 * 将路由路径转换为正则表达式，支持动态参数匹配
 * 例如: /post/:id/edit -> /post/[^/]+/edit
 */
const pathToRegex = (path: string): RegExp => {
  // 处理 index 路由
  if (path === '' || path === '/') {
    return /^\/?$/;
  }

  // 将路径参数 :param 替换为正则表达式
  const pattern = path
    .replace(/\//g, '\\/') // 转义斜杠
    .replace(/:\w+/g, '[^/]+') // 将 :id 替换为 [^/]+
    .replace(/\*/g, '.*'); // 支持通配符

  return new RegExp(`^${pattern}$`);
};

/**
 * 检查路径是否匹配路由模式
 */
const matchPath = (pathname: string, routePath: string | undefined): boolean => {
  if (!routePath) {
    return false;
  }

  // 处理绝对路径
  if (routePath.startsWith('/')) {
    const regex = pathToRegex(routePath);
    return regex.test(pathname);
  }

  // 处理相对路径（子路由）
  // 这种情况下需要与父路径组合
  return false;
};

/**
 * 获取路由的完整路径（包括父路径）
 */
const getFullPath = (route: RouterItem, parentPath: string = ''): string => {
  // 处理 index 路由（没有 path 或 path 为空）
  if (!route.path && route.index) {
    return parentPath || '/';
  }

  if (!route.path) {
    return parentPath;
  }

  if (route.path.startsWith('/')) {
    // 绝对路径
    return route.path;
  }

  // 相对路径，需要与父路径组合
  // 确保父路径以 / 结尾（除非是根路径）
  const normalizedParentPath = parentPath === '/' ? '' : parentPath;
  if (normalizedParentPath.endsWith('/')) {
    return `${normalizedParentPath}${route.path}`;
  }
  return `${normalizedParentPath}/${route.path}`;
};

/**
 * 从路由配置中提取所有菜单项路径
 */
const extractMenuRoutes = (
  routes: RouterItem[],
  parentPath: string = '',
  menuRoutes: Array<{ key: string; path: string; children?: RouterItem[] }> = []
): Array<{ key: string; path: string; children?: RouterItem[] }> => {
  routes.forEach(route => {
    const fullPath = getFullPath(route, parentPath);
    const routeKey = route.meta?.key || fullPath;

    // 如果路由显示在菜单中，添加到菜单路由列表
    if (!route.meta?.hideInMenu && route.meta?.key) {
      menuRoutes.push({
        key: routeKey,
        path: fullPath,
        children: route.children,
      });
    }

    // 递归处理子路由
    if (route.children) {
      extractMenuRoutes(route.children, fullPath, menuRoutes);
    }
  });

  return menuRoutes;
};

/**
 * 查找匹配当前路径的菜单键
 * 支持动态路由匹配，如果当前路径是某个菜单项的子路由，返回父菜单项的 key
 */
const findMatchedMenuKey = (pathname: string, routes: RouterItem[]): string | null => {
  // 提取所有菜单路由（key 和 path 的映射）
  const menuRoutes = extractMenuRoutes(routes);

  // 按路径长度从长到短排序，优先匹配更具体的路径
  const sortedMenuRoutes = [...menuRoutes].sort((a, b) => b.path.length - a.path.length);

  // 尝试匹配每个菜单路由
  for (const menuRoute of sortedMenuRoutes) {
    // 1. 精确匹配
    if (menuRoute.path === pathname || menuRoute.key === pathname) {
      return menuRoute.key;
    }

    // 2. 动态路由匹配（使用正则表达式）
    if (matchPath(pathname, menuRoute.path)) {
      return menuRoute.key;
    }

    // 3. 前缀匹配（当前路径是菜单路由的子路由）
    // 例如：pathname = '/post/123/edit', menuRoute.path = '/post'
    if (
      menuRoute.path !== '/' &&
      pathname.startsWith(menuRoute.path) &&
      (pathname[menuRoute.path.length] === '/' || pathname.length === menuRoute.path.length)
    ) {
      return menuRoute.key;
    }
  }

  // 如果没有找到匹配，返回 null
  return null;
};

/**
 * 检查路径是否匹配路由或其子路由
 */
const isPathMatchRoute = (
  pathname: string,
  route: RouterItem,
  parentPath: string = ''
): boolean => {
  const fullPath = getFullPath(route, parentPath);

  // 精确匹配
  if (fullPath === pathname) {
    return true;
  }

  // 动态路由匹配
  if (matchPath(pathname, fullPath)) {
    return true;
  }

  // 前缀匹配（当前路径是该路由的子路由）
  if (
    fullPath !== '/' &&
    pathname.startsWith(fullPath) &&
    (pathname[fullPath.length] === '/' || pathname.length === fullPath.length)
  ) {
    return true;
  }

  // 递归检查子路由
  if (route.children) {
    for (const childRoute of route.children) {
      if (isPathMatchRoute(pathname, childRoute, fullPath)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * 查找需要展开的菜单键（所有包含匹配路径的父菜单项）
 */
const findOpenMenuKeys = (
  pathname: string,
  routes: RouterItem[],
  parentPath: string = '',
  openKeys: string[] = []
): string[] => {
  for (const route of routes) {
    const fullPath = getFullPath(route, parentPath);
    const routeKey = route.meta?.key || fullPath;
    const isMenuRoute = !route.meta?.hideInMenu && route.meta?.key;
    const hasChildren = route.children && route.children.length > 0;

    // 如果当前路径匹配这个路由或其子路由
    if (isPathMatchRoute(pathname, route, parentPath)) {
      // 如果这个路由有子路由，需要展开它
      if (hasChildren && isMenuRoute) {
        // 避免重复添加
        if (!openKeys.includes(routeKey)) {
          openKeys.push(routeKey);
        }
      }

      // 继续在子路由中查找
      if (route.children) {
        findOpenMenuKeys(pathname, route.children, fullPath, openKeys);
      }
    } else {
      // 即使当前路径不完全匹配，如果路径以当前路由开头，也可能需要展开
      // 例如：pathname = '/post/123/edit', route.path = '/post'
      if (fullPath !== '/' && pathname.startsWith(fullPath) && hasChildren && isMenuRoute) {
        // 检查是否有子路由匹配
        if (route.children) {
          const childMatches = route.children.some(childRoute =>
            isPathMatchRoute(pathname, childRoute, fullPath)
          );
          if (childMatches && !openKeys.includes(routeKey)) {
            openKeys.push(routeKey);
            findOpenMenuKeys(pathname, route.children, fullPath, openKeys);
          }
        }
      }
    }
  }

  return openKeys;
};

export default {
  generateMenus,
  findMatchedMenuKey,
  findOpenMenuKeys,
};
