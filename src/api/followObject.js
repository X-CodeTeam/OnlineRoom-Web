import request from "@/utils/request";

export function queryPage(params) {
  return request({
    url: "/followObjects",
    method: "get",
    params,
  });
}

export function doEdit(data) {
  return request({
    url: "/followObjects",
    method: "put",
    data,
  });
}

export function doAdd(data) {
  return request({
    url: "/followObjects",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/followObjects",
    method: "delete",
    params: data,
  });
}
