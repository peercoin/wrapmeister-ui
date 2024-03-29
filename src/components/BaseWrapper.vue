<template></template>

<script>
import { wrapEndpoints, getMinAmount } from "@/Endpoints.js";
import { isValidAddress } from "../crypto/peercoin-address-validation.js";
import Web3 from "web3";

export default {
  props: {
    propsaccounts: Array,
  },

  data() {
    return {
      requestId: null,
      endpoints: wrapEndpoints,
      web3: null,
      popupModal: false,
      comfirmedProceedMetaMask: false,
      accounts: [],
      amount: "",
      destinationETHAddress: "",
      destinationPPCAddress: "",
      network: "",
      networks: [],
      websocket: null,
      connectTimer: null,
      reconnectTimer: null,
      retryTimer: null,
      session: {
        _id: null,
        network: null,
        amount: null,
        witnessAAddress: null,
        witnessASignature: null,
        witnessAToken: null,
        witnessBAddress: null,
        witnessBSignature: null,
        witnessBToken: null,
        witnessCAddress: null,
        witnessCSignature: null,
        witnessCToken: null,
        wrapTxid: null,
        wrapNonce: null,
        wrapPPCAddress: null,
        unwrapSignature: null,
        unwrapTxid: null,
        unwrapNonce: false,
        unwrapPPCAddress: null,
        ERC20Address: null,
        claimed: false,
        confirmations: {
          current: 0,
          required: 1,
        },
        expiresAt: 0, //todo verify the fieldname
        depositedAmount: 0,
      },
    };
  },

  computed: {
    validPPCAddress() {
      if (!!this.destinationPPCAddress) {
        if (!!this.network && this.network.indexOf("TEST") != 0) {
          return isValidAddress(this.destinationPPCAddress, "both");
        }

        return isValidAddress(this.destinationPPCAddress, "prod");
      }

      return false;
    },

    minAmount() {
      return getMinAmount();
    },

    validAmount() {
      if (!this.amount) return false;

      const regex = /^\d{0,9}(\.\d{0,6})?$/gm;

      if (!regex.test(this.amount)) return false;

      let n = parseFloat(this.amount);

      return typeof n == "number" && !isNaN(n) && isFinite(n) && n > 0;
    },

    minAmountNotExceeded() {
      if (!this.validAmount) return false;

      let n = parseFloat(this.amount);

      return n < getMinAmount();
    },

    activeNetworks() {
      if (!this.networks) return [];

      return this.networks.filter((nw) => nw.active);
    },
  },

  methods: {
    newId() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },

    resetSession() {
      this.web3 = null;
      this.comfirmedProceedMetaMask = false;
      this.accounts = [];
      this.popupModal = false;
      this.session = {
        _id: null,
        network: null,
        amount: null,
        witnessAAddress: null,
        witnessASignature: null,
        witnessAToken: null,
        witnessBAddress: null,
        witnessBSignature: null,
        witnessBToken: null,
        witnessCAddress: null,
        witnessCSignature: null,
        witnessCToken: null,
        wrapTxid: null,
        wrapNonce: null,
        wrapPPCAddress: null,
        unwrapSignature: null,
        unwrapTxid: null,
        unwrapNonce: false,
        unwrapPPCAddress: null,
        ERC20Address: null,
        claimed: false,
        confirmations: {
          current: 0,
          required: 1,
        },
        expiresAt: 0, //todo verify the fieldname
        depositedAmount: 0,
      };
    },

    gotoHome(message) {
      if (!!message) {
        this.eventBus.emit("add-toastr", {
          text: message,
          type: "success",
        });
      }

      this.eventBus.emit("goto-home", {});
    },

    // call u want a websocket connection()
    connect() {
      if (this.websocket !== null) return;

      if ("WebSocket" in window && !!this.endpoints().websocket) {
        if (this.connectTimer !== null) {
          clearTimeout(this.connectTimer);
        }

        this.connectTimer = setTimeout(() => {
          console.warn("websocket failed");
          this.connectTimer = null;
        }, 5000);

        let websocket = new WebSocket(this.endpoints().websocket);

        websocket.onopen = () => {
          console.log("websocket connected");

          if (this.connectTimer !== null) {
            clearTimeout(this.connectTimer);
            this.connectTimer = null;
          }
        };

        websocket.onmessage = (event) => {
          if (!!event && !!event.data) {
            console.log("WebSocket message received:", event.data);
            this.someActionToOveride(event.data);
          }
        };

        websocket.onclose = (event) => {
          console.log(
            "  websocket closed unexpectedly, reconnecting in 1 second"
          );

          this.resetSocket();
          this.reconnect();
        };

        websocket.onerror = (event) => {
          console.error("Dashboard websocket error: " + event);
        };

        this.websocket = websocket;
      }
    },

    someActionToOveride(jsonStr) {
      //console.log(JSON.parse());
    },

    resetSocket() {
      if (this.connectTimer !== null) clearTimeout(this.connectTimer);

      if (this.reconnectTimer !== null) clearTimeout(this.reconnectTimer);

      if (this.websocket !== null) {
        this.websocket.onopen = null;
        this.websocket.onmessage = null;
        this.websocket.onclose = null;
        this.websocket.onerror = null;

        this.websocket.close();
        this.websocket = null;
      }
    },

    reconnect() {
      if (this.reconnectTimer !== null) clearTimeout(this.reconnectTimer);

      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.connect();
      }, 1000);
    },

    // call in a unmounted()
    disconnect() {
      console.log("WebSocket disconnect");

      this.resetSocket();

      if (this.retryTimer !== null) clearTimeout(this.retryTimer);
    },

    onModalClose() {
      this.popupModal = false;
    },

    async getAccounts() {
      if (window.ethereum) {
        try {
          if (!!this.accounts && this.accounts.length > 0) {
            return this.accounts;
          }

          await ethereum.request({
            method: "eth_requestAccounts",
          });

          this.web3 = new Web3(ethereum);
          return await this.web3.eth.getAccounts();
        } catch (error) {
          console.log(error);
        }
      }

      return [];
    },

    onlyForCurrency($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;

      // only allow number and one dot
      if (
        (keyCode < 48 || keyCode > 57) &&
        (keyCode !== 46 || this.amount.indexOf(".") != -1)
      ) {
        // 46 is dot
        $event.preventDefault();
      }

      // restrict to 6 decimal places
      if (
        this.amount != null &&
        this.amount.indexOf(".") > -1 &&
        this.amount.split(".")[1].length > 5
      ) {
        $event.preventDefault();
      }
    },

    onlyForAddress($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;

      const space = 32;
      if (keyCode === space) {
        $event.preventDefault();
      }
    },
  },
};
</script>

<style lang="scss">
.wrap-container-heading {
  font-weight: bold;
  font-style: italic;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
  font-size: 15px;
  padding-bottom: 3px;
}
.foxy {
  font-size: 70%;
  color: #a04612;
  border-color: #a04612;
  &:hover {
    cursor: default;
    color: #a04612;
    background-color: transparent;
    border-color: #a04612;
  }
}
</style>
