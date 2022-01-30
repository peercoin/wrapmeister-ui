<template>
  <modal
    v-if="popupModal"
    @modalconfirm="onModalConfirm"
    @modalclose="onModalClose"
  >
    <template v-slot:header>
      <p>Multiple accounts detected, please select an account to continue.</p>
    </template>

    <template v-slot:body>
      <select
        :class="{ rowdorpdown: true, invalid: !modalaccount }"
        v-model="modalaccount"
      >
        <option v-for="item in accounts" :value="item" :key="item">
          {{ item }}
        </option>
      </select>
    </template>
  </modal>
  <div class="connectinfobox">
    <div class="container">
      <div class="row my-1">
        <div class="col-md-2 my-2 "></div>

        <div class="col-md-8 my-2 text-center">
          <button
            type="button"
            class="btn btn-success mt-4 mb-3"
            @click="getAccounts"
          >
            Connect with MetaMask
          </button>
        </div>

        <div class="col-md-2 my-2 "></div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import Modal from "@/components/Modal.vue";

export default {
  emits: ["account-current"],
  components: {
    Modal,
  },

  props: {
    propsaccounts: Array,
  },

  data() {
    return {
      popupModal: false,
      modalaccount: null,
      accounts: [],
    };
  },

  methods: {
    onModalConfirm() {
      if (!!this.modalaccount) {
        const account = this.modalaccount;

        this.popupModal = false;
        this.$emit("account-current", account);
      }
    },

    onModalClose() {
      this.popupModal = false;
    },

    async getAccounts() {
      if (!window.ethereum) return;

      try {
        if (!(!!this.propsaccounts && this.propsaccounts.length > 0)) {
          await ethereum.request({
            method: "eth_requestAccounts",
          });

          const web3 = new Web3(ethereum);
          this.accounts = await web3.eth.getAccounts();
        }
        //to test: set to 0 to see modal:
        if (this.accounts.length > 1) {
          this.popupModal = true;
        } else if (this.accounts.length == 1) {
          const account = this.accounts[0];
          this.$emit("account-current", account);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.connectinfobox {
  padding: 15px;
  margin-bottom: 20px;
  border: 0x solid transparent;
  border-radius: 10px;

  color: #fff;
  background-color: #3cb054;
  border-color: #faebcc;
}
.maxwidthexplain {
  max-width: 295px;
}
.inner {
  display: table;
  margin: 0 auto;
}
.outer {
  width: 100%;
}

.rowdorpdown.invalid {
  border: 1px solid #df6262;
}

.rowdorpdown {
  width: 90%;

  border: 1px solid #c2c2c2;

  padding: 7px;
  outline: none;
  font-size: 11px;
}
</style>
