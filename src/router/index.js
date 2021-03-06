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
    path: "/auth",
    name: "PersonnelManagement",
    component: Layout,
    redirect: "/auth/userManagement",
    meta: {
      title: "权限管理",
      remixIcon: "user-settings-line",
      roles: ["admin"],
    },
    children: [
      {
        path: "userManagement",
        name: "UserManagement",
        component: () => import("@/views/auth/userManagement"),
        meta: {
          title: "用户管理",
          remixIcon: "user-3-line",
        },
      },
      {
        path: "roleManagement",
        name: "RoleManagement",
        component: () => import("@/views/auth/roleManagement"),
        meta: {
          title: "角色管理",
          remixIcon: "admin-line",
        },
      },
      {
        path: "permission",
        name: "Permission",
        component: () => import("@/views/auth/permission"),
        meta: {
          title: "权限管理",
          remixIcon: "group-line",
        },
      },
      // {
      //   path: 'menuManagement',
      //   name: 'MenuManagement',
      //   component: () => import('@/views/setting/menuManagement'),
      //   meta: {
      //     title: '菜单管理',
      //     badge: 'New',
      //     remixIcon: 'menu-2-fill',
      //   },
      // },
    ],
  },
  {
    path: "/system",
    component: Layout,
    meta: {
      title: "系统监控",
      remixIcon: "user-settings-line",
      roles: ["admin"],
    },
    children: [
      {
        path: "loginLog",
        name: "loginLog",
        component: () => import("@/views/system/loginLog"),
        meta: {
          title: "登录日志",
          remixIcon: "user-3-line",
        },
      },
      {
        path: "oprationLog",
        name: "oprationLog",
        component: () => import("@/views/system/oprationLog"),
        meta: {
          title: "操作日志",
          remixIcon: "admin-line",
        },
      },
    ],
  },
  {
    path: "/blog",
    component: Layout,
    meta: {
      title: "内容管理",
      remixIcon: "user-settings-line",
      roles: ["admin"],
    },
    children: [
      {
        path: "flash",
        name: "flash",
        component: () => import("@/views/blog/Flash"),
        meta: {
          title: "快讯管理",
          remixIcon: "user-3-line",
        },
      },
      {
        path: "flashAdd",
        name: "flashAdd",
        component: () => import("@/views/blog/Flash/flashAdd"),
        meta: {
          title: "新增快讯",
          remixIcon: "user-3-line",
        },
      },
      {
        path: "news",
        name: "news",
        component: () => import("@/views/blog/news"),
        meta: {
          title: "新闻管理",
          remixIcon: "user-3-line",
        },
      },
      {
        path: "newsMarkdown",
        name: "newsmarkdown",
        component: () => import("@/views/blog/news/newsmarkdownEditor"),
        meta: {
          title: "新闻Markdown编辑",
          remixIcon: "user-3-line",
        },
      },
      {
        path: "newsRichText",
        name: "news",
        component: () => import("@/views/blog/news/newsrichTextEditor"),
        meta: {
          title: "新闻富文本编辑",
          remixIcon: "user-3-line",
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
