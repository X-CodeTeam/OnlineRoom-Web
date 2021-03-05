import request from "@/utils/request";

///const apiURL = "/description/getList";

export function getList() {
  return request({
    url: "/test/description/getList",
    method: "get",
  });
}
