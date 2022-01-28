<template>
  <div class="container home mt-5">
    <loading-overlay :loading="!!voteStatus" :text="voteStatus" />
    <div class="col-xs-12 body-mid py-3">
      <div class="row g-0 mb-2 px-1">
        <div class="col-md-6 text-start fs-5">
          <span class="gobackdiv" @click="onBackClick">Back</span>
        </div>
        <div class="col-md-6 text-end"></div>
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
          @click="nominateAdd"
        >
          Nominate for Adding
        </button>
        <button
          class="btn btn-outline-primary btn-sm xxx"
          type="button"
          @click="nominateRemove"
        >
          Nominate for Removal
        </button>
        <button
          class="btn btn-outline-primary btn-sm xxx"
          type="button"
          @click="voteAdd"
        >
          Vote for Adding
        </button>
        <button
          class="btn btn-outline-primary btn-sm xxx"
          type="button"
          @click="voteRemove"
        >
          Vote for Removal
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getSignAccounts, getOwnerAccounts } from "@/Endpoints.js";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import Web3 from "web3";
import ABI from "@/abi/erc20.json";
import { getContractAddress } from "@/Endpoints.js";

export default {
  props: {
    propsaccounts: Array,
  },

  data() {
    return {
      address: "",
      account: null,
      voteStatus: "",
      network: "",
    };
  },

  mounted() {
    if (Array.isArray(this.propsaccounts) && this.propsaccounts.length > 0) {
      this.account = this.propsaccounts[0];
    }

    if (!!this.$store.state.network) {
      this.network = this.$store.state.network;
    }

    this.$nextTick(() => {
      if (!this.isSigner && !this.isOwner) {
        console.warn("not allowed");

        this.gotoHome();
      }
    });
  },

  methods: {
    gotoHome() {
      this.$router.push({
        name: "Home",
      });
    },

    onBackClick() {
      this.gotoHome();
    },

    getContract() {
      if (!this.web3) this.web3 = new Web3(ethereum);

      return new this.web3.eth.Contract(
        ABI,
        getContractAddress(this.network),
        {
          from: this.account,
        }
      );
    },

    async nominateAdd() {
      this.voteStatus = "Nominating " + this.address + " for adding! Hold on...";

      await this.getContract().methods.nominateAddressForAdmin(this.address).send();
      this.voteStatus = "";
    },

    async nominateRemove() {
      this.voteStatus = "Nominating " + this.address + " for removal! Hold on...";

      await this.getContract().methods.nominateAddressForRemoval(this.address).send();
      this.voteStatus = "";
    },

    async voteAdd() {
      this.voteStatus = "Voting to add " + this.address + "! Hold on...";

      await this.getContract().methods.castAdminVote("add", this.address).send();
      this.voteStatus = "";
    },

    async voteRemove() {
      this.voteStatus = "Voting to remove " + this.address + "! Hold on...";

      await this.getContract().methods.castAdminVote("remove", this.address).send();
      this.voteStatus = "";
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

    nominateLabel() {
      return this.isOwner ? "Nominate" : this.isSigner ? "Vote" : "";
    },
  },

  components: {
    LoadingOverlay,
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
