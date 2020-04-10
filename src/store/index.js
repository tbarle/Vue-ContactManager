/**
 * Vuex is a state management pattern + library for Vue.js applications.
 * It serves as a centralized store for all the components in an application,
 * with rules ensuring that the state can only be mutated in a predictable fashion.
 * https://vuex.vuejs.org
 */

import Vue from "vue";
import Vuex from "vuex";
import sharedMutations from "vuex-shared-mutations"; //vuex-shared-mutation is a vuex plugin to share certain vuex mutation across multiple browser tabs/windows.
import createPersistedState from "vuex-persistedstate"; //vuex-persistedstate is a vuex plugin to persist and rehydrate your Vuex state between page reloads.

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    /**
     * Creates a new instance of the plugin with the given options.
     *  predicate: Either an array of mutation types to be shared,
     *              Only the mutation that work on the contact list and on the lastID are shared.
     */
    sharedMutations({
      predicate: [
        "addContact",
        "removeContact",
        "updateContact",
        "incrementLastID"
      ]
    }),

    /**
     * Creates a new instance of the plugin with the given options.
     *  key: The key to store the persisted state under. Defaults to vuex.
     *  reducer: A function that will be called to reduce the state to persist based on the given paths
     *           Only the contact list and the last ID are persisted.
     *  storage: default localStorage.
     */
    createPersistedState({
      key: "VueContactManager1",
      reducer: state => ({
        contactList: state.contactList,
        lastID: state.lastID
      })
    })
  ],

  /**
   * Vuex uses a single state tree - that is,
   * this single object contains all your application level state and serves as the "single source of truth".
   */
  state: {
    contactList: [], //Array of the contacts in the contact-manager
    lastID: 0, //Last contact id add to the contact list
    searchedTerm: "", //The term insert by the user to search in the contact fields
    orderBy: "firstName", //Contact field use to order the contact list
    tagFilters: [], //Array of selected tags used to filter the contact list
    selectedContact: 0, //The selected contact in the rendere contac list opf the app
    updating: false //The value used to tell if the user is updating a contact
  },

  /**
   * Getters method, you can think of them as computed properties for stores.
   */
  getters: {
    getUpdating(state) {
      return state.updating;
    },
    getContactList(state) {
      return state.contactList;
    },
    getSearchedTerm(state) {
      return state.searchedTerm;
    },
    getOrderBy(state) {
      return state.orderBy;
    },
    getTagFilters(state) {
      return state.tagFilters;
    },
    getLastID(state) {
      return state.lastID;
    },
    getSelectedContact(state) {
      return state.selectedContact;
    }
  },

  /**
   * The only function that can change the state in a Vuex store.
   */
  mutations: {
    setEditMode(state, edit) {
      state.updating = edit;
    },
    setSearchedTerm(state, searchedTerm) {
      state.searchedTerm = searchedTerm;
    },
    setOrderBy(state, orderBy) {
      state.orderBy = orderBy;
    },
    setTagFilters(state, tagFilters) {
      state.tagFilters = tagFilters;
    },
    setSelectedContact(state, contact) {
      state.selectedContact = contact;
    },

    addContact(state, contact) {
      state.contactList.push(contact);
    },
    removeContact(state, contact) {
      state.contactList = state.contactList.filter(
        contactItem => contactItem.id !== contact.id
      );
    },
    updateContact(state, contact) {
      state.contactList.map(contactItem => {
        if (contact.id === contactItem.id) {
          state.contactList = state.contactList.filter(
            contactItem => contactItem.id !== contact.id
          );
          state.contactList.push(contact);
        }
      });
    },
    incrementLastID(state) {
      state.lastID += 1;
    }
  },

  actions: {},

  modules: {}
});
