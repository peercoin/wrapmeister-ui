<template>
  <div class="container home mt-5">
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

    <wrap-header />

    <div class="row my-3 mx-1">
      <div v-if="!metaMaskEnabled">
        <meta-mask-info />
      </div>
    </div>

    <div class="row g-0 mb-2 px-1">
      <div class="col-md-6 text-start fs-5 ">
        <span
          v-if="metaMaskEnabled && (iswrapping || isUnwrapping)"
          class="gobackdiv"
          @click="onBackClick"
          >Back</span
        >
      </div>
      <div class="col-md-6 text-end">
        <network-chooser
          v-if="metaMaskEnabled && !(iswrapping || isUnwrapping)"
        />
      </div>
    </div>

    <div class="row  mx-1 g-0">
      <div
        class="col py-3 px-3 body-mid"
        v-if="metaMaskEnabled && selectedAccount.length === 0"
      >
        <m-button class="mx-1" type="success" @mbclick="getAccounts"
          >Connect with MetaMask</m-button
        >
      </div>

      <div class="col py-3 px-3 body-mid" v-if="showMenu">
        <m-button
          class="mx-1"
          :disabled="!curNetwork"
          type="success"
          @mbclick="toggleWrap"
          >Wrap Peercoin</m-button
        >

        <m-button
          class="mx-1"
          type="success"
          :disabled="!curNetwork"
          @mbclick="toggleUnwrap"
          >Unwrap Peercoin</m-button
        >
      </div>

      <collapse-transition>
        <div v-if="showWrapOrUnwrap">
          <div v-if="iswrapping">
            <wrap-peercoin :propsaccounts="selectedAccount" />
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

      <div class="mt-5 g-0" v-if="isSigner && showSessions">
        <!-- temporary place button here -->
        <button
          class="btn btn-outline-primary btn-sm xxx"
          type="button"
          @click="gotoNomination"
        >
          nominate
        </button>
      </div>

      <account-total />
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
// @ is an alias to /src
import MButton from "@/components/Button.vue";
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
import { getNetworks, getSignAccounts } from "@/Endpoints.js";

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

    gotoNomination() {
      if (!!this.selectedAccount)
        this.$router.push({
          name: "NominateAndVote",
          params: {
            selectedaccount: this.selectedAccount,
          },
        });
    },
  },

  components: {
    MButton,
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
