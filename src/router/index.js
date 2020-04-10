/**
 * Vue router used to make the application a "Single-Page-Application".
 * Use the two Vue component "Home" and "SingleContactView" as routes of the application via the use of VueRouter object.
 */

import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SingleContactView from "../views/SingleContactView";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { index: 0 }
  },
  {
    path: "/SingleContactView",
    name: "SingleContactView",
    component: SingleContactView,
    meta: { index: 1 }
  }
];

const router = new VueRouter({
  mode: "history", //Configure the router mode use HTML5 History API
  base: process.env.BASE_URL, //The base URL of the app
  routes //The routes of the app
});

export default router;
