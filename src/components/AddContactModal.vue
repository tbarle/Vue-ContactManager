<!--
This is the component to add a contact to the contact list of the application.
It is composed by:
    An icon button to open the dialog to add the contact
    A dialog with a form composed by all the fields to fill for add a contact.
    A button to complete the insertion of the contact in the contact list.
-->
<template>
  <div>
    <md-button class="md-primary" @click="showDialog = true" v-if="!updating">
      <md-icon>{{ mdIcon }}</md-icon></md-button
    >

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>New Contact</md-dialog-title>

      <form novalidate class="md-layout">
        <md-card class="md-layout-item">
          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('firstName')">
                  <label for="first-name">First Name</label>
                  <md-input
                    name="first-name"
                    id="first-name"
                    autocomplete="given-name"
                    v-model="form.firstName"
                    :disabled="sending"
                  />
                  <span class="md-error" v-if="!$v.form.firstName.required"
                    >The first name is required</span
                  >
                  <span
                    class="md-error"
                    v-else-if="!$v.form.firstName.minLength"
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
                    v-model="form.lastName"
                    :disabled="sending"
                  />
                  <span class="md-error" v-if="!$v.form.lastName.required"
                    >The last name is required</span
                  >
                  <span class="md-error" v-else-if="!$v.form.lastName.minLength"
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
                v-model="form.phoneNumber"
                :disabled="sending"
              />
              <span class="md-error" v-if="!$v.form.phoneNumber.required"
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
                v-model="form.email"
                :disabled="sending"
              />
              <span class="md-error" v-if="!$v.form.email.required"
                >The email is required</span
              >
              <span class="md-error" v-else-if="!$v.form.email.email"
                >Invalid email</span
              >
            </md-field>

            <md-field>
              <label>Notes</label>
              <md-textarea v-model="form.notes"></md-textarea>
            </md-field>

            <div>
              <md-chips
                v-model="form.tags"
                md-placeholder="Add tag..."
                md-check-duplicated
              ></md-chips>
            </div>
          </md-card-content>

          <md-progress-bar md-mode="indeterminate" v-if="sending" />

          <md-card-actions>
            <md-button
              type="button"
              v-on:click="validateUserAndSave"
              class="md-primary"
              :disabled="sending"
              >Create user</md-button
            >
          </md-card-actions>
        </md-card>
        <md-snackbar :md-active.sync="userSaved"
          >The user {{ lastUser }} was saved with success!</md-snackbar
        >
      </form>
    </md-dialog>
  </div>
</template>

<script>
/**
 * Use vuelidateto validate data, vuelidate is a Simple, lightweight model-based validation library for Vue.js.
 */

import store from "../store/index.js";
import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";

export default {
  name: "AddContactModal",
  mixins: [validationMixin], //import the vuelidate validation in the component as mixin.
  data() {
    return {
      showDialog: false, //used to show the dialog for add a contact.
      form: {
        //fields of a contact.
        firstName: "",
        lastName: "",
        phoneNumber: "",
        notes: "",
        email: "",
        tags: []
      },
      userSaved: false, //These three value are use to inform the user about the insertion of the contact in the contact list.
      sending: false,
      lastUser: null
    };
  },
  props: {
    //Prop of the component used to specify the md-icon of the button for open the dialog.
    mdIcon: {
      type: String,
      default: "add_box",
      required: true
    }
  },

  computed: {
    /**
     * Boolean value to know when the user is updating the contact for diasble the add button.
     * get this from Vuex store.
     */
    updating() {
      return store.getters.getUpdating;
    }
  },

  /**
   * Validation fields use to validate the information insert by the user when want to add a contact,
   * use the library vuelidate.
   */
  validations: {
    form: {
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
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },

    /**
     * This method clear all the fields of the form and reset the validation value.
     */
    clearForm() {
      this.$v.$reset();
      this.form.firstName = "";
      this.form.lastName = "";
      this.form.email = "";
      this.form.phoneNumber = "";
      this.form.notes = "";
      this.form.tags = [];
    },

    /**
     * This method use some timeout to inform the user about the correct insertion of the new contact,
     * create a Json contact using data from the form fields, and add the contact to the
     * contact list in the Vuex store
     */
    saveUser() {
      this.sending = true;

      window.setTimeout(() => {
        this.lastUser = `${this.form.firstName} ${this.form.lastName}`;
        this.userSaved = true;
        this.sending = false;
      }, 500);

      window.setTimeout(() => {
        store.commit("incrementLastID");
        let contact = {
          id: store.getters.getLastID,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          phoneNumber: this.form.phoneNumber,
          email: this.form.email,
          notes: this.form.notes,
          tags: this.form.tags
        };
        store.commit("addContact", contact);
        this.clearForm();
        this.showDialog = false;
        this.lastUser = null;
      }, 1500);
    },

    /**
     * Validate the new user to add checking the $invalid state of all validation fields,
     * $touch method of vuelidate sets the $dirty flag of the model and all its children to true recursively.
     */
    validateUserAndSave() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.saveUser();
      }
    }
  }
};
</script>

<style scoped>
.md-dialog {
  max-width: 90%;
  max-height: 90%;
  height: fit-content;
  overflow-y: overlay;
}
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>
