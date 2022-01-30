<template>
  <div class="container my-3">
    <div class="row mb-2 px-1">
      <div class="col-md-6 text-start fs-5">
        <network-chooser
          v-if="metaMaskEnabled && !(iswrapping || isUnwrapping)"
        />
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
          :propsaccounts="propsaccounts"
          @account-current="setCurrentAccount"
        />
      </div>
    </div>
  </div>

  <div class="container mb-3" v-if="1 == 2 && iswrapping">
    <div class="row my-3 mx-1">
      move to wrap page :
      <multi-steps-progress :step="wrapStatus" :iswrapping="iswrapping" />
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

  <div class="container mb-5">
    <div class="row my-3 mx-1">
      <div class="col-md-2 ">
        move this to wrap page
        <font-awesome-icon
          v-if="1 == 1 || iswrapping"
          :icon="['far', 'question-circle']"
          size="1x"
          class="helpicon"
          @click="toggleHelp"
        />
      </div>
    </div>
  </div>

  <div>
    <slideout-panel
      ref="slideoutpanel"
      @hideSlideOutPanel="onHideSlideOutPanel"
    >
      <template v-slot:panelslot>
        <steps :step="wrapStatus" :iswrapping="iswrapping" />
      </template>
    </slideout-panel>
  </div>
</template>

<script>
//import Web3 from "web3";
import CollapseTransition from "@/components/CollapseTransition.vue"; //todo
import MetaMaskInfo from "@/components/MetaMaskInfo.vue";
import MetaMaskConnect from "@/components/MetaMaskConnect.vue";
import MultiStepsProgress from "@/components/MultiStepsProgress.vue"; //to
import OfficialTotal from "@/components/OfficialTotal.vue";
import AccountTotal from "@/components/AccountTotal.vue";
import WrapHeader from "@/components/WrapHeader.vue";
import WrapMenu from "@/components/WrapMenu.vue";
import NetworkChooser from "@/components/NetworkChooser.vue";
import { getNetworks, getSignAccounts, getOwnerAccounts } from "@/Endpoints.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Steps from "@/components/Steps.vue";
import SlideoutPanel from "@/components/SlideoutPanel.vue";

export default {
  props: {
    propsaccounts: Array,
  },

  data() {
    return {
      sessionId: "",
      iswrapping: false,
      isUnwrapping: false,
      accounts: [],
      account: null,
      showHelp: false,
      wrapStatus: 1,
      currentPanelId: "",
    };
  },

  created() {
    this.eventBus.on("goto-home", this.gotoHome);
  },

  mounted() {
    if (Array.isArray(this.propsaccounts) && this.propsaccounts.length > 0) {
      this.account = this.propsaccounts[0];
    }

    if (!this.$store.state.network) {
      const networks = getNetworks().filter((nw) => nw.active);

      if (!!networks && networks.length > 0) {
        const network = networks[0].key;

        this.$store.commit("setNetwork", network);
      }
    }
  },

  beforeUnmount() {
    this.eventBus.off("goto-home", this.gotoHome);
  },

  methods: {
    toggleHelp() {
      this.showHelp = true;

      this.currentPanelId = "panelId" + Date.now();
      const options = {
        id: this.currentPanelId,
        panelMode: true,
        width: "344px",
      };

      this.$refs.slideoutpanel.showSlideOutPanel(options);
    },

    gotoHome() {
      this.sessionId = "";
      this.iswrapping = false;
      this.isUnwrapping = false;
      this.$router.push({
        name: "Home",
      });
    },

    onBackClick() {
      this.gotoHome();
    },

    setWrapStatus(status) {
      this.wrapStatus = status;
    },

    gotoSession(id) {
      this.$router.push({
        name: "Session",
        params: { id: id },
      });
    },

    toggleWrap() {
      this.iswrapping = !this.iswrapping;
    },

    toggleUnwrap() {
      this.isUnwrapping = !this.isUnwrapping;
    },

    onHideSlideOutPanel(panelresult) {
      this.showHelp = false;
    },

    setCurrentAccount(curAccount) {
      this.account = curAccount;
    },

    setCurrentAction(curAction) {
      if (curAction === 1) {
        alert("todo goto wrap form");
        this.toggleWrap();
      } else if (curAction === 2) {
        this.toggleUnwrap();
        alert("todo goto unwrap form");
      }
    },
  },
  ///////////////COMPUTED/////////////////////////////////
  computed: {
    curNetwork() {
      return this.$store.state.network;
    },

    //returns a array with selected account
    selectedAccount() {
      if (!!this.account) {
        return [this.account];
      }
      return [];
    },

    metaMaskEnabled() {
      return !!window.ethereum && !!ethereum.request;
    },

    showMenu() {
      return (
        !!this.metaMaskEnabled &&
        this.selectedAccount.length > 0 &&
        !this.iswrapping &&
        !this.isUnwrapping
      );
    },

    showWrapOrUnwrap() {
      return (
        !!this.metaMaskEnabled &&
        (this.iswrapping || this.isUnwrapping) &&
        this.selectedAccount.length > 0
      );
    },

    showSessions() {
      return (
        !!this.metaMaskEnabled &&
        !(this.iswrapping || this.isUnwrapping) &&
        this.selectedAccount.length > 0
      );
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
    // WrapPeercoin,
    // UnwrapPeercoin,
    MetaMaskInfo,
    // SessionOverview,
    // SignSessionOverview,
    //  Modal, //todo
    OfficialTotal,
    AccountTotal,
    WrapHeader,
    NetworkChooser,
    FontAwesomeIcon,
    Steps, //todo
    MultiStepsProgress, //todo
    SlideoutPanel,
    MetaMaskConnect,
    WrapMenu,
  },
};
</script>

<style lang="scss" scoped>
.helpicon {
  color: #8f0c0c;
  &:hover {
    cursor: pointer;
    color: #b8bbb4;
  }
}
</style>
