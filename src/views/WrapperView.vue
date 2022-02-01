<template>
  <div class="container my-3">
    <div class="row mb-2 px-1">
      <div class="col-md-6 text-start fs-5">
        <network-chooser />
      </div>
    </div>
  </div>

  <div class="container mb-3" v-if="!metaMaskEnabled">
    <div class="row my-3 mx-1">
      <div class="col-md-12">
        <meta-mask-info />
      </div>
    </div>
  </div>

  <div
    class="container mb-3"
    v-if="metaMaskEnabled && selectedAccount.length === 0"
  >
    <div class="row my-3">
      <div class="col-md-12">
        <meta-mask-connect
          :propsaccounts="selectedAccount"
          @account-current="setCurrentAccount"
        />
      </div>
    </div>
  </div>

  <div class="container mb-3" v-if="showMenu">
    <div class="col-md-12 ">
      <wrap-menu
        :isOwner="isOwner"
        :isSigner="isSigner"
        :showSessions="showSessions"
        :propsaccounts="selectedAccount"
        @wrapaction-current="setCurrentAction"
      />
    </div>
  </div>

  <div class="container mb-3" v-if="showMenu">
    <div class="row my-3 g-0">
      <official-total
        v-if="selectedAccount.length > 0"
        :propsaccounts="selectedAccount"
      ></official-total>
    </div>
  </div>

  <div class="container mb-3">
    <div class="row my-3 g-0">
      <account-total />
    </div>
  </div>
</template>

<script>
import MetaMaskInfo from "@/components/MetaMaskInfo.vue";
import MetaMaskConnect from "@/components/MetaMaskConnect.vue";
import OfficialTotal from "@/components/OfficialTotal.vue";
import AccountTotal from "@/components/AccountTotal.vue";
import WrapMenu from "@/components/WrapMenu.vue";
import NetworkChooser from "@/components/NetworkChooser.vue"; //todo
import { getNetworks, getSignAccounts, getOwnerAccounts } from "@/Endpoints.js";

//this view is the entry point. It asks to Connect to MetaMask when propsaacount is not prefilled
export default {
  props: {
    propsaccounts: Array, //fallback
  },

  // data() {
  //   return {
  //   };
  // },

  created() {
    this.eventBus.on("goto-home", this.gotoHome);
  },

  mounted() {
    console.warn("wrapperview mounted");
    //set a default network if empty:
    if (!this.$store.state.network) {
      const networks = getNetworks().filter((nw) => nw.active);

      if (!!networks && networks.length > 0) {
        const network = networks[0].key;

        this.$store.commit("setNetwork", network);
      }
    }
    //set vuex account if empty:
    if (
      !this.$store.state.account &&
      Array.isArray(this.propsaccounts) &&
      this.propsaccounts.length > 0
    ) {
      this.$store.commit("setAccount", this.propsaccounts[0]);
    }
  },

  beforeUnmount() {
    this.eventBus.off("goto-home", this.gotoHome);
  },

  methods: {
    gotoHome() {
      if (this.selectedAccount.length > 0) {
        this.$router.push({
          name: "HomeAccount",
          params: {
            selectedaccount: this.selectedAccount,
          },
        });
      }

      // if (Array.isArray(this.propsaccounts) && this.propsaccounts.length > 0) {
      //   this.setCurrentAccount(this.propsaccounts[0]);
      //   this.$router.push({
      //     name: "HomeAccount",
      //     params: {
      //       selectedaccount: this.propsaccounts,
      //     },
      //   });
      // } else
      else {
        this.$router.push({
          name: "Home",
        });
      }
    },

    onBackClick() {
      this.gotoHome();
    },

    setCurrentAccount(curAccount) {
      if (!!curAccount) {
        this.$store.commit("setAccount", curAccount);
      }
    },

    setCurrentAction(curAction) {
      if (curAction === 1) {
        alert("todo goto wrap form");
        //this.toggleWrap();
      } else if (curAction === 2) {
        //this.toggleUnwrap();
        alert("todo goto unwrap form");
      }
    },
  },
  ///////////////COMPUTED/////////////////////////////////
  computed: {
    curNetwork() {
      return this.$store.state.network;
    },

    metaMaskEnabled() {
      return !!window.ethereum && !!ethereum.request;
    },

    showMenu() {
      return !!this.metaMaskEnabled && this.selectedAccount.length > 0;
    },

    //returns a array with selected account
    selectedAccount() {
      if (!!this.$store.state.account) {
        return [this.$store.state.account];
      }

      if (Array.isArray(this.propsaccounts) && this.propsaccounts.length > 0) {
        console.warn("account from props");
        return this.propsaccounts;
      }

      return [];
    },

    showSessions() {
      return !!this.metaMaskEnabled && this.selectedAccount.length > 0;
    },

    isSigner() {
      //return true;
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

  components: {
    //CollapseTransition,
    MetaMaskInfo,
    OfficialTotal,
    AccountTotal,
    NetworkChooser, //todo
    MetaMaskConnect,
    WrapMenu,
  },
};
</script>
