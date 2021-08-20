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
        ERC20Address: null
      }
    };
  },

  computed: {
    header() {
      return "Bridge Peercoin";
    },

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
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
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
        ERC20Address: null
      };
    },

    gotoHome(message) {
      this.eventBus.emit("add-toastr", {
        text: message,
        type: "success",
      });

      this.eventBus.emit("goto-home", {});
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
    }
  }
};
