import request from "@/utils/request";

export function queryPage(params) {
  return request({
    url: "/rooms",
    method: "get",
    params,
  });
}

export function doEdit(data) {
  return request({
    url: "/rooms",
    method: "post",
    data,
  });
}

export function doAdd(data) {
  return request({
    url: "/rooms",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/rooms",
    method: "delete",
    params: data,
  });
}
