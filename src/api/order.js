import request from "@/utils/request";

export function queryPage(params) {
  return request({
    url: "/reserves",
    method: "get",
    params,
  });
}

export function queryObjects(params) {
  return request({
    url: "/reserves/objects",
    method: "get",
    params,
  });
}

export function queryReserve(params) {
  return request({
    url: "/reserves/" + params,
    method: "get",
  });
}

export function getObjects(params) {
  return request({
    url: "/reserves/objects/" + params,
    method: "get",
  });
}
