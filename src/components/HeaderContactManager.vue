<!--
    This component is the Header of the contact manager app.
    It is composed by:
        A button that allow to come back to Home view when you are in the SingleContactVisualization view. It's rendered only in the SingleContactVisualization view when the user is not editing the contact.
        A OrderBy component, and it's rendered only in the Home view.
        A SearchContactBar component, and it's rendered only in the Home view.
        A AddContactModal that allows to open the dialog for add contact to contact list. Take the string of the md-icon button for open a dialog to add one contact.
-->
<template>
  <div>
    <md-toolbar class="md-primary" md-elevation="1">
      <div class="md-toolbar-row">
        <md-button class="md-primary" v-if="showBackButton && !updating" to="/">
          <md-icon>keyboard_arrow_left</md-icon>
        </md-button>
        <div class="md-layout-item" v-if="showOrderBy">
          <OrderBy></OrderBy>
        </div>
        <div id="div-title">
          <div>
            <h3>{{ this.title }}</h3>
          </div>
          <div>
            <SearchContactBar v-if="showSearchBar"></SearchContactBar>
          </div>
        </div>
        <AddContactModal mdIcon="add_box"></AddContactModal>
      </div>
    </md-toolbar>
  </div>
</template>

<script>
import store from "../store/index.js";
import AddContactModal from "./AddContactModal";
import OrderBy from "./OrderBy";
import SearchContactBar from "./SearchContactBar";

export default {
  name: "HeaderContactManager",
  components: { SearchContactBar, OrderBy, AddContactModal },
  data: () => ({
    title: "My Contact Manager" //Title of the app
  }),
  props: {
    showBackButton: {
      //Boolean prop used to show the back button
      type: Boolean,
      required: true //When HeaderContactManager component is used this prop is required.
    },

    showOrderBy: {
      //Boolean prop used to show the OrderBy component
      type: Boolean,
      required: true //When HeaderContactManager component is used this prop is required.
    },

    showSearchBar: {
      //Boolean prop used to show the SearchContactBar component
      type: Boolean,
      required: true //When HeaderContactManager component is used this prop is required.
    }
  },
  computed: {
    /**
     * Property used to show the back button,
     * get this from the Vuex store
     */
    updating() {
      return store.getters.getUpdating;
    }
  }
};
</script>

<style scoped>
.md-layout-item {
  max-width: 120px;
}

.md-toolbar-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.md-toolbar {
  padding: 2px;
}

h3 {
  margin: 10px 0;
}

#div-title {
  margin: 0 5px;
}
</style>
