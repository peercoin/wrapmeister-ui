<template>
  <div class="col-xs-12 py-3">
    <loading-overlay :loading="!!unwrapstatus" :text="unwrapstatus" />
    <modal
      v-if="popupModal"
      @modalconfirm="onModalConfirm"
      @modalclose="onModalClose"
      body="Proceed with MetaMask?"
    ></modal>

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
      :class="{ invalid: !validAmount }"
      type="text"
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

    <div class="d-sm-none text-start moveup">
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
    <div class="d-none d-sm-block text-start moveup">
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
import Web3 from "web3";
import axios from "axios";

import { getNetworks, getContractAddress } from "@/Endpoints.js";
import Modal from "@/components/Modal.vue";
import ABI from "@/abi/erc20.json";
import BaseWrapper from "@/components/BaseWrapper.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

export default {
  extends: BaseWrapper,

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
        await this.burnTokens();
      }
    },

    enableMetaMaskConfirmationModal() {
      this.popupModal = true;
    },

    async burnTokens() {
      this.unwrapstatus = "Burning tokens on MetaMask";
      this.accounts = await this.getAccounts();

      if (!this.accounts || this.accounts.length < 1) {
        return;
      }

      const contractAddress = getContractAddress(this.session.network);
      if (!contractAddress) {
        return console.error(
          "No contract address found for network: " + this.session.network
        );
      }

      try {
        if (!this.web3) this.web3 = new Web3(ethereum);

        const contract = new this.web3.eth.Contract(ABI, contractAddress, {
          from: this.session.ERC20Address,
        });

        const decimals = await contract.methods.decimals().call();

        const result = await contract.methods
          .burnTokens(
            this.session.amount * 10 ** decimals,
            this.destinationPPCAddress
          )
          .send();

        this.unwrapstatus = "";
        this.resetSession();
        this.gotoHome(
          "Successfully burned " +
            this.amount +
            " wPPC. Please be patient as your Peercoins are unwrapped. This process can take up to 12 hours."
        );
      } catch (error) {
        this.unwrapstatus = "";
      }
    },

    async unwrap() {
      try {
        this.callingunwrap = true;

        const response = await axios.post(this.endpoints().unwrap, null, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            network: this.network,
            "Idempotency-Key": this.requestId,
          },
          params: {
            amount: this.amount,
            PPCAddress: this.destinationPPCAddress,
            ERC20Address: this.destinationETHAddress,
          },
        });

        if (
          !!response &&
          !!response &&
          !!response.data &&
          !!response.data.data //&& !!response.data.data._id
        ) {
          const success =
            !!response && !!response.data && !!response.data.message;

          this.eventBus.emit("add-toastr", {
            text: success ? response.data.message : `Unable to unwrap`,
            type: success ? "success" : "error",
          });

          this.session = response.data.data;
          // show popup, then burn tokens:
          this.enableMetaMaskConfirmationModal();
        }
      } catch (err) {
        if (
          !!err.response &&
          !!err.response.data &&
          !!err.response.data.message
        )
          console.warn(err.response.data.message);

        this.eventBus.emit("add-toastr", {
          text: `Unable to unwrap`,
          type: "error",
        });
      }
    },
  },

  components: {
    Modal,
    LoadingOverlay,
  },
};
</script>

<style lang="scss" scoped>
.moverightpadding {
  padding-left: 20px;
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
