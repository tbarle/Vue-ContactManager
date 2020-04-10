<!--
    It's the view of the list of contact, it's composed by:
      One HeaderContactManager component that take three parameters used to set the HeaderContactManager elements to render.
      One ContactList component that render the contact list.
      One TagFilterModal used to filter the contact list by tags.
-->
<template>
  <div class="home">
    <HeaderContactManager
      v-bind:showBackButton="false"
      v-bind:showOrderBy="true"
      v-bind:showSearchBar="true"
    >
    </HeaderContactManager>
    <div>
      <TagFilterModal></TagFilterModal>
    </div>
    <ContactList></ContactList>
  </div>
</template>

<script>
import HeaderContactManager from "../components/HeaderContactManager.vue";
import ContactList from "../components/ContactList";
import TagFilterModal from "../components/TagFilterModal";

export default {
  name: "Home",
  components: {
    ContactList,
    HeaderContactManager,
    TagFilterModal
  }
};
</script>
