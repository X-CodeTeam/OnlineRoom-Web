/**
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */
import defaultSettings from "@/config";
import { isJson } from "@/utils/validate";

const { logo, title, i18n, layout, showFullScreen } = defaultSettings;

const getLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  if (isJson(value)) {
    return JSON.parse(value);
  } else {
    return false;
  }
};

const theme = getLocalStorage("theme");
const { collapse } = getLocalStorage("collapse");
const { language } = getLocalStorage("language");
const toggleBoolean = (key) => {
  return typeof theme[key] !== "undefined" ? theme[key] : key;
};

const state = {
  collapse,
  device: "desktop",
  logo,
  title,
  language: language || i18n,
  layout: theme.layout || layout,
  showFullScreen: toggleBoolean(showFullScreen),
};
const getters = {
  collapse: (state) => state.collapse,
  device: (state) => state.device,
  logo: (state) => state.logo,
  title: (state) => state.title,
  language: (state) => state.language,
  layout: (state) => state.layout,
  showFullScreen: (state) => state.showFullScreen,
};
const mutations = {
  toggleCollapse(state) {
    state.collapse = !state.collapse;
    localStorage.setItem("collapse", `{"collapse":${state.collapse}}`);
  },
  toggleDevice(state, device) {
    state.device = device;
  },
  changeLanguage(state, language) {
    localStorage.setItem("language", `{"language":"${language}"}`);
    state.language = language;
  },
  changeLayout(state, layout) {
    state.layout = layout;
  },
  handleShowFullScreen(state, showFullScreen) {
    state.showFullScreen = showFullScreen;
  },
  openSideBar(state) {
    state.collapse = false;
  },
  foldSideBar(state) {
    state.collapse = true;
  },
};
const actions = {
  toggleCollapse({ commit }) {
    commit("toggleCollapse");
  },
  toggleDevice({ commit }, device) {
    commit("toggleDevice", device);
  },
  changeLanguage: ({ commit }, language) => {
    commit("changeLanguage", language);
  },
  changeLayout({ commit }, layout) {
    commit("changeLayout", layout);
  },
  handleShowFullScreen: ({ commit }, showFullScreen) => {
    commit("handleShowFullScreen", showFullScreen);
  },
  openSideBar({ commit }) {
    commit("openSideBar");
  },
  foldSideBar({ commit }) {
    commit("foldSideBar");
  },
};
export default { state, getters, mutations, actions };
