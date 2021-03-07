import request from "@/utils/request";

export function queryZones() {
  return request({
    url: "/zones/tree",
  });
}
