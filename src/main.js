import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import Print from "vue-print-nb";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n
import { directive } from "./utils/directive";

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control
Vue.use(Print);
Vue.use(ElementUI, { locale });
directive();
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
