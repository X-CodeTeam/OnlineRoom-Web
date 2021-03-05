import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/Admin/loginLog/GetPage",
    method: "get",
    params,
  });
}
