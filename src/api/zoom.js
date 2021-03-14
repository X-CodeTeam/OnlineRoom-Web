import request from "@/utils/request";

export function queryZoomPage(params) {
  return request({
    url: "/zoneManagers",
    method: "get",
    params,
  });
}

export function modifyZoom(data) {
  return request({
    url: "/zoneManagers",
    method: "put",
    data,
  });
}

export function addZoom(data) {
  return request({
    url: "/zoneManagers",
    method: "post",
    data,
  });
}

export function deleteZoom(data) {
  return request({
    url: "/zoneManagers",
    method: "delete",
    params: data,
  });
}
