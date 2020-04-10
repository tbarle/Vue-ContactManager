<!--
    The TagFilterModal component is composed by: a button that open the dialog/modal, one chip for each tag selected in the dialog filter, and one dialog.
    The button is used to open the dialog that containt the tags to selected for filter contantc.
    The chips are used to inform the user about the tags selected to filter the contact list, and to directly remove tags without reopen the dialog.
    The dialog contains:
        One checkbox for each tag present in the contact list, this checkboxes once selected allows to filter the contact list.
        And two button, one used for reset filters and close the dialog, and the other to close the dialog without reset filters.
-->
<template>
  <div id="tagFilter-container">
    <div style="display: flex;">
      <md-button class="md-raised" @click="showDialog = true"
        >Tags Filter</md-button
      >
      <div id="chips-container">
        <md-chip
          v-for="tag in tagFilters"
          md-deletable
          @md-delete="removeTag(tag)"
          :key="tag"
          >{{ tag }}</md-chip
        >
      </div>
    </div>

    <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
      <md-dialog-title>Tags filter</md-dialog-title>
      <md-dialog-content>
        <md-checkbox
          v-model="tagFilters"
          v-for="tag in tagList"
          :value="tag"
          :key="tag"
        >
          {{ tag }}
        </md-checkbox>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="resetAndCloseTagFilterModal"
          >Reset and Close</md-button
        >
        <md-button class="md-primary" @click="showDialog = false"
          >Filter</md-button
        >
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import store from "../store/index.js";

export default {
  name: "TagFilterModal",
  data: () => ({
    showDialog: false //Property used to open and close the dialog
  }),
  computed: {
    /**
     * Array of all the tags on the contact list,
     * use the contact list in the store and
     * return an array composed by all the tags in the contact list.
     */
    tagList() {
      let contactList = store.getters.getContactList;
      let tagList = [];
      for (let i = 0; i < contactList.length; i++) {
        for (let j = 0; j < contactList[i].tags.length; j++) {
          if (!tagList.includes(contactList[i].tags[j])) {
            tagList.push(contactList[i].tags[j]);
          }
        }
      }
      return tagList;
    },
    /**
     * Array of tags selected to filter the contact list,
     * get this from the Vuex store, and set this to Vuex store every time
     * that the value change on the tag checkboxes.
     */
    tagFilters: {
      get: function() {
        return store.getters.getTagFilters;
      },
      set: function(newValue) {
        store.commit("setTagFilters", newValue);
      }
    }
  },
  methods: {
    /**
     * This method resets the array of tags used to filter the contact list
     * and close the dialog.
     */

    resetAndCloseTagFilterModal: function() {
      this.tagFilters = [];
      this.showDialog = false;
    },

    /**
     * This method remove a tag from the Array of tags used to filter the contact list.
     *
     * @param {string} tag It's the tag that we want to remove from the Array.
     */
    removeTag: function(tag) {
      this.tagFilters.splice(this.tagFilters.indexOf(tag), 1);
    }
  }
};
</script>

<style scoped>
#chips-container {
  display: flex;
  align-items: center;
}

#tagFilter-container {
  background-color: aliceblue;
}

.md-raised {
  border-radius: 10px;
}
</style>
