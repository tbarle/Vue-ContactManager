<!-- This component contains the search bar used to search the contacts in the contact list that contains the term in one of the contact fields. -->

<template>
  <div id="input-container">
    <input
      type="search"
      placeholder="Search contact..."
      v-model="searchedTerm"
    />
  </div>
</template>

<script>
import store from "../store/index.js";

export default {
  name: "SearchContactBar",

  computed: {
    /**
     * It's the v-model of the input, represents the search term,
     * get this from the Vuex store and set it to Vuex store every
     * time the term change in the input.
     */
    searchedTerm: {
      get: function() {
        return store.getters.getSearchedTerm;
      },
      set: function(newValue) {
        store.commit("setSearchedTerm", newValue);
      }
    }
  }
};
</script>

<style scoped>
#input-container {
  height: 30px;
}

input {
  min-width: 100%;
  min-height: 100%;
  border-radius: 22px;
  border: none;
}
</style>
