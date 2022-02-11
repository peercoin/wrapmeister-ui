<template>
  <div class="container mt-5">
    <loading-overlay :loading="!!voteStatus" :text="voteStatus" />
    <div class="body-vote py-3">
      <div class="row mt-1">
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

      <div class="row mt-3">
        <div class="col">
          <button class="btn btn-success" type="button" @click="voteAdd">
            Vote for Adding
          </button>
        </div>
        <div class="col">
          <button class="btn btn-success" type="button" @click="voteRemove">
            Vote for Removing
          </button>
        </div>
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
      testing: false, // restore this before commit
      address: "",
      account: null,  
      voteStatus: "",
      network: "",
      web3: null,
    };
  },

  async mounted() {
    if (Array.isArray(this.propsaccounts) && this.propsaccounts.length > 0) {
      this.account = this.propsaccounts[0];
    }

    if (!!this.$store.state.network) {
      this.network = this.$store.state.network;
    }
 
    const accounts = await this.getAccounts();
    if (!this.account || !accounts.includes(this.account)) {
      this.$store.commit("setAccount", "");
      console.warn("not allowed!!!!!!!!!!!!!");

      this.gotoHome();
      return;
    }

    this.$nextTick(() => {
      if (!this.testing && !this.isSigner && !this.isOwner) {
        console.warn("not allowed");

        this.gotoHome();
      }
    });
  },

  methods: {
    async getAccounts() {
      if (window.ethereum) {
        try {
          await ethereum.request({
            method: "eth_requestAccounts",
          });

          this.web3 = new Web3(ethereum);
          return await this.web3.eth.getAccounts();
        } catch (error) {
          console.log(error);
        }
      }

      return [];
    },

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

      return new this.web3.eth.Contract(ABI, getContractAddress(this.network), {
        from: this.account,
      });
    },

    async voteAdd() {
      this.voteStatus = "Voting to add " + this.address + "! Hold on...";

      await this.getContract()
        .methods.castAdminVote("add", this.address)
        .send();
      this.voteStatus = "";
    },

    async voteRemove() {
      this.voteStatus = "Voting to remove " + this.address + "! Hold on...";

      await this.getContract()
        .methods.castAdminVote("remove", this.address)
        .send();
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
.body-vote {
  min-height: 500px;
}
</style>
