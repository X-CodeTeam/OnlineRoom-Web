/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router from "@/router";
import store from "@/store";
import VabProgress from "nprogress";
import "nprogress/nprogress.css";
import getPageTitle from "@/utils/pageTitle";
import {
  authentication,
  loginInterception,
  recordRoute,
  routesWhiteList,
} from "@/config";
import { userMenusTree } from "@/api/menu";

VabProgress.configure({
  easing: "ease",
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});

router.beforeEach(async (to, from, next) => {
  VabProgress.start();

  let hasToken = store.getters["user/accessToken"];

  if (!loginInterception) hasToken = true;

  if (routesWhiteList.indexOf(to.path) !== -1) {
    if (to.path === "/login" && hasToken) next({ path: "/" });
    else next();
  } else {
    if (hasToken) {
      const hasAccess =
        store.getters["acl/admin"] ||
        store.getters["acl/role"].length > 0 ||
        store.getters["acl/ability"].length > 0;

      debugger;

      if (hasAccess) {
        next();
      } else {
        try {
          await store.dispatch("user/getUserInfo");

          const { data: rolesData } = await userMenusTree();

          //根据路由模式添加路由
          router.addRoutes(await store.dispatch("routes/setRoutes", rolesData));
          next({ ...to, replace: true });
        } catch {
          await store.dispatch("user/resetAll");
          if (recordRoute && to.path !== "/")
            next({
              path: "/login",
              query: { redirect: to.path },
              replace: true,
            });
          else next({ path: "/login", replace: true });
        }
      }
    } else {
      if (recordRoute && to.path !== "/")
        next({ path: "/login", query: { redirect: to.path }, replace: true });
      else next({ path: "/login", replace: true });
    }
  }
});

router.afterEach((to) => {
  document.title = getPageTitle(to.meta.title);
  if (VabProgress.status) VabProgress.done();
});
