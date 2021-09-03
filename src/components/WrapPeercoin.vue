<template>
  <div class="col-xs-12 body-mid py-3">
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
        <p>Bridge from Peercoin to?</p>
      </div>

      <div class="col-xs-12 col-md-6">
        <select
          :class="{ 'row-input-field': true, invalid: !network }"
          v-model="network"
          :disabled="!!session._id"
        >
          <option v-for="item in networks" :value="item.key" :key="item.key">
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
          Minimum amount is set at {{minAmount}}
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
        <div class="row mt-2 pt-2">
          <vue-q-r-code-component
            v-if="!!URIencodeWrapPPCAddress"
            :size="250"
            :text="URIencodeWrapPPCAddress"
          />
        </div>
        <div class="row">
          <small>{{ session.wrapPPCAddress }}</small>
          <small v-html="URIencodeWrapPPCAddressLink"></small>
        </div>
      </div>
    </div>

    <div class="row" v-if="!session._id">
      <div class="col-xs-12 mt-3">
        <m-button type="success" @mbclick="wrap" :disabled="!validForm"
          >Wrap Peercoin</m-button
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
import MButton from "@/components/Button.vue";
import Countdown from "@/components/Countdown.vue";
import { getNetworks, getContractAddress } from "@/Endpoints.js";
import Modal from "@/components/Modal.vue";
import ABI from "@/abi/erc20.json";
import BaseWrapper from "@/components/BaseWrapper.vue";

export default {
  extends: BaseWrapper,

  props: {
    propsessionid: String,
  },

  data() {
    return {
      countDown: 100,
      countDownHandle: null,
    };
  },

  async mounted() {
    this.requestId = this.newId();
    this.networks = getNetworks().filter((nw) => nw.active);
    if (!!this.networks && this.networks.length > 0) {
      this.network = this.networks[0].key;
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
    clearInterval(this.countDownHandle);
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

    showProgressbar() {
      return (
        !!this.session &&
        !!this.session._id &&
        this.session.wrapPPCAddress &&
        !this.session.wrapSignature &&
        !this.comfirmedProceedMetaMask
      );
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

          if (
            !!this.session.wrapTxid &&
            !!this.session.wrapSignature &&
            !!this.session.wrapNonce
          ) {
            this.popupModal = true;
          }
        }
      } catch (error) {
        console.warn(error);
        this.eventBus.emit("add-toastr", {
          text: `Unable to retrieve session ${id}`,
          type: "error",
        });
      }
    },

    async onModalConfirm() {
      if (
        !this.comfirmedProceedMetaMask &&
        !!this.session.wrapPPCAddress &&
        !!this.session.wrapSignature
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
      } catch (e) {
        console.log(e);
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
        !this.session.wrapSignature ||
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

      try {
        if (!this.web3) this.web3 = new Web3(ethereum);

        const contract = new this.web3.eth.Contract(ABI, contractAddress, {
          from: this.session.ERC20Address,
        });

        const signature = JSON.parse(this.session.wrapSignature);
        const decimals = await contract.methods.decimals().call();

        const result = await contract.methods
          .claimTokens(
            this.session.amount * 10 ** decimals,
            this.session.wrapNonce,
            this.session.ERC20Address,
            signature.v,
            signature.r,
            signature.s
          )
          .send();

        await axios.post(this.endpoints().confirmMint, null, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            network: this.network,
          },
          params: {
            id: this.session._id,
          },
        });

        this.resetSession();
        this.gotoHome("Successfully wrapped " + this.amount + "PPC to WPPC");
      } catch (e) {
        console.log(e);
      }
    },
  },

  components: {
    VueQRCodeComponent,
    MButton,
    Countdown,
    Modal,
  },
};
</script>
