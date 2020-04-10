<!--
    It's the view of the single contact, it's composed by:
      One HeaderContactManager component that take three parameters used to set the HeaderContactManager elements to render.
      One Contact component that contain information about a selected contact in the list.
-->
<template>
  <div class="ContactViewContainer">
    <HeaderContactManager
      v-bind:showBackButton="true"
      v-bind:showOrderBy="false"
      v-bind:showSearchBar="false"
    >
    </HeaderContactManager>
    <Contact></Contact>
  </div>
</template>
<script>
import HeaderContactManager from "../components/HeaderContactManager";
import Contact from "../components/Contact";

export default {
  components: { Contact, HeaderContactManager }
};
</script>
