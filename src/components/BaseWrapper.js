import { wrapEndpoints } from "@/Endpoints.js";
import { validate } from "wallet-address-validator";
import Web3 from "web3";

export default {
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
        wrapSignature: null,
        wrapTxid: null,
        wrapNonce: null,
        wrapPPCAddress: null,
        unwrapSignature: null,
        unwrapTxid: null,
        unwrapNonce: false,
        unwrapPPCAddress: null,
        ERC20Address: null,
      },
    };
  },

  computed: {
    validETHAddress() {
      if (!!this.network && this.network.indexOf("TEST") != 0) {
        return validate(this.destinationETHAddress, "ETH", "both");
      }

      return validate(this.destinationETHAddress, "ETH");
    },

    validPPCAddress() {
      if (!!this.destinationPPCAddress) {
        if (!!this.network && this.network.indexOf("TEST") != 0) {
          return validate(this.destinationPPCAddress, "PPC", "both");
        }

        return validate(this.destinationPPCAddress, "PPC");
      }

      return false;
    },

    validAmount() {
      if (!this.amount) return false;

      const regex = /^\d{0,9}(\.\d{0,6})?$/gm;

      if (!regex.test(this.amount)) return false;

      let n = parseFloat(this.amount);

      return typeof n == "number" && !isNaN(n) && isFinite(n) && n > 0;
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
        wrapSignature: null,
        wrapTxid: null,
        wrapNonce: null,
        wrapPPCAddress: null,
        unwrapSignature: null,
        unwrapTxid: null,
        unwrapNonce: false,
        unwrapPPCAddress: null,
        ERC20Address: null,
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
  },
};
