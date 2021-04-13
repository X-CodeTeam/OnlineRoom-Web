import Vue from "vue";
import axios from "axios";
import {
  baseURL,
  contentType,
  debounce,
  requestTimeout,
  successCode,
  tokenName,
} from "@/config";
import store from "@/store";
import qs from "qs";
import { isArray } from "@/utils/validate";
import { Message } from "element-ui";
import { changeObjectToChar } from "@/utils/tools";

let loadingInstance;

// 操作正常Code数组
const codeVerificationArray = isArray(successCode)
  ? [...successCode]
  : [...[successCode]];

const CODE_MESSAGE = {
  200: "服务器成功返回请求数据",
  201: "新建或修改数据成功",
  202: "一个请求已经进入后台排队（异步任务）",
  204: "删除数据成功",
  400: "发出信息有误",
  401: "用户没有权限（令牌、用户名、密码错误）",
  403: "用户得到授权，但是访问是被禁止的",
  404: "访问资源不存在",
  406: "请求格式不可得",
  410: "请求资源被永久删除，且不会被看到",
  500: "服务器发生错误",
  502: "网关错误",
  503: "服务不可用，服务器暂时过载或维护",
  504: "网关超时",
};

const handleData = ({ config, data, status, statusText }) => {
  const { isFilter } = config?.meta;

  if (loadingInstance) loadingInstance.close(); // ？？？没搞懂
  // 若data.code存在，覆盖默认code
  // 若code属于操作正常code，则status修改为200
  // if (codeVerificationArray.includes(code)) code = 200;

  if (Object.prototype.toString.call(data) === "[object FormData]") {
    return data;
  }

  // 如果令牌失效则自动条状到登录页面
  const { data: _data, err } = data;

  if (!_data) {
    switch (err.code) {
      case "99003":
        store.dispatch("user/resetAll").then((r) => {});
        break;
    }
  }

  if (!data.ok) {
    Message({
      type: "error",
      message: err.msg,
      duration: 1500,
    });
  }

  const { data: resData } = data;

  isFilter && changeObjectToChar(resData, ["", null, undefined, NaN], "---");

  return data;
};

/**
 * @description axios初始化
 */
const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    "Content-Type": contentType,
  },
  meta: {
    mode: "",
    isFilter: false,
  },
});

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    if (store.getters["user/accessToken"])
      config.headers.Authorization = store.getters["user/accessToken"];
    if (
      config.data &&
      config.headers["Content-Type"] ===
        "application/x-www-form-urlencoded;charset=UTF-8"
    )
      config.data = qs.stringify(config.data);
    if (debounce.some((item) => config.url.includes(item)))
      loadingInstance = Vue.prototype.$baseLoading();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  (response) => handleData(response),
  (error) => {
    const { response } = error;
    if (response === undefined) {
      Vue.prototype.$baseMessage(
        "未可知错误，大部分是由于后端不支持跨域CORS或无效配置引起",
        "error"
      );
      return handleData(response);
    } else {
      return handleData(response);
    }
  }
);

export default instance;
