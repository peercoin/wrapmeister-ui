<template>
  <div class="col-xs-12 py-3 mb-3">
    <countdown v-if="showProgressbar" :status="0.01 * countDown"></countdown>
    <loading-overlay :loading="!!claimtokenStatus" :text="claimtokenStatus" />
    <modal
      v-if="popupModal"
      @modalconfirm="onModalConfirm"
      @modalclose="onModalClose"
      confirmtext="CONTINUE"
      body="Proceed to MetaMask extension to mint your wPPC tokens."
    ></modal>

    <expiration-warning :session="session" />

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
      type="text"
      v-model="amount"
      :readonly="!!session && !!session._id"
    />
    <div class="wrapinput-label-container text-start">
      <label for="sessionamount" class="form-label wrapinput-label "
        >AMOUNT</label
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
    //    propsaccounts: Array,
    propsessionid: String,
    propnetwork: String,
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
    //  debugger;
    this.claimtokenStatus = "";
    this.requestId = this.newId();
    this.networks = getNetworks();

    if (!!this.$store.state.network) {
      this.network = this.$store.state.network;
    }

    this.resetSession();
    // console.warn(this.propsaccounts)
    //     if (Array.isArray(this.propsaccounts) && this.propsaccounts.length > 0) {
    //       this.accounts = this.propsaccounts;
    //     } else {
    //       this.accounts = await this.getAccounts();
    //     }

    this.accounts = this.selectedAccount;

    if (Array.isArray(this.accounts) && this.accounts.length > 0) {
      this.destinationETHAddress = this.accounts[0];
      console.log("ationETHAddress" + this.destinationETHAddress);
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

    //returns a array with selected account
    selectedAccount() {
      if (!!this.$store.state.account) {
        return [this.$store.state.account];
      }
      return [];
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

    URIencodeWrapPPCAddressShort() {
      const scheme = "peercoin";
      const amount = this.session.amount;
      const address = this.session.wrapPPCAddress;

      if (!!amount && !!address) {
        return scheme + ":" + address;
      }

      return "";
    },

    URIencodeWrapPPCAddressLink() {
      if (!!this.URIencodeWrapPPCAddress) {
        return (
          "<a href='" +
          this.URIencodeWrapPPCAddress +
          '\' target="_blank" rel="nofollow" >' +
          this.URIencodeWrapPPCAddressShort +
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

          //temporary hack fix:
          if (
            !!this.session &&
            !!this.session.confirmations &&
            this.session.confirmations.required === 0
          ) {
            this.session.confirmations.required = 1;
          }

          this.stepStatus = this.getWrapStatus();
          this.$emit("wrap-step-current", this.stepStatus);
          if (
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
.accounttext {
  font-size: 63%;
}
.accounttext-lg {
  font-size: 100%;
}
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
