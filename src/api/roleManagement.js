import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/Admin/Role/GetPage",
    method: "get",
    params,
  });
}

export function doEdit(data) {
  return request({
    url: "/Admin/Role/Update",
    method: "post",
    data,
  });
}

export function doAdd(data) {
  return request({
    url: "/Admin/Role/Add",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/Admin/Role/Delete",
    method: "post",
    data,
  });
}
