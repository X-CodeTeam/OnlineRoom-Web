import Vue from "vue";
import App from "./App";
import store from "./store";
import router from "./router";
import lodash from "lodash";
import "./assets/styles/xcode.scss";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/display.css";
import "@/assets/styles/element-variables.scss";
import BaseAreaSelect from "@/components/BaseAreaSelect";
import ElDics from "@/components/ElDics";
// 加载图标
import "@/icon";

Vue.use(ElementUI, { size: "small" });

// 加载组件
const requireComponent = require.context("./components", true, /\.vue$/);
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);
  const componentName = componentConfig.default.name;
  Vue.component(componentName, componentConfig.default || componentConfig);
});

Vue.prototype.$lodash = lodash;

Vue.component("ElAreaSelect", BaseAreaSelect);
Vue.component("ElDics", ElDics);

// 加载插件
const requirePlugin = require.context("./plugins", true, /\.js$/);
requirePlugin.keys().forEach((fileName) => {
  requirePlugin(fileName);
});

Vue.config.productionTip = false;
new Vue({
  el: "#xcode-admin",
  store,
  router,
  render: (h) => h(App),
});
