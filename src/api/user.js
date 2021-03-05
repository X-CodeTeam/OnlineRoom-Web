/*
 *  该文档基本修改完成， 处于安全状态。
 *  除"安全登录"和"注册"除外
 * */
import request from "@/utils/request";
import { encryptedData } from "@/utils/encrypt";
import { loginRSA, tokenName } from "@/config";

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data);
  }
  return request({
    url: "/authentication/login",
    method: "post",
    data,
  });
}

export async function socialLogin(data) {
  if (loginRSA) {
    data = await encryptedData(data);
  }
  return request({
    url: "/socialLogin",
    method: "post",
    data,
  });
}

export function getUserInfo(accessToken) {
  //此处为了兼容mock.js使用data传递accessToken，如果使用mock可以走headers
  return request({
    url: "/authentication/currentUserInfo",
    method: "get",
  });
}

export function logout() {
  return request({
    url: "/authentication/logout",
    method: "post",
  });
}

export function register(data) {
  return request({
    url: "/Admin/Auth/Register",
    method: "post",
    data: data,
  });
}
