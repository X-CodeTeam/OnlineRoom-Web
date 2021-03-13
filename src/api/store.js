import request from "@/utils/request";

export function queryStorePage(params) {
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

export function doLogout(data) {
  return request({
    url: "/stores/logout",
    method: "put",
    params: data,
  });
}

// 保留接口，根据行政区划查询门店
export function queryStoreWithZone() {
  return request({
    url: "/stores/",
  });
}
