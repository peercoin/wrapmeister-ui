<template>
  <div class="col-xs-12 body-mid py-3">
    <div class="row justify-content-center mb-5">
        <div class="col-3 text-center">
            centered text
        </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-md-6">
        <p>insert something</p>
      </div>
      <div class="col-xs-12 col-md-6">
        <input
          type="text"
          :class="{ 'row-input-field': true }"
          v-model="something"
        />
      </div>
    </div>
    <div class="row">
        <button
          class="btn btn-outline-primary btn-sm xxx"
          type="button"
          @click="doNomination"
        >
          nominate
        </button>
    </div>
  </div>
</template>

<script>
import { getSignAccounts } from "@/Endpoints.js";
export default {
  props: {
    propsaccounts: Array,
  },

  data() {
    return {
      something: "",
      account: null,
    };
  },

  mounted() {
    if (Array.isArray(this.propsaccounts) && this.propsaccounts.length > 0) {
      this.account = this.propsaccounts[0];
    }

    this.$nextTick(() => {
      if (!this.isSigner) {
        console.warn("not allowed");
      }
    });
  },

  methods: {
      doNomination(){
          console.log('hi there')
      }
  },

  computed: {
    selectedAccount() {
      if (!!this.account) {
        return [this.account];
      }
      return [];
    },

    isSigner() {
      if (
        !!this.selectedAccount &&
        !!this.selectedAccount[0] &&
        getSignAccounts().includes(this.selectedAccount[0])
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>
