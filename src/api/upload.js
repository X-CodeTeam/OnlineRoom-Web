import request from "@/utils/request";

export function importFile(url, body) {
  return request({
    url,
    method: "post",
    data: body,
    responseType: "blob",
    headers: {
      "Content-Type": "multipart/form-data;charset=UTF-8",
    },
  });
}
