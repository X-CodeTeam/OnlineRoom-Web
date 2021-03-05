import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/Admin/Permission/GetPage",
    method: "get",
    params,
  });
}

export function doEdit(data) {
  return request({
    url: "/Admin/Permission/Update",
    method: "post",
    data,
  });
}

export function doAdd(data) {
  return request({
    url: "/Admin/Permission/Add",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/Admin/Permission/Delete",
    method: "Put",
    data: data,
  });
}
