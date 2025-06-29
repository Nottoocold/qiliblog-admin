import { useEffect, useCallback, useState } from "react";
import { routerConfig } from "../router/config";
import { useLocation } from "react-router-dom";

const useTitleSetter = () => {
  const location = useLocation();
  let [title, setTitle] = useState("");
  const endStr = "博客后台系统";

  const findRouteTitle = useCallback((routes, pathname) => {
    for (const route of routes) {
      if (route.path === pathname && route.meta?.title) {
        return route.meta.title;
      }

      if (route.children) {
        const childTitle = findRouteTitle(route.children, pathname);
        if (childTitle) return childTitle;
      }

      if (route.index && pathname === "/") {
        return route.meta?.title || "";
      }
    }
    return "";
  }, []);

  document.title = title + `-${endStr}`;

  useEffect(() => {
    console.debug("hook useTitleSetter", location.pathname);
    setTitle(findRouteTitle(routerConfig, location.pathname));
  }, [location.pathname, findRouteTitle]);

  return {
    title,
    setTitle,
  };
};

export default useTitleSetter;
