import router from "@/router";
import path from "path";
import { rolesControl } from "@/config";
import { isExternal } from "@/utils/validate";
import { hasRole } from "@/utils/hasRole";
import fi from "element-ui/src/locale/lang/fi";

/**
 * @description all模式渲染后端返回路由,支持包含views路径的所有页面
 * @param asyncRoutes
 * @returns {*}
 */
export function convertRouter(asyncRoutes) {
  return asyncRoutes.map((route) => {
    if (route.component) {
      if (route.component === "Layout") {
        route.component = (resolve) => require(["@/layouts"], resolve);
      } else {
        const index = route.component.indexOf("views");
        const path =
          index > 0 ? route.component.slice(index) : `views/${route.component}`;
        route.component = (resolve) => require([`@/${path}`], resolve);
      }
    }
    if (route.children && route.children.length)
      route.children = convertRouter(route.children);
    if (route.children && route.children.length === 0) delete route.children;
    return route;
  });
}

/**
 * @description 根据roles数组拦截路由
 * @param routes
 * @param baseUrl
 * @returns {[]}
 */
export function filterRoutes(routes, baseUrl = "/") {
  return routes
    .filter((route) => {
      if (rolesControl && route.meta && route.meta.roles)
        return hasRole(route.meta.roles);
      else return true;
    })
    .map((route) => {
      if (route.path !== "*" && !isExternal(route.path))
        route.path = path.resolve(baseUrl, route.path);
      route.fullPath = route.path;
      if (route.children)
        route.children = filterRoutes(route.children, route.fullPath);
      return route;
    });
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  function _filter(_routes) {
    const filterOneRoute = routes.filter((route) => {
      return roles.some((role) => {
        return role.menuPermission === route.name;
      });
    });

    filterOneRoute.forEach((val) => {
      val.children = val.children.filter((route) => {
        return (
          route.hidden === true ||
          route.path === "" ||
          roles.some((role) => role.menuPermission === route.name)
        );
      });
    });

    filterOneRoute.push({
      path: "*",
      redirect: "/404",
      hidden: true,
    });

    return filterOneRoute;
  }

  return _filter(routes);
}

/**
 * 根据当前页面firstMenu
 * @returns {string}
 */
export function handleFirstMenu() {
  const firstMenu = router.currentRoute.matched[0].path;
  if (firstMenu === "") return "/";
  return firstMenu;
}
