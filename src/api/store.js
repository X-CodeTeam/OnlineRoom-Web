import request from "@/utils/request";

export function queryPage(params) {
  return request({
    url: "/stores",
    method: "get",
    params,
  });
}

export function doEdit(data) {
  return request({
    url: "/stores",
    method: "put",
    data,
  });
}

export function doAdd(data) {
  return request({
    url: "/stores",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/stores",
    method: "delete",
    params: data,
  });
}
