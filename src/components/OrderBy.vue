<!--
 This component contains the md-select (dropdown) used to select a field to order the contact of the contact list.
 -->
<template>
  <div>
    <md-field>
      <md-select
        v-model="orderBy"
        class="md-primary"
        name="orderBy"
        id="orderBy"
        placeholder="Order by..."
      >
        <md-option
          v-for="field in this.orderFields"
          :value="field.key"
          :key="field.key"
          >{{ field.text }}
        </md-option>
      </md-select>
    </md-field>
  </div>
</template>

<script>
import store from "../store/index.js";

export default {
  name: "OrderBy",
  data: () => ({
    // Array of contact fields used to order the contact list
    orderFields: [
      {
        key: "firstName",
        text: "Name"
      },
      {
        key: "lastName",
        text: "Surname"
      },
      {
        key: "email",
        text: "Email"
      }
    ]
  }),

  computed: {
    /**
     * Is the v-model of the md-select, represents the selected field used to order the contact list,
     * get this from the Vuex store and set it to Vuex store every time the selected field change in the md-select.
     */

    orderBy: {
      get: function() {
        return store.getters.getOrderBy;
      },
      set: function(newValue) {
        store.commit("setOrderBy", newValue);
      }
    }
  }
};
</script>

<style scoped>
.md-field {
  max-width: 74px;
  padding: 0;
  margin: 0;
  min-height: 30px;
}

.md-select >>> .md-input {
  font-size: 12px;
}
</style>
