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

    <div class="row" v-if="1 === 1">
      <div class="col-xs-12 mt-3">
        <m-button type="success" @mbclick="sign" :disabled="!validForm"
          >Sign bla Wrap Peercoin</m-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import axios from "axios";
import VueQRCodeComponent from "vue-qrcode-component";
import MButton from "@/components/Button.vue";
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
      witnessToken: ""
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

    validForm() {//todo
      return this.witnessToken !== "";
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
      } catch (error) {
        console.warn(error);
        this.eventBus.emit("add-toastr", {
          text: `Unable to retrieve session ${id}`,
          type: "error",
        });
      }
    },

    async sign(){
      if (!this.web3) this.web3 = new Web3(ethereum);

      const contractAddress = getContractAddress(this.session.network);
      const contract = new this.web3.eth.Contract(ABI, contractAddress, {
        from: this.session.ERC20Address,
      });
      const decimals = await contract.methods.decimals().call();

      var hash = "0x" + require('ethereumjs-abi').soliditySHA3(
        ["address", "uint256", "string", "address"],
        [this.session.ERC20Address, this.session.amount * 10 ** decimals, this.session.wrapPPCAddress, this.destinationETHAddress]
      ).toString("hex");

      const signature = await this.web3.eth.personal.sign(hash, this.destinationETHAddress)

      try {
        let response = await axios.post(this.endpoints(this.session._id).sign, null, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            token: this.witnessToken
          },
          params: {
            Address: this.destinationETHAddress,
            Signature: signature
          },
        });
        this.session = response.data.data;

        this.eventBus.emit("add-toastr", {
          text: response.data.message,
          type: response && !response.error ? "success" : "error",
        });
      } catch (e) {
        console.log(e);
        this.eventBus.emit("add-toastr", {
          text: "Unable to wrap",
          type: "error",
        });
      }
    },
  },

  components: {
    VueQRCodeComponent,
    MButton,
  },
};
</script>

<style lang="scss" scoped>
.custprogress {
  background-color: #c7c7c7;
  height: 10px;
}
</style>
