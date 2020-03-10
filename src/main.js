import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueLazyLoad from "vue-lazyload";
import FastClick from "fastclick";
import { get, post } from "common/js/client";
import scroll from "common/js/scroll";
import saveStroge from "common/js/saveLocalStroge";
import "common/js/filter";
Vue.prototype.$getAxios = get;
Vue.prototype.$postAxios = post;
Vue.prototype.$scroll = scroll;
Vue.prototype.$saveStroge = saveStroge;
import "common/scss/index.scss";
Vue.config.productionTip = false;
Vue.use(VueLazyLoad, {
  error: require("./assets/loading.jpg"),
  loading: require("./assets/loading.jpg")
});
Vue.directive("focus", {
  inserted(el) {
    el.focus();
  }
});
router.beforeEach((to, from, next) => {
  if (to.meta === "needLogin" && !store.state.userId) {
    router.push("/login");
  } else {
    next();
  }
});

router.afterEach(to => {
  if (/\/(find|me)/.test(to.fullPath)) store.state.homeTopBar = true;
  else store.state.homeTopBar = false;
});
FastClick.attach(document.body);
new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
