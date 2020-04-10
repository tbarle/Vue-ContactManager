import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

/**
 * File main.js creates the Vue application including the use of Vuex and View Router.
 */

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
