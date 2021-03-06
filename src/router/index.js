import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layouts";
import { publicPath, routerMode } from "@/config";

Vue.use(VueRouter);
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true,
  },
  {
    path: "/callback",
    component: () => import("@/views/callback"),
    hidden: true,
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/403"),
    hidden: true,
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404"),
    hidden: true,
  },
];

export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    meta: {
      title: "首页",
      remixIcon: "home-4-line",
      affix: true,
    },
    children: [
      {
        path: "index",
        name: "Index",
        component: () => import("@/views/index"),
        meta: {
          title: "首页",
          remixIcon: "home-4-line",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/room",
    name: "RoomManagement",
    component: Layout,
    meta: {
      title: "网约房管理",
      remixIcon: "user-settings-line",
      roles: ["admin"],
    },
    children: [
      {
        path: "store",
        name: "StoreManagement",
        component: () => import("@/views/store"),
        meta: {
          title: "门店管理",
          remixIcon: "user-3-line",
        },
      },
      {
        path: "room",
        name: "roomManagement",
        component: () => import("@/views/room"),
        meta: {
          title: "房间管理",
          remixIcon: "admin-line",
        },
      },
      {
        path: "order",
        name: "orderManagement",
        component: () => import("@/views/order"),
        meta: {
          title: "订单管理",
          remixIcon: "admin-line",
        },
      },
      {
        path: "checkin",
        name: "checkinManagement",
        component: () => import("@/views/checkin"),
        meta: {
          title: "入住信息",
          remixIcon: "admin-line",
        },
      },
      {
        path: "warning",
        name: "warningManagement",
        component: () => import("@/views/warning"),
        meta: {
          title: "预警记录",
          remixIcon: "admin-line",
        },
      },
    ],
  },
  {
    path: "/auth",
    name: "PersonnelManagement",
    component: Layout,
    redirect: "/auth/userManagement",
    meta: {
      title: "系统管理",
      remixIcon: "user-settings-line",
      roles: ["admin"],
    },
    children: [
      {
        path: "user",
        name: "userManagement",
        component: () => import("@/views/user"),
        meta: {
          title: "用户管理",
          remixIcon: "user-3-line",
        },
      },
      {
        path: "role",
        name: "roleManagement",
        component: () => import("@/views/role"),
        meta: {
          title: "角色管理",
          remixIcon: "admin-line",
        },
      },
    ],
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

export function resetRouter() {
  router.matcher = new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  }).matcher;
}

export default router;
