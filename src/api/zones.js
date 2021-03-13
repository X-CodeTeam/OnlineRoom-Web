import request from "@/utils/request";

export function queryZones() {
  return request({
    url: "/zones/tree",
  });
}

export function queryPagingZones(params) {
  return request({
    url: "/zones",
    data: params,
  });
}

export function addZone(body) {
  return request({
    url: "/zones",
    method: "post",
    data: body,
  });
}

export function deleteZone(zoneId) {
  return request({
    url: "/zones",
    method: "delete",
    params: { zoneId },
  });
}

export function modifyZone(body) {
  return request({
    url: "/zones",
    method: "put",
    data: body,
  });
}
