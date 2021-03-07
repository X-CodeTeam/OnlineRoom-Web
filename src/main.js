import Vue from "vue";
import App from "./App";
import store from "./store";
import router from "./router";
import lodash from "lodash";
import "./assets/styles/xcode.scss";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/display.css";
import "@/assets/styles/element-variables.scss";
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
