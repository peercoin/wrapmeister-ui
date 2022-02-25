<template>
  <wrap-header />
  <div class="container my-3">
    <div class="row mb-2 px-1">
      <div class="col-md-6 text-start fs-5">
        <network-chooser />
      </div>
      <collapse-transition>
        <div class="col-md-6 fs-5" v-if="showAddButton">
          <div class="d-grid gap-2">
            <button
              class="btn btn-success "
              @click="addTokenToMetamask"
              type="button"
            >
              Add wPPC TOKEN TO METAMASK
            </button>
          </div>
        </div>
      </collapse-transition>
    </div>
  </div>

  <div class="container mb-3" v-if="!metaMaskEnabled">
    <div class="row my-3">
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

  <div
    class="container mb-3"
    v-if="showMenu || (metaMaskEnabled && selectedAccount.length === 0)"
  >
    <div class="row my-3 g-0">
      <div class="row g-0">
        <div class="col-md-12">
          <div class="faq" @click="onFaqClick">
            <span>FAQ</span>
          </div>
        </div>
      </div>
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
import CollapseTransition from "@/components/CollapseTransition.vue";
import MetaMaskInfo from "@/components/MetaMaskInfo.vue";
import MetaMaskConnect from "@/components/MetaMaskConnect.vue";
import OfficialTotal from "@/components/OfficialTotal.vue";
import AccountTotal from "@/components/AccountTotal.vue";
import WrapMenu from "@/components/WrapMenu.vue";
import WrapHeader from "@/components/WrapHeader.vue";
import NetworkChooser from "@/components/NetworkChooser.vue"; //todo
import { getNetworks, getSignAccounts, getOwnerAccounts } from "@/Endpoints.js";

//this view is the entry point. It asks to Connect to MetaMask when propsaacount is not prefilled
export default {
  props: {
    propsaccounts: Array, //fallback
  },

  data() {
    return {
      networks: [],
    };
  },

  created() {
    this.eventBus.on("goto-home", this.gotoHome);
    this.networks = getNetworks().filter((nw) => nw.active);
  },

  mounted() {
    //set a default network if empty:
    if (!this.$store.state.network) {
      if (!!this.networks && this.networks.length > 0) {
        //pick first
        const network = this.networks[0].key;
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
    async addTokenToMetamask() {
      const network = this.$store.state.network;
      const ne = this.networks.find((nw) => nw.key === network);

      const tokenAddress = ne.contract;
      const tokenSymbol = ne.tokenSymbol;
      const tokenDecimals = ne.tokenDecimals;
      const tokenImage = ne.tokenImage;

      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            },
          },
        });

        if (wasAdded) {
          this.eventBus.emit("add-toastr", {
            text: "Click Add Token to register in MetaMask",
            type: "success",
          });
        } else {
          this.eventBus.emit("add-toastr", {
            text: "Unable to register token",
            type: "error",
          });
        }
      } catch (error) {
        console.log(error);
        this.eventBus.emit("add-toastr", {
          text: "Unable to register token",
          type: "error",
        });
      }
    },

    gotoHome() {
      if (this.selectedAccount.length > 0) {
        this.$router.push({
          name: "HomeAccount",
          params: {
            selectedaccount: this.selectedAccount,
          },
        });
      } else {
        this.$router.push({
          name: "Home",
        });
      }
    },

    onBackClick() {
      this.gotoHome();
    },

    onFaqClick() {
      this.$router.push({
        name: "FAQ",
      });
    },

    setCurrentAccount(curAccount) {
      if (!!curAccount) {
        this.$store.commit("setAccount", curAccount);
      }
    },

    setCurrentAction(curAction) {
      if (curAction === 1) {
        if (this.selectedAccount.length > 0 && !!this.$store.state.network) {
          this.$router.push({
            name: "StartWrap",
            params: {
              selectedaccount: this.selectedAccount,
              network: this.$store.state.network,
            },
          });
        }
      } else if (curAction === 2) {
        if (this.selectedAccount.length > 0 && !!this.$store.state.network) {
          this.$router.push({
            name: "StartUnwrap",
            params: {
              selectedaccount: this.selectedAccount,
              network: this.$store.state.network,
            },
          });
        }
      }
    },
  },
  ///////////////COMPUTED/////////////////////////////////
  computed: {
    showAddButton() {
      if (
        !!this.metaMaskEnabled &&
        this.networks.length > 0 &&
        !!this.$store.state.account &&
        !!this.$store.state.network
      ) {
        const network = this.$store.state.network;
        const ne = this.networks.find((nw) => nw.key === network);

        return (
          !!ne &&
          ne.hasOwnProperty("tokenSymbol") &&
          ne.hasOwnProperty("tokenDecimals") &&
          ne.hasOwnProperty("tokenImage") &&
          !!ne.tokenSymbol &&
          !!ne.tokenDecimals &&
          !!ne.tokenImage
        );
      }
      return false;
    },
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
        //console.warn("account from props");
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
    CollapseTransition,
    MetaMaskInfo,
    OfficialTotal,
    AccountTotal,
    NetworkChooser, //todo
    MetaMaskConnect,
    WrapMenu,
    WrapHeader,
  },
};
</script>
<style lang="scss" scoped>
.faq {
  padding-bottom: 7px;
  padding-top: 7px;

  border: 1px solid #3cb054;
  // background-color: #fff;
  text-align: center;
  opacity: 1;
  font-size: 14px;
  background-color: #3cb054;
  color: white;
  border-radius: 8px;
  &:hover {
    cursor: pointer;
    background-color: #efefef;
    color: #3cb054;
  }
}
</style>
