<template>
  <div class="col-xs-12 py-3 px-5">
    <loading-overlay :loading="!!unwrapstatus" :text="unwrapstatus" />
    <modal
      v-if="popupModal"
      @modalconfirm="onModalConfirm"
      @modalclose="onModalClose"
      body="Proceed with MetaMask?"
    ></modal>

    <div class="d-sm-none">
      <input
        id="sessionnetwork"
        class="form-control wrapinput"
        type="text"
        :value="selectedNetworkDescription"
        readonly
      />
      <div class="wrapinput-label-container text-start">
        <label for="sessionnetwork" class="form-label wrapinput-label "
          >SMART CONTRACT PLATFORM</label
        >
      </div>

      <input
        id="sessionamount"
        class="form-control wrapinput"
        :class="{ invalid: !aboveMinAmount }"
        type="number"
        v-model="amount"
        @keypress="onlyForCurrency"
      />
      <div class="wrapinput-label-container text-start">
        <label for="sessionamount" class="form-label wrapinput-label "
          >AMOUNT</label
        >
      </div>

      <input
        id="sessionpeercoinaddress"
        class="form-control wrapinput"
        :class="{ invalid: !validPPCAddress }"
        type="text"
        v-model="destinationPPCAddress"
        @keypress="onlyForAddress"
      />
      <div class="wrapinput-label-container text-start">
        <label for="sessionpeercoinaddress" class="form-label wrapinput-label "
          >PEERCOIN ADDRESS</label
        >
      </div>

      <div class="text-start moveup">
        <img
          class="foxy-down"
          alt="MetaMask"
          height="15"
          src="../assets/metamask-fox.svg"
        />
        <input
          id="sessionaccount"
          class="form-control wrapinput accounttext moverightpadding"
          type="text"
          :value="destinationETHAddress"
          readonly
        />
        <div class="wrapinput-label-container text-start">
          <label for="sessionaccount" class="form-label wrapinput-label "
            >CONNECTED ACCOUNT</label
          >
        </div>
      </div>
    </div>

    <!-- sm view or larger: -->
    <div class="d-none d-sm-block px-5">
      <input
        id="sessionnetwork"
        class="form-control wrapinput"
        type="text"
        :value="selectedNetworkDescription"
        readonly
      />
      <div class="wrapinput-label-container text-start">
        <label for="sessionnetwork" class="form-label wrapinput-label "
          >SMART CONTRACT PLATFORM</label
        >
      </div>

      <input
        id="sessionamount"
        class="form-control wrapinput"
        :class="{ invalid: !aboveMinAmount }"
        type="number"
        v-model="amount"
        @keypress="onlyForCurrency"
      />
      <div class="wrapinput-label-container text-start">
        <label for="sessionamount" class="form-label wrapinput-label "
          >AMOUNT</label
        >
      </div>

      <input
        id="sessionpeercoinaddress"
        class="form-control wrapinput"
        :class="{ invalid: !validPPCAddress }"
        type="text"
        v-model="destinationPPCAddress"
        @keypress="onlyForAddress"
      />
      <div class="wrapinput-label-container text-start">
        <label for="sessionpeercoinaddress" class="form-label wrapinput-label "
          >PEERCOIN ADDRESS</label
        >
      </div>

      <div class="text-start moveup">
        <img
          class="foxy-down-lg"
          alt="MetaMask"
          height="15"
          src="../assets/metamask-fox.svg"
        />
        <input
          id="sessionaccount"
          class="form-control wrapinput accounttext-lg moverightpadding"
          type="text"
          :value="destinationETHAddress"
          readonly
        />
        <div class="wrapinput-label-container  text-start">
          <label for="sessionaccount" class="form-label wrapinput-label "
            >CONNECTED ACCOUNT</label
          >
        </div>
      </div>
    </div>

    <!-- all views -->

    <div class="row mb-2" v-show="validForm && !callingunwrap">
      <div class="col-xs-12 mt-3">
        <button
          type="button"
          :class="{ btn: true, 'btn-outline-success': true }"
          @click="unwrap"
          :disabled="!validForm"
        >
          REDEEM WRAPPED PEERCOIN
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getNetworks } from "@/Endpoints.js";
import Modal from "@/components/Modal.vue";
import BaseWrapper from "@/components/BaseWrapper.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

export default {
  extends: BaseWrapper,

  props: {
    propsaccounts: Array,
    onBurnTokens: Function,
  },

  data() {
    return {
      erc20Address: "",
      unwrapstatus: "",
      callingunwrap: false,
    };
  },

  async mounted() {
    this.unwrapstatus = "";
    this.requestId = this.newId();
    this.networks = getNetworks();

    if (!!this.$store.state.network) {
      this.network = this.$store.state.network;
    }

    if (Array.isArray(this.propsaccounts) && this.propsaccounts.length > 0) {
      this.accounts = this.propsaccounts;
    } else {
      this.accounts = await this.getAccounts();
    }

    if (Array.isArray(this.accounts) && this.accounts.length > 0) {
      this.destinationETHAddress = this.accounts[0];
    }
  },

  computed: {
    header() {
      return "Unwrap Peercoin";
    },

    selectedNetworkDescription() {
      const nw = this.$store.state.network;
      if (!!nw && this.networks.length > 0) {
        const ne = this.networks.find((n) => n.key === nw);
        if (!!ne) {
          return ne.description;
        }
      }
      return "";
    },

    aboveMinAmount() {
      return this.validAmount && !this.minAmountNotExceeded;
    },

    validForm() {
      return (
        this.validAmount &&
        this.validPPCAddress &&
        !!this.network &&
        !this.minAmountNotExceeded
      );
    },
  },

  methods: {
    async onModalConfirm() {
      if (!this.comfirmedProceedMetaMask) {
        this.popupModal = false;
        this.comfirmedProceedMetaMask = true;
        if (!this.onBurnTokens) return;

        this.unwrapstatus = "Burning tokens on MetaMask";
        try {
          await this.onBurnTokens({
            session: this.session,
            destinationPPCAddress: this.destinationPPCAddress,
            amount: this.amount,
          });
        } finally {
          this.unwrapstatus = "";
          this.callingunwrap = false;
        }
      }
    },

    enableMetaMaskConfirmationModal() {
      this.popupModal = true;
    },

    onModalClose() {
      this.popupModal = false;
      this.callingunwrap = false;
    },

    async unwrap() {
      if (!this.validForm || !this.onBurnTokens) return;

      this.callingunwrap = true;
      this.session = {
        amount: parseFloat(this.amount),
        network: this.network,
        ERC20Address: this.destinationETHAddress,
      };
      // show popup, then burn tokens:
      this.enableMetaMaskConfirmationModal();
    },
  },

  components: {
    Modal,
    LoadingOverlay,
  },
};
</script>

<style lang="scss" scoped>
.accounttext {
  font-size: 63%;
}
.accounttext-lg {
  font-size: 100%;
}
.moverightpadding {
  padding-left: 20px;
}
.moveleftpadding {
  padding-right: 20px;
}

.foxy-down {
  position: relative;
  top: 23px;
}
.foxy-down-lg {
  position: relative;

  top: 28px;
}
.moveup {
  position: relative;
  top: -19px;
}
</style>
