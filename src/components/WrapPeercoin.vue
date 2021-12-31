<template>
  <div class="col-xs-12 body-mid py-3">
    <loading-overlay :loading="!!claimtokenStatus" :text="claimtokenStatus" />
    <modal
      v-if="popupModal"
      @modalconfirm="onModalConfirm"
      @modalclose="onModalClose"
      body="Proceed with MetaMask?"
    ></modal>
    <countdown v-if="showProgressbar" :status="0.01 * countDown"></countdown>

    <div class="wrap-container-heading">{{ header }}</div>

    <div class="row mb-2">
      <div class="col-xs-12 col-md-6">
        <p>Smart contract platform</p>
      </div>

      <div class="col-xs-12 col-md-6">
        <select
          :class="{ 'row-input-field': true, invalid: !network }"
          v-model="network"
          :disabled="true"
        >
          <option
            v-for="item in activeNetworks"
            :value="item.key"
            :key="item.key"
          >
            {{ item.description }}
          </option>
        </select>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-md-6">
        <p>Amount</p>
      </div>
      <div class="col-xs-12 col-md-6">
        <input
          :disabled="!!session._id"
          type="text"
          :class="{ 'row-input-field': true, invalid: !validAmount }"
          v-model="amount"
          @keypress="onlyForCurrency"
        />
        <p v-if="minAmountNotExceeded" class="text-danger text-end fs-6">
          Minimum amount is set at {{ minAmount }}
        </p>
      </div>
    </div>

    <div class="row my-3">
      <div class="col-xs-12 col-md-8 offset-md-4">
        <div class="d-grid gap-2 d-md-block text-end">
          <button class="btn btn-outline-primary btn-sm foxy" type="button">
            <span class="btn-label">
              <img
                alt="MetaMask"
                height="25"
                src="../assets/metamask-fox.svg"/></span
            >{{ destinationETHAddress }}
          </button>
        </div>
      </div>
    </div>

    <div class="row" v-if="!!session.wrapPPCAddress">
      <div class="col-xs-12 col-md-6 py-3">
        <p>Peercoin deposit address</p>
      </div>
      <div class="col-xs-12 col-md-6">
        <div class="row justify-content-center mt-2 pt-2">
          <div class="col-xs-7 col-sm-5 col-md-7 text-center">
            <vue-q-r-code-component
              v-if="!!URIencodeWrapPPCAddress"
              :size="250"
              :text="URIencodeWrapPPCAddress"
            />
          </div>
        </div>

        <div class="row mt-2">
          <button
            class="btn btn-outline-primary btn-sm copyaddress my-1 px-3"
            type="button"
            @click="copyToClipboard"
          >
            <span class="btn-label">
              <font-awesome-icon
                :icon="['far', 'copy']"
                size="1x"
                :style="{ color: '#a04612', 'margin-right': '4px' }"/></span
            >{{ session.wrapPPCAddress }}
          </button>

          <div
            class="uri-wrap-ppc-address"
            v-html="URIencodeWrapPPCAddressLink"
          ></div>
        </div>
      </div>
    </div>

    <div
      class="row"
      v-if="
        !!session.wrapPPCAddress &&
          !!session.confirmations &&
          session.confirmations.required > 0
      "
    >
      <div class="col-xs-12 col-md-6">
        <p>Confirmations</p>
      </div>
      <div class="col-xs-12 col-md-6">
        <div class="progress mt-2 custprogress">
          <div
            class="
              progress-bar progress-bar-striped
              bg-success
              progress-bar-animated
            "
            role="progressbar"
            :style="styleConfirmations"
            aria-valuenow="confirmationCurrent"
            aria-valuemin="0"
            aria-valuemax="confirmationMax"
          ></div>
        </div>
      </div>
    </div>

    <div class="row" v-if="!!session.wrapPPCAddress">
      <div class="col-xs-12 col-md-6">
        <p>Witnesses signed</p>
      </div>
      <div class="col-xs-12 col-md-6">
        <div class="progress mt-2 custprogress">
          <div
            class="
              progress-bar progress-bar-striped
              bg-success
              progress-bar-animated
            "
            role="progressbar"
            :style="styleVerified"
            aria-valuenow="witnessesVerified"
            aria-valuemin="0"
            aria-valuemax="3"
          ></div>
        </div>
      </div>
    </div>

    <div class="row" v-if="!session._id">
      <div class="col-xs-12 mt-3">
        <button
          type="button"
          :class="{ btn: true, 'btn-success': true }"
          @click="wrap"
          :disabled="!validForm"
        >
          Wrap Peercoin
        </button>
      </div>
    </div>

    <expiration-warning :session="session" />
  </div>
</template>

<script>
import Web3 from "web3";
import axios from "axios";
import { setIntervalAsync } from "set-interval-async/fixed";
import { clearIntervalAsync } from "set-interval-async";
import VueQRCodeComponent from "vue-qrcode-component";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import Countdown from "@/components/Countdown.vue";
import { getNetworks, getContractAddress } from "@/Endpoints.js";
import Modal from "@/components/Modal.vue";
import ABI from "@/abi/erc20.json";
import BaseWrapper from "@/components/BaseWrapper.vue";
import ExpirationWarning from "@/components/ExpirationWarning.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  extends: BaseWrapper,

  props: {
    propsessionid: String,
  },

  data() {
    return {
      countDown: 100,
      countDownHandle: null,
      claimtokenStatus: "",
      stepStatus: 1,
    };
  },

  async mounted() {
    this.claimtokenStatus = "";
    this.requestId = this.newId();
    this.networks = getNetworks();

    if (!!this.$store.state.network) {
      this.network = this.$store.state.network;
    }

    this.resetSession();

    if (Array.isArray(this.propsaccounts) && this.propsaccounts.length > 0) {
      this.accounts = this.propsaccounts;
    } else {
      this.accounts = await this.getAccounts();
    }
    if (Array.isArray(this.accounts) && this.accounts.length > 0) {
      this.destinationETHAddress = this.accounts[0];
    }

    if (!!this.propsessionid) {
      this.session._id = this.propsessionid;
      await this.getSession(this.session._id);
      this.network = this.session.network;
      this.amount = this.session.amount;
    }

    // todo replace this with connect() + disconnect():

    if (!!this.countDownHandle) {
      await clearIntervalAsync(this.countDownHandle);
      this.countDownHandle = setIntervalAsync(this.onCountDown, 350);
    } else {
      this.countDownHandle = setIntervalAsync(this.onCountDown, 350);
    }
  },

  async unmounted() {
    if (!!this.countDownHandle) {
      await clearIntervalAsync(this.countDownHandle);
    }
  },

  computed: {
    header() {
      return "Wrap Peercoin";
    },

    confirmationMax() {
      try {
        if (!this.session || !this.session.confirmations) return 3;
        let max = this.session.confirmations.required;

        if (typeof max === "string" || max instanceof String)
          return parseInt(max);
        else return max;
      } catch (err) {
        return 3;
      }
    },

    confirmationCurrent() {
      try {
        if (!this.session || !this.session.confirmations) return 0;
        let cur = this.session.confirmations.current;

        if (typeof cur === "string" || cur instanceof String)
          return parseInt(cur);
        else return cur;
      } catch (err) {
        return 0;
      }
    },

    styleConfirmations() {
      return {
        width:
          Math.ceil(
            100.0 * this.confirmationCurrent * (1.0 / this.confirmationMax)
          ) + "%",
      };
    },

    styleVerified() {
      return {
        width: Math.ceil(100.0 * this.witnessesVerified * (1.0 / 3.0)) + "%",
      };
    },

    showProgressbar() {
      if (!this.session || !this.session._id) return false;
      if (!!this.session && this.session.claimed) return false;

      const ready2Proceed =
        !!this.session &&
        !!this.session._id &&
        !!this.session.wrapPPCAddress &&
        !!this.session.witnessASignature &&
        !!this.session.witnessBSignature &&
        !!this.session.witnessCSignature &&
        this.session.depositedAmount >= this.session.amount;

      return !ready2Proceed && !this.comfirmedProceedMetaMask;
    },

    URIencodeWrapPPCAddress() {
      const scheme = "peercoin";
      const amount = this.session.amount;
      const address = this.session.wrapPPCAddress;

      if (!!amount && !!address) {
        const today = new Date();

        let strDate = "Y-m-d"
          .replace("Y", today.getFullYear())
          .replace("m", today.getMonth() + 1)
          .replace("d", today.getDate());
        return (
          scheme +
          ":" +
          address +
          "?amount=" +
          amount +
          "&message=wrapmeister:" +
          encodeURI(strDate)
        );
      }

      return "";
    },

    URIencodeWrapPPCAddressLink() {
      if (!!this.URIencodeWrapPPCAddress) {
        return (
          "<a href='" +
          this.URIencodeWrapPPCAddress +
          '\' target="_blank" rel="nofollow" >' +
          this.URIencodeWrapPPCAddress +
          "</a>"
        );
      }
      return "";
    },

    validForm() {
      return (
        this.validAmount &&
        !!this.network &&
        !!this.destinationETHAddress &&
        !this.minAmountNotExceeded
      );
    },

    witnessesVerified() {
      let verified = 0;
      if (!!this.session && !!this.session.wrapPPCAddress) {
        if (!!this.session.witnessASignature) verified++;
        if (!!this.session.witnessBSignature) verified++;
        if (!!this.session.witnessCSignature) verified++;
      }
      return verified;
    },
  },

  methods: {
    async onCountDown() {
      if (this.showProgressbar) {
        this.countDown = this.countDown - 1;
        if (this.countDown < 0.001) {
          await this.getSession(this.session._id);
          this.countDown = 100;
        }
      }
    },

    async getSession(id) {
      if (!id) return;

      try {
        const res = await axios.get(this.endpoints(id).session);

        if (!!res && !!res.data && !!res.data.data) {
          this.session = res.data.data;
          //console.log(this.session);
          this.stepStatus = this.getWrapStatus();
          this.$emit("wrap-step-current", this.stepStatus);
          if (
            !!this.session.wrapTxid &&
            !!this.session.witnessASignature &&
            !!this.session.witnessBSignature &&
            !!this.session.witnessCSignature
          ) {
            this.popupModal = true;
          }
        }
      } catch (err) {
        if (
          !!err.response &&
          !!err.response.data &&
          !!err.response.data.message
        )
          console.warn(err.response.data.message);

        this.eventBus.emit("add-toastr", {
          text: `Unable to retrieve session ${id}`,
          type: "error",
        });
      }
    },

    getWrapStatus() {
      let status = 1;
      if (!!this.session && !!this.session._id) {
        if (!!this.session.wrapPPCAddress) {
          status = 2;
        }

        if (
          this.session.amount > 0 &&
          this.session.depositedAmount >= this.session.amount
        ) {
          status = 3;
        }

        if (
          status === 3 &&
          !!this.session.confirmations &&
          this.session.confirmations.required > 0 &&
          this.confirmationCurrent >= this.confirmationMax
        ) {
          status = 4;
        }

        if (
          status < 5 &&
          !!this.session.wrapTxid &&
          !!this.session.witnessASignature &&
          !!this.session.witnessBSignature &&
          !!this.session.witnessCSignature
        ) {
          status = 5;
        }

        if (this.session.claimed) status = 6;
      }
      return status;
    },

    async onModalConfirm() {
      console.log(this.session);
      if (
        !this.comfirmedProceedMetaMask &&
        !!this.session.wrapPPCAddress &&
        !!this.session.witnessASignature &&
        !!this.session.witnessBSignature &&
        !!this.session.witnessCSignature
      ) {
        this.popupModal = false;
        this.comfirmedProceedMetaMask = true;

        await this.claimTokens();
      }
    },

    async wrap() {
      let nb = parseFloat(this.amount);
      const data = {
        amount: nb,
        destinationAddress: this.destinationETHAddress,
      };

      const config = {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
          network: this.network,
          "Idempotency-Key": this.requestId,
        },
        params: data,
      };

      try {
        let response = await axios.post(this.endpoints().wrap, null, config);
        this.session = response.data.data;

        const success = response && !response.error;

        this.eventBus.emit("add-toastr", {
          text: response.data.message,
          type: success ? "success" : "error",
        });
      } catch (err) {
        if (
          !!err.response &&
          !!err.response.data &&
          !!err.response.data.message
        )
          console.warn(err.response.data.message);

        this.eventBus.emit("add-toastr", {
          text: "Unable to wrap",
          type: "error",
        });
      }
    },

    async claimTokens() {
      this.accounts = await this.getAccounts();
      if (
        !this.accounts ||
        this.accounts.length < 1 ||
        !this.session ||
        !this.session.witnessASignature ||
        !this.session.witnessBSignature ||
        !this.session.witnessCSignature ||
        !this.session.ERC20Address ||
        !this.session.network
      ) {
        return;
      }

      const contractAddress = getContractAddress(this.session.network);
      if (!contractAddress) {
        return console.error(
          "No contract address found for network: " + this.session.network
        );
      }
      this.claimtokenStatus = "Waiting for mint...";
      try {
        if (!this.web3) this.web3 = new Web3(ethereum);

        const contract = new this.web3.eth.Contract(ABI, contractAddress, {
          from: this.session.ERC20Address,
        });

        const decimals = await contract.methods.decimals().call();

        const _ = await contract.methods
          .claimTokens(
            this.session.amount * 10 ** decimals,
            this.session.wrapPPCAddress,
            this.session.ERC20Address,
            this.session.witnessAAddress,
            this.session.witnessASignature,
            this.session.witnessBAddress,
            this.session.witnessBSignature,
            this.session.witnessCAddress,
            this.session.witnessCSignature
          )
          .send();

        this.resetSession();
        this.claimtokenStatus = "";
        this.gotoHome("Successfully wrapped " + this.amount + "PPC to WPPC");
      } catch (e) {
        console.log(e);
        this.claimtokenStatus = "";
      }
    },

    copyToClipboard() {
      navigator.clipboard.writeText(this.session.wrapPPCAddress);
      this.eventBus.emit("add-toastr", {
        text: this.session.wrapPPCAddress + " copied to clipboard",
        type: "success",
      });
    },
  },

  components: {
    VueQRCodeComponent,
    Countdown,
    Modal,
    ExpirationWarning,
    FontAwesomeIcon,
    LoadingOverlay,
  },
};
</script>

<style lang="scss" scoped>
.custprogress {
  background-color: #c7c7c7;
  height: 10px;
}
.uri-wrap-ppc-address {
  font-size: 75%;
}
.copyaddress {
  font-size: 75%;
  color: #221b17;
  border-color: #221b17;
  &:hover {
    color: #8f3e10;
    background-color: transparent;
    border-color: #8f3e10;
  }
}
</style>
