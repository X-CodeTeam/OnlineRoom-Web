import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/Admin/news/GetPage",
    method: "get",
    params,
  });
}

export function doEdit(data) {
  return request({
    url: "/Admin/flash/Update",
    method: "post",
    data,
  });
}

export function doAdd(data) {
  return request({
    url: "/Admin/flash/Add",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/Admin/flash/Delete",
    method: "post",
    data,
  });
}
