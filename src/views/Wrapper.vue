<template>
  <div class="container my-3">
    <div class="row g-0 mb-2 px-1">
      <div class="col-md-6 text-start fs-5">
        <network-chooser
          v-if="metaMaskEnabled && !(iswrapping || isUnwrapping)"
        />
      </div>
    </div>
  </div>

  <div class="container mb-3" v-if="!metaMaskEnabled">
    <div class="row my-3 mx-1">
      <meta-mask-info />
    </div>
  </div>

  <div
    class="container mb-3"
    v-if="metaMaskEnabled && selectedAccount.length === 0"
  >
    <div class="row my-3 mx-1">
      <meta-mask-connect
        :propsaccounts="propsaccounts"
        @account-current="setCurrentAccount"
      />
    </div>
  </div>

  <div class="container mb-3" v-if="iswrapping">
    <div class="row my-3 mx-1">
      <multi-steps-progress :step="wrapStatus" :iswrapping="iswrapping" />
    </div>
  </div>


  <div class="container mb-3" v-if="showMenu">
    <div class="row my-3 mx-1">
      <wrap-menu />
    </div>
  </div>


  <div class="container mb-5">
    <div class="row my-3 mx-1">
      <div class="col-md-2 ">1212</div>
      <div class="col-md-8 ">343</div>
      <div class="col-md-2 ">
        <font-awesome-icon
          v-if="iswrapping"
          :icon="['far', 'question-circle']"
          size="1x"
          class="helpicon"
          @click="toggleHelp"
        />
      </div>
    </div>
  </div>

  <div class="container mb-5">
    aaaaa
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
//import Web3 from "web3"; //todo slots!!!!!!
// @ is an alias to /src
import WrapPeercoin from "@/components/WrapPeercoin.vue";
import UnwrapPeercoin from "@/components/UnwrapPeercoin.vue";
import CollapseTransition from "@/components/CollapseTransition.vue";
import MetaMaskInfo from "@/components/MetaMaskInfo.vue";
import MetaMaskConnect from "@/components/MetaMaskConnect.vue";
import SessionOverview from "@/components/SessionOverview.vue";
import SignSessionOverview from "@/components/SignSessionOverview.vue";
import MultiStepsProgress from "@/components/MultiStepsProgress.vue";
import OfficialTotal from "@/components/OfficialTotal.vue";
import Modal from "@/components/Modal.vue";
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
      //for now:
      this.gotoHome();
    },

    setWrapStatus(status) {
      this.wrapStatus = status;
    },

    //     async getAccounts() {
    //       if (!window.ethereum) return;
    // debugger;
    //       try {
    //         if (!(!!this.accounts && this.accounts.length > 0)) {
    //           await ethereum.request({
    //             method: "eth_requestAccounts",
    //           });

    //           const web3 = new Web3(ethereum);
    //           this.accounts = await web3.eth.getAccounts();
    //         }

    //         if (this.accounts.length > 1) {
    //           this.popupModal = true;
    //         } else if (this.accounts.length == 1) {
    //           this.account = this.accounts[0];
    //         }
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     },

    // onModalConfirm() {
    //   if (!!this.modalaccount) {
    //     this.account = this.modalaccount;
    //     this.popupModal = false;
    //   }
    // },

    // onModalClose() {
    //   this.popupModal = false;
    // },

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
  },
  ////////////////////////////////////////////////
  computed: {
    curNetwork() {
      return this.$store.state.network;
    },

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

    // gotoNomination() {
    //   if (!!this.selectedAccount)
    //     this.$router.push({
    //       name: "NominateAndVote",
    //       params: {
    //         selectedaccount: this.selectedAccount,
    //       },
    //     });
    // },

    nominateLabel() {
      return this.isOwner ? "Nominate" : this.isSigner ? "Vote" : "";
    },
  },

  components: {
    CollapseTransition,
    WrapPeercoin,
    UnwrapPeercoin,
    MetaMaskInfo,
    SessionOverview,
    SignSessionOverview,
    Modal,
    OfficialTotal,
    AccountTotal,
    WrapHeader,
    NetworkChooser,
    FontAwesomeIcon,
    Steps,
    MultiStepsProgress,
    SlideoutPanel,
    MetaMaskConnect,WrapMenu
  },
};
</script>

<style lang="scss" scoped></style>
