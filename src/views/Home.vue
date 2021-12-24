<template>
  <div
    :class="{
      container: true,
      home: !(iswrapping && showHelp),
      'home-with-help': iswrapping && showHelp,
      'mt-5': true,
    }"
  >
    <modal
      v-if="popupModal"
      @modalconfirm="onModalConfirm"
      @modalclose="onModalClose"
    >
      <template v-slot:header>
        <p>Please select MetaMask account</p>
      </template>

      <template v-slot:body>
        <select
          :class="{ 'row-input-field': true, invalid: !modalaccount }"
          v-model="modalaccount"
        >
          <option v-for="item in accounts" :value="item" :key="item">
            {{ item }}
          </option>
        </select>
      </template>
    </modal>

    <div class="row">
      <div
        :class="{
          'col-12': !showHelp && iswrapping,
          'col-lg-10': showHelp && iswrapping,
        }"
      >
        <wrap-header />

        <div class="row my-3 mx-1">
          <div v-if="!metaMaskEnabled">
            <meta-mask-info />
          </div>
        </div>

        <div class="row g-0 mb-2 px-1">
          <div class="col-6 text-start fs-5">
            <span
              v-if="metaMaskEnabled && (iswrapping || isUnwrapping)"
              class="gobackdiv"
              @click="onBackClick"
              >Back</span
            >
          </div>
          <div class="col-6 text-end">
            <network-chooser
              v-if="metaMaskEnabled && !(iswrapping || isUnwrapping)"
            />
            <font-awesome-icon
              v-if="iswrapping"
              :icon="['far', 'question-circle']"
              size="1x"
              class="helpicon"
              @click="toggleHelp"
            />
          </div>
        </div>

        <div class="row mx-1 g-0">
          <div
            class="col py-3 px-3 body-mid"
            v-if="metaMaskEnabled && selectedAccount.length === 0"
          >
            <button
              type="button"
              :class="{ btn: true, 'btn-success': true }"
              @click="getAccounts"
            >
              Connect with MetaMask
            </button>
          </div>

          <div class="col py-3 px-3 body-mid" v-if="showMenu">
            <button
              type="button"
              :class="{ btn: true, 'btn-success': true, 'mx-1': true }"
              @click="toggleWrap"
              :disabled="!curNetwork"
            >
              Wrap Peercoin
            </button>

            <button
              type="button"
              :class="{ btn: true, 'btn-success': true, 'mx-1': true }"
              @click="toggleUnwrap"
              :disabled="!curNetwork"
            >
              Unwrap Peercoin
            </button>
          </div>

          <collapse-transition>
            <div v-if="showWrapOrUnwrap">
              <div v-if="iswrapping">
                <wrap-peercoin
                  :propsaccounts="selectedAccount"
                  @wrap-step-current="setWrapStatus"
                />
              </div>
              <div v-if="isUnwrapping">
                <unwrap-peercoin :propsaccounts="selectedAccount" />
              </div>
            </div>
          </collapse-transition>

          <official-total
            v-if="selectedAccount.length > 0"
            :propsaccounts="selectedAccount"
          ></official-total>

          <collapse-transition>
            <div class="mt-5 g-0" v-if="showSessions">
              <session-overview :propsaccounts="selectedAccount" />
            </div>
          </collapse-transition>

          <collapse-transition>
            <div class="mt-5 g-0" v-if="isSigner && showSessions">
              <sign-session-overview :propsaccounts="selectedAccount" />
            </div>
          </collapse-transition>

          <div class="mt-5 g-0" v-if="(isSigner || isOwner) && showSessions">
            <!-- temporary place button here, maybe introduce fancy menu button later  -->
            <button
              :class="{ btn: true, 'btn-success': true, 'mx-1': true }"
              type="button"
              @click="gotoNomination"
            >
              {{ nominateLabel }}
            </button>
          </div>

          <account-total />
        </div>
      </div>

      <div class="col-lg-2 mt-5" v-if="showHelp && iswrapping">
        <steps :step="wrapStatus" :iswrapping="iswrapping" />
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
// @ is an alias to /src
import WrapPeercoin from "@/components/WrapPeercoin.vue";
import UnwrapPeercoin from "@/components/UnwrapPeercoin.vue";
import CollapseTransition from "@/components/CollapseTransition.vue";
import MetaMaskInfo from "@/components/MetaMaskInfo.vue";
import SessionOverview from "@/components/SessionOverview.vue";
import SignSessionOverview from "@/components/SignSessionOverview.vue";
import OfficialTotal from "@/components/OfficialTotal.vue";
import Modal from "@/components/Modal.vue";
import AccountTotal from "@/components/AccountTotal.vue";
import WrapHeader from "@/components/WrapHeader.vue";
import NetworkChooser from "@/components/NetworkChooser.vue";
import { getNetworks, getSignAccounts, getOwnerAccounts } from "@/Endpoints.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Steps from "@/components/Steps.vue";

export default {
  name: "Home",

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
      modalaccount: null,
      popupModal: false,
      showHelp: false,
      wrapStatus: 1,
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
      this.showHelp = !this.showHelp;
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

    async getAccounts() {
      if (!window.ethereum) return;

      try {
        if (!(!!this.accounts && this.accounts.length > 0)) {
          await ethereum.request({
            method: "eth_requestAccounts",
          });

          const web3 = new Web3(ethereum);
          this.accounts = await web3.eth.getAccounts();
        }

        if (this.accounts.length > 1) {
          this.popupModal = true;
        } else if (this.accounts.length == 1) {
          this.account = this.accounts[0];
        }
      } catch (error) {
        console.log(error);
      }
    },

    onModalConfirm() {
      if (!!this.modalaccount) {
        this.account = this.modalaccount;
        this.popupModal = false;
      }
    },

    onModalClose() {
      this.popupModal = false;
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
  },

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

    gotoNomination() {
      if (!!this.selectedAccount)
        this.$router.push({
          name: "NominateAndVote",
          params: {
            selectedaccount: this.selectedAccount,
          },
        });
    },

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
  },
};
</script>

<style lang="scss" scoped>
.home {
  max-width: 900px;
  min-width: 400px;
}
.home-with-help {
  min-width: 400px;
}
.helpicon {
  color: #fefefe;
  &:hover {
    cursor: pointer;
    color: #b8bbb4;
  }
}
.gobackdiv {
  &:hover {
    cursor: pointer;
  }
}
</style>
