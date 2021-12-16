<template>
  <div class="container home mt-5">
    <div class="col-xs-12 body-mid py-3">
      <div class="row g-0 mb-2 px-1">
        <div class="col-md-6 text-start fs-5 ">
          <span class="gobackdiv" @click="onBackClick">Back</span>
        </div>
        <div class="col-md-6 text-end"></div>
      </div>

      <div class="row mb-2">
        <div class="col-xs-12 col-md-6">
          <p>Smart contract platform</p>
        </div>
        <div class="col-xs-12 col-md-6">
          <select
            :class="{ 'row-input-field': true, invalid: !network }"
            v-model="network"
          >
            <option
              v-for="item in activeNetworks"
              :value="item.key"
              :key="item.key"
            >
              {{ item.description }}
            </option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-6">
          <p>Address</p>
        </div>
        <div class="col-xs-12 col-md-6">
          <input
            type="text"
            :class="{ 'row-input-field': true }"
            v-model="address"
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
import Web3 from "web3";
import ABI from "@/abi/erc20.json";
import { getNetworks, getContractAddress } from "@/Endpoints.js";

export default {
  props: {
    propsaccounts: Array,
  },

  data() {
    return {
      address: "",
      account: null,
      activeNetworks: getNetworks(),
      network: getNetworks()[0]
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

    async doNomination() {
      console.log(this.account);

      if (!this.web3) this.web3 = new Web3(ethereum);

      const contract = new this.web3.eth.Contract(ABI, getContractAddress(this.network), {
        from: this.account,
      });

      let result;

      if (this.isOwner) {
        result = await contract.methods.addAdmin(
          this.address
        ).send();
      } else if (this.isSigner) {
        result = await contract.methods.castAdminVote(
          "add",
          this.address
        ).send();
      } else {
        console.log("Wtf?");
      }

      console.log(result);
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
