<!--
This component contains and renders the contact list of the app. Allows to select a contact and to go
to its SingleContactVisualization with the "to" prop of Vue Router.
-->
<template>
  <md-list>
    <md-list-item
      id="contact-list"
      v-for="contact in orderedAndFilteredContactList"
      :key="contact.id"
      v-on:click="selectContact(contact.id, orderedAndFilteredContactList)"
      to="/SingleContactView"
    >
      <!-- Render the avatar with the first and last name initials-->
      <md-avatar class="md-avatar-icon md-primary">
        <md-ripple>
          {{ contact.firstName.substring(0, 1).toUpperCase()
          }}{{ contact.lastName.substring(0, 1).toUpperCase() }}
        </md-ripple>
      </md-avatar>
      <span>{{ contact.firstName }} {{ contact.lastName }}</span>
      <md-divider class="md-inset"></md-divider>
    </md-list-item>
  </md-list>
</template>

<script>
import store from "../store/index.js";

export default {
  name: "ContactList",
  computed: {
    /**
     * Contact list of the application,
     * get this from the Vuex store.
     */
    contactList() {
      return store.getters.getContactList;
    },

    /**
     * Contact field used to order the contact list,
     * get this from the Vuex store.
     */
    orderBy() {
      return store.getters.getOrderBy;
    },

    /**
     * Array of tags used to filter the contact list,
     * get this from the Vuex store.
     */
    tagFilters() {
      return store.getters.getTagFilters;
    },

    /**
     * Searched term to search in the contact fields,
     * get this from Vuex store.
     */
    searchedTerm() {
      return store.getters.getSearchedTerm;
    },

    /**
     * Contact list ordered and filtered by tags
     * and by the searched term.
     */
    orderedAndFilteredContactList() {
      let filteredByTag = [],
        filteredBySearchTerm = [],
        orderedAndFiltered = [];

      filteredByTag = this.filterListByTag(this.contactList, this.tagFilters);
      filteredBySearchTerm = this.filterListBySearchTerm(
        filteredByTag,
        this.searchedTerm
      );
      orderedAndFiltered = this.orderList(filteredBySearchTerm, this.orderBy);

      return orderedAndFiltered;
    }
  },
  methods: {
    /**
     * This method search a contact from the contact list by id,
     * and sets it to Vuex store.
     *
     * @param {number}  id              Is the id of the selected contact in the rendered contact list.
     * @param {Array}   contactList     Array of contact.
     **/
    selectContact(id, contactList) {
      for (let i = 0; i < contactList.length; i++) {
        if (id === contactList[i].id) {
          store.commit("setSelectedContact", contactList[i]);
        }
      }
    },

    /**
     * Order a contactList by the contact field orderBy.
     *
     * @param {Array}   contactList         Array of contact.
     * @param {string}  orderBy             Field of the contact use to order the contact list.
     *
     * @return {Array}  orderedContactList  Ordered Array of contacts.
     */
    orderList(contactList, orderBy) {
      let orderedContactList = [];

      if (orderBy === "firstName") {
        orderedContactList = contactList.sort(function(a, b) {
          if (a.firstName < b.firstName) {
            return -1;
          }
          if (a.firstName > b.firstName) {
            return 1;
          }
          return 0;
        });
      } else if (orderBy === "lastName") {
        orderedContactList = contactList.sort(function(a, b) {
          if (a.lastName < b.lastName) {
            return -1;
          }
          if (a.lastName > b.lastName) {
            return 1;
          }
          return 0;
        });
      } else if (orderBy === "email") {
        orderedContactList = contactList.sort(function(a, b) {
          if (a.email < b.email) {
            return -1;
          }
          if (a.email > b.email) {
            return 1;
          }
          return 0;
        });
      }
      return orderedContactList;
    },

    /**
     * Filter the contact list by tags presents in the taggedFilters Array
     *
     * @param   {Array}   contactList     Array of contact.
     * @param   {Array}   tagFilters      Array of tags that the user selects to filter the contact list.
     *
     * @return  {Array}   filtered        Is the filtered contact list.
     */
    filterListByTag(contactList, tagFilters) {
      let filtered = contactList;
      if (tagFilters.length !== 0) {
        filtered = contactList.filter(contact => {
          return contact.tags.some(tag => tagFilters.includes(tag));
        });
      }
      return filtered;
    },

    /**
     * Filter the contact list by search term that can be in any contact fields.
     *
     * @param   {Array}   contactList     Array of contact.
     * @param   {string}  searchedTerm    Searched term input by the user.
     *
     * @return  {Array}   filtered        Is the filtered contact list.
     */
    filterListBySearchTerm(contactList, searchedTerm) {
      let filtered = [];
      filtered = contactList.filter(contact => {
        return (
          contact.firstName
            .toLowerCase()
            .includes(searchedTerm.toLowerCase()) ||
          contact.lastName.toLowerCase().includes(searchedTerm.toLowerCase()) ||
          contact.phoneNumber
            .toLowerCase()
            .includes(searchedTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchedTerm.toLowerCase()) ||
          contact.notes.toLowerCase().includes(searchedTerm.toLowerCase())
        );
      });
      return filtered;
    }
  }
};
</script>

<style scoped>
.md-list-item >>> .md-list-item-content {
  justify-content: start;
}

.md-list-item {
  padding: 0 10px;
  margin: 2px 0;
  border: 1px solid gainsboro;
}

.md-list {
  padding: 10px 0;
}
</style>
