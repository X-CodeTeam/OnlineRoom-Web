import request from "@/utils/request";

export function queryUsersPage(params) {
  return request({
    url: "/sysUsers",
    method: "get",
    params,
  });
}

export function editSysUser(data) {
  return request({
    url: "/sysUsers",
    method: "put",
    data,
  });
}

export function addSysUser(data) {
  return request({
    url: "/sysUsers",
    method: "post",
    data,
  });
}

export function deleteSysUser(params) {
  return request({
    url: "/sysUsers",
    method: "delete",
    params,
  });
}

export function querySysUserWithUserId(userId) {
  return request({
    url: `/sysUsers/${userId}`,
  });
}

export function bindRolesToSysUser(body) {
  return request({
    url: "/sysUsers/bind-permissions",
    method: "put",
    data: body,
  });
}

export function querySysUserPermission(params) {
  return request({
    url: "/sysUsers/permissions",
    params,
  });
}
