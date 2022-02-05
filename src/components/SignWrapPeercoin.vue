<template>
  <div class="col-xs-12 body-mid py-3 px-5">
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

    <input
      id="witnesstoken"
      class="form-control wrapinput"
      type="text"
      v-model="witnessToken"
    />
    <div class="wrapinput-label-container text-start">
      <label for="witnesstoken" class="form-label wrapinput-label "
        >WITNESS TOKEN</label
      >
    </div>

    <input
      id="sessionamount"
      class="form-control wrapinput"
      :class="{ invalid: !validAmount }"
      type="text"
      v-model="confirmAmount"
      @keypress="onlyForCurrency"
    />
    <div class="wrapinput-label-container text-start">
      <label for="sessionamount" class="form-label wrapinput-label "
        >CONFIRM AMOUNT</label
      >
    </div>

    <div class="row">
      <div class="col-xs-12 mt-3" v-show="validForm">
        <button
          type="button"
          class="btn btn-outline-success"
          @click="sign"
          :disabled="!validForm || isSigning"
        >
          SIGN WRAP PEERCOIN
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import ethereumjsabi from "ethereumjs-abi";
import axios from "axios";

import {
  getNetworks,
  getContractAddress,
  getSignAccounts,
} from "@/Endpoints.js";
import ABI from "@/abi/erc20.json";
import BaseWrapper from "@/components/BaseWrapper.vue";

export default {
  extends: BaseWrapper,

  props: {
    propsessionid: String,
  },

  data() {
    return {
      testing: false, // restore this before commit
      witnessToken: "",
      confirmAmount: null,
      isSigning: false,
    };
  },

  async mounted() {
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

    if (!getSignAccounts().includes(this.destinationETHAddress)) {
      if (!this.testing)
        this.gotoHome(
          "Not available for account " + this.destinationETHAddress
        );
    }

    if (!!this.propsessionid) {
      this.session._id = this.propsessionid;
      await this.getSession(this.session._id);
    }
  },

  computed: {
    header() {
      return "Sign Wrap Peercoin13555";
    },

    validAmount() {
      if (!this.confirmAmount) return false;

      const regex = /^\d{0,9}(\.\d{0,6})?$/gm;

      if (!regex.test(this.confirmAmount)) return false;

      let n = parseFloat(this.confirmAmount);

      return typeof n == "number" && !isNaN(n) && isFinite(n) && n > 0;
    },

    validForm() {
      return (
        !!this.witnessToken &&
        !!this.session &&
        !!this.session.ERC20Address &&
        !!this.session.amount &&
        !!this.session.wrapPPCAddress &&
        !!this.destinationETHAddress
      );
    },
  },

  methods: {
    async getSession(id) {
      if (!id) return;

      try {
        const res = await axios.get(this.endpoints(id).session);
        if (!!res && !!res.data && !!res.data.data) {
          this.session = res.data.data;
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

    async sign() {
      if (this.isSigning) return;
      this.isSigning = true;
      if (!this.web3) this.web3 = new Web3(ethereum);

      const contractAddress = getContractAddress(this.session.network);
      const contract = new this.web3.eth.Contract(ABI, contractAddress, {
        from: this.session.ERC20Address,
      });
      const decimals = await contract.methods.decimals().call();

      const hash =
        "0x" +
        ethereumjsabi
          .soliditySHA3(
            ["address", "uint256", "string", "address"],
            [
              this.session.ERC20Address,
              this.session.amount * 10 ** decimals,
              this.session.wrapPPCAddress,
              this.destinationETHAddress,
            ]
          )
          .toString("hex");

      const signature = await this.web3.eth.personal.sign(
        hash,
        this.destinationETHAddress
      );

      let signBackend = false;
      try {
        let response = await axios.post(
          this.endpoints(this.session._id).sign,
          null,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
              token: this.witnessToken,
            },
            params: {
              Address: this.destinationETHAddress,
              Signature: signature,
              Amount: this.confirmAmount,
            },
          }
        );
        this.session = response.data.data;

        signBackend = !!response && !response.error;

        if (signBackend) {
          this.gotoHome(response.data.message);
        } else {
          this.eventBus.emit("add-toastr", {
            text: response.data.message,
            type: signBackend ? "success" : "error",
          });
        }
      } catch (e) {
        console.log(e);
        this.eventBus.emit("add-toastr", {
          text: "Unable to wrap",
          type: "error",
        });
      }
      this.isSigning = false;
    },
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
