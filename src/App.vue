<!--
     The root component of the Vue application.
     Declare the use of Vue Material , it is a library for a fast integration and use of Material Design into Vue framework.
     Contain the view components via the <router-view> tag. The <router-view> component is a functional component that renders the matched component for the given path.
 -->
<template>
  <div id="app">
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

Vue.use(VueMaterial);

export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: aliceblue;
  min-height: 100vh;
}
</style>
