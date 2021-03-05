import request from "@/utils/request";

//const apiURL = "/colorfulIcon/getList";

export function getIconList(params) {
  return request({
    url: "/colorfulIcon/getList",
    method: "get",
    params,
  });
}
