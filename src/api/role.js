import request from "@/utils/request";

export function queryRolesPage(params) {
  return request({
    url: "/roles",
    method: "get",
    params,
  });
}

export function editRole(data) {
  return request({
    url: "/roles",
    method: "put",
    data,
  });
}

export function addRole(data) {
  return request({
    url: "/roles",
    method: "post",
    data,
  });
}

export function deleteRole(data) {
  return request({
    url: "/roles",
    method: "delete",
    params: data,
  });
}

export function queryRoleWithId(menuId) {
  return request({
    url: `/roles/${menuId}`,
    params: { id: menuId },
  });
}

export function bindMenusToRole(roleCode, menuCodes) {
  return request({
    url: "/roles/bind-menus",
    method: "put",
    data: { roleCode, menuCodes },
  });
}

export function queryRoleMenus(roleCode) {
  return request({
    url: `/roles/${roleCode}/menus`,
  });
}
