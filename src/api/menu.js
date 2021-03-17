import request from "@/utils/request";

export function queryMenuPage(params) {
  return request({
    url: "/menus",
    method: "get",
    params,
  });
}

export function queryMenusWithId(id) {
  return request({
    url: `/menus/${id}`,
  });
}

export function editMenus(data) {
  return request({
    url: "/menus",
    method: "put",
    data,
  });
}

export function addMenus(data) {
  return request({
    url: "/menus",
    method: "post",
    data,
  });
}

export function deleteMenus(menuId) {
  return request({
    url: "/menus",
    method: "delete",
    params: { id: menuId },
  });
}

export function sysMenusTree() {
  return request({
    url: "/menus/sysMenuTree",
  });
}

export function userMenusTree() {
  return request({
    url: "/menus/userMenuTree",
  });
}
