<template>
  <div class="col-xs-12 body-mid py-3">
    <div class="wrap-container-heading">{{ header }}</div>

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

    <div class="row my-3">
      <div class="col-xs-12 col-md-6">
        <p>Witness token</p>
      </div>
      <div class="col-xs-12 col-md-6">
        <input
          type="text"
          :class="{ 'row-input-field': true }"
          v-model="witnessToken"
        />
      </div>
    </div>

    <div class="row my-3">
      <div class="col-xs-12 col-md-6">
        <p>Confirm amount</p>
      </div>
      <div class="col-xs-12 col-md-6">
        <input
          type="text"
          :class="{ 'row-input-field': true }"
          v-model="confirmAmount"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 mt-3">
        <button
          type="button"
          :class="{ btn: true, 'btn-success': true }"
          @click="sign"
          :disabled="!validForm || isSigning"
        >
          Sign Wrap Peercoin
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
      this.gotoHome("Not available for account " + this.destinationETHAddress);
    }

    if (!!this.propsessionid) {
      this.session._id = this.propsessionid;
      await this.getSession(this.session._id);
    }
  },

  computed: {
    header() {
      return "Sign Wrap Peercoin";
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
