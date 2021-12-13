<template>
  <div class="container home mt-5">
    <div class="col-xs-12 body-mid py-3">
      <div class="row g-0 mb-2 px-1">
        <div class="col-md-6 text-start fs-5 ">
          <span class="gobackdiv" @click="onBackClick">Back</span>
        </div>
        <div class="col-md-6 text-end"></div>
      </div>

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
  </div>
</template>

<script>
import { getSignAccounts, getOwnerAccounts } from "@/Endpoints.js";

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
      if (!this.isSigner && !this.isOwner) {
        console.warn("not allowed");
      }
    });
  },

  methods: {
    gotoHome() {
      this.sessionId = "";
      this.iswrapping = false;
      this.isUnwrapping = false;
      this.$router.push({
        name: "Home",
      });
    },

    onBackClick() {
      //for now:
      this.gotoHome();
    },

    doNomination() {
      console.log("hi there");
    },
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

    isOwner() {
      //return true;
      if (
        !!this.selectedAccount &&
        !!this.selectedAccount[0] &&
        getOwnerAccounts().includes(this.selectedAccount[0])
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  max-width: 900px;
  min-width: 400px;
}
.gobackdiv {
  &:hover {
    cursor: pointer;
  }
}
</style>
