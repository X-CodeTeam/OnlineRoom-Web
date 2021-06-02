import request from "@/utils/request";

export function queryStorePage(params) {
  return request({
    url: "/stores",
    method: "get",
    params,
    meta: {
      isFilter: true,
    },
  });
}

export function doEditStore(data) {
  return request({
    url: "/stores",
    method: "put",
    data,
  });
}

export function doAddStore(data) {
  return request({
    url: "/stores",
    method: "post",
    data,
  });
}

export function doLogoutStore(data) {
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
