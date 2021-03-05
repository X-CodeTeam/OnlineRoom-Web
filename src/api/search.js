import request from "@/utils/request";

//const apiURL = "/search/getList";

export function getList() {
  return request({
    url: "/test/search/getList",
    method: "get",
  });
}
