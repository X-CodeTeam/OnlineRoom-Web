import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/Admin/oprationLog/GetPage",
    method: "get",
    params,
  });
}
