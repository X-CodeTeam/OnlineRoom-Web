/**
 * @description 路由拦截状态管理，目前两种模式：all模式与fintelligence模式，其中partialRoutes是菜单暂未使用
 */
import router, { asyncRoutes, constantRoutes } from "@/router";
import { convertRouter, filterAsyncRoutes, filterRoutes } from "@/utils/routes";
import { omit } from "lodash";

/**
 * 将roles解析成数组列表的形式，易于分析
 * @param roles
 * @return {[]}
 */
function destructRoles(roles) {
  const _roles = [];

  function _destruct(rolesChild) {
    rolesChild.forEach((child) => {
      child.child && _destruct(child.child);

      _roles.push(omit(child, ["child"]));
    });
  }

  _destruct(roles);

  return _roles;
}

const state = { routes: [], partialRoutes: [], roleMenus: [] };

const getters = {
  routes: (state) => state.routes,
  partialRoutes: (state) => state.partialRoutes,
};

const mutations = {
  setRoutes(state, routes) {
    state.routes = routes;
  },

  setPartialRoutes(state, routes) {
    state.partialRoutes = routes;
  },

  setRoleMenus: (state, menus) => {
    state.roleMenus = menus;
  },
};

const actions = {
  /**
   * @description 多模式设置路由
   * @param {*} { commit }
   * @returns
   * @param roles
   */
  async setRoutes({ commit }, roles) {
    const _destructRoles = destructRoles(roles);

    commit("setRoleMenus", _destructRoles);

    const accessedRoutes = filterAsyncRoutes(asyncRoutes, _destructRoles);

    const finallyRoutes = filterRoutes([...constantRoutes, ...accessedRoutes]);

    commit("setRoutes", finallyRoutes);

    return [...accessedRoutes];
  },

  /**
   * @description 画廊布局、综合布局设置路由
   * @param {*} { commit }
   * @param accessedRoutes 画廊布局、综合布局设置路由
   */
  setPartialRoutes({ commit }, accessedRoutes) {
    commit("setPartialRoutes", accessedRoutes);
  },
};

export default { state, getters, mutations, actions };
