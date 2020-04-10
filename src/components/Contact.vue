<!--
This component contains all the information about a contact.
It is composed by:
    A button that allows to change to edit mode and update the information about the contact.
    All the fields of the contact (first name, last name, phone number, email, notes, and tags)
    One button rendered only if the user is not editing the contact, that allows to remove a contact from the contact list.
    Two button rendere only in the edit mode, that allows to save the updates and close edit mode, and the other close edit mode withoud save changes.
    A dialog that is show when a user decide to delete a contact, that ask the user if is sure to delete it.
-->
<template>
  <div>
    <form novalidate class="md-layout">
      <md-card class="md-layout-item">
        <md-card-header>
          <div>
            <md-button
              class="md-raised"
              v-if="!updating"
              v-on:click="changeEditMode(true)"
              >Edit</md-button
            >
          </div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('firstName')">
                <label for="first-name">First Name</label>
                <md-input
                  name="first-name"
                  id="first-name"
                  autocomplete="given-name"
                  v-model="contact.firstName"
                  :disabled="sending || !updating"
                />
                <span class="md-error" v-if="!$v.contact.firstName.required"
                  >The first name is required</span
                >
                <span
                  class="md-error"
                  v-else-if="!$v.contact.firstName.minLength"
                  >Invalid first name</span
                >
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('lastName')">
                <label for="last-name">Last Name</label>
                <md-input
                  name="last-name"
                  id="last-name"
                  autocomplete="family-name"
                  v-model="contact.lastName"
                  :disabled="sending || !updating"
                />
                <span class="md-error" v-if="!$v.contact.lastName.required"
                  >The last name is required</span
                >
                <span
                  class="md-error"
                  v-else-if="!$v.contact.lastName.minLength"
                  >Invalid last name</span
                >
              </md-field>
            </div>
          </div>
          <md-field :class="getValidationClass('phoneNumber')">
            <label for="phone">Phone Number</label>
            <md-input
              name="phoneNumber"
              id="phoneNumber"
              autocomplete="phoneNumber"
              v-model="contact.phoneNumber"
              :disabled="sending || !updating"
            />
            <span class="md-error" v-if="!$v.contact.phoneNumber.required"
              >The phone number is required</span
            >
          </md-field>

          <md-field :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              v-model="contact.email"
              :disabled="sending || !updating"
            />
            <span class="md-error" v-if="!$v.contact.email.required"
              >The email is required</span
            >
            <span class="md-error" v-else-if="!$v.contact.email.email"
              >Invalid email</span
            >
          </md-field>
          <md-field>
            <label>Notes</label>
            <md-textarea
              v-model="contact.notes"
              :disabled="sending || !updating"
            ></md-textarea>
          </md-field>

          <div>
            <md-chips
              v-model="contact.tags"
              md-placeholder="Add tag..."
              md-check-duplicated
              :md-static="sending || !updating"
            ></md-chips>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions v-if="updating">
          <md-button
            type="button"
            v-on:click="validateUserAndUpdate"
            class="md-primary"
            :disabled="sending"
            >Save</md-button
          >
          <md-button
            type="button"
            v-on:click="changeEditMode(false)"
            class="md-primary"
            :disabled="sending"
            >Cancel</md-button
          >
        </md-card-actions>
        <md-card-actions v-if="!updating">
          <md-button
            type="button"
            v-on:click="activeConfirm = true"
            class="md-primary"
            :disabled="sending"
            >Delete</md-button
          >
        </md-card-actions>
      </md-card>
      <md-snackbar :md-active.sync="userSaved"
        >The user {{ lastUser }} was updated with success!</md-snackbar
      >
    </form>
    <md-dialog-confirm
      :md-active.sync="activeConfirm"
      md-title="Are you sure to delete this contact?"
      md-content="All contact details will be lost"
      md-confirm-text="Agree"
      md-cancel-text="Disagree"
      @md-cancel="onCancel"
      @md-confirm="onConfirm"
    />
  </div>
</template>

<script>
/**
 * Use vuelidateto validate data, vuelidate is a Simple, lightweight model-based validation library for Vue.js.
 */
import store from "../store/index.js";
import router from "../router/index.js";
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";

export default {
  name: "Contact",
  mixins: [validationMixin], //import the vuelidate validation in the component as mixin
  props: {},
  data() {
    return {
      userSaved: false,
      sending: false,
      lastUser: null,
      activeConfirm: false
    };
  },
  computed: {
    /**
     * Selected contact in the rendered contact list,
     * get this from the Vuex store.
     */
    contact() {
      return store.getters.getSelectedContact;
    },

    /**
     * Boolean value to know when the user is updating the contact,
     * get this from Vuex store.
     */
    updating() {
      return store.getters.getUpdating;
    }
  },

  /**
   * Validation fields use to validate the information insert by the user when want to edit the contact,
   * use the library vuelidate.
   */

  validations: {
    contact: {
      firstName: {
        required, //type of built-in validators in vuelidate.
        minLength: minLength(3) //type of built-in validators in vuelidate.
      },
      lastName: {
        minLength: minLength(3)
      },
      phoneNumber: {
        required
      },
      email: {
        email //type of built-in validators in vuelidate.
      }
    }
  },
  methods: {
    /**
     * Is used to set the class of the md-field to md-invalid if the input isn't valid respect the validator setted over,
     * Check the $invalid state and $dirty state to set the value of md-invalid class.
     *
     * @param {string}  fieldName Is the name of the field to validate with vuelidate.
     */
    getValidationClass(fieldName) {
      const field = this.$v.contact[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },

    /**
     * This method use some timeout to inform the user of the update with a snackbar and a progress bar,
     * and update the contact in the contact list in Vuex store.
     */
    saveUser() {
      this.sending = true;

      window.setTimeout(() => {
        this.lastUser = `${this.contact.firstName} ${this.contact.lastName}`;
        this.userSaved = true;
        this.sending = false;
      }, 500);

      window.setTimeout(() => {
        store.commit("updateContact", this.contact);
      }, 1500);
    },

    /**
     * Validate the update user and close the edit mode if all the field are valid, checking the $invalid state of all validation fields,
     * $touch method of vuelidate sets the $dirty flag of the model and all its children to true recursively.
     */
    validateUserAndUpdate() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.saveUser();
        this.changeEditMode(false);
      }
    },

    /**
     *  Set the edit mode.
     *
     * @param {Boolean} editMode Value to set the editMode.
     */
    changeEditMode(editMode) {
      store.commit("setEditMode", editMode);
    },

    /**
     * This method delete the contact from the contact list in the Vuex store
     */
    deleteContact() {
      this.userSaved = false;
      this.sending = false;
      this.lastUser = null;
      this.activeConfirm = false;
      store.commit("removeContact", this.contact);
    },

    /**
     * If the user confirm to delete the contact in the dialog showed when the user click on Delete button,
     * call the deleteContact method and go back to the Home view with the use of Vue router.
     */
    onConfirm() {
      this.deleteContact();
      router.go(-1);
    },

    /**
     * This method not delete the contact and close the dialog to confirm the cancellation of the contact.
     */
    onCancel() {
      this.activeConfirm = false;
    }
  }
};
</script>

<style scoped>
.md-card {
  height: 100%;
}
</style>
