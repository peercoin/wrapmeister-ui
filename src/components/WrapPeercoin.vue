<template>
  <div class="wrap-container">
    <modal
      v-if="popupModal"
      @modalconfirm="onModalConfirm"
      @modalclose="onModalClose"
      body="Proceed with MetaMask?"
    ></modal>
    <countdown v-if="showProgressbar" :status="0.01 * countDown"></countdown>

    <div class="wrap-container-heading">{{ header }}</div>
    <row>
      <column :lg="12" :xl="6">
        <p>Choose network to bridge</p>
      </column>
      <column :lg="12" :xl="6" class="margin-auto">
        <select
          :class="{ 'row-input-field': true, invalid: !network }"
          v-model="network"
          :disabled="!!session._id"
        >
          <option v-for="item in networks" :value="item.key" :key="item.key">
            {{ item.description }}
          </option>
        </select>
      </column>
    </row>

    <row>
      <column :lg="12" :xl="6">
        <p>ERC-20 Address</p>
      </column>
      <column :lg="12" :xl="6" class="margin-auto">
        <input
          :disabled="!!session._id"
          type="text"
          :class="{ 'row-input-field': true, invalid: !validAddress }"
          v-model="destinationAddress"
        />
      </column>
    </row>

    <row>
      <column :lg="12" :xl="6">
        <p>Amount</p>
      </column>
      <column :lg="12" :xl="6" class="margin-auto">
        <input
          :disabled="!!session._id"
          type="text"
          :class="{ 'row-input-field': true, invalid: !validAmount }"
          v-model="amount"
        />
      </column>
    </row>

    <row v-if="!!session.ppcAddress">
      <column :lg="12" :xl="6">
        <p>Peercoin deposit address</p>
      </column>
      <column :lg="12" :xl="6" class="margin-auto">
        <row>
          <vue-q-r-code-component
            class="margin-auto"
            v-if="!!session.ppcAddress && !!session.wrapping"
            :size="250"
            :text="session.ppcAddress"
          />
        </row>
        <row>
          <small class="margin-auto">{{ session.ppcAddress }}</small>
        </row>
      </column>
    </row>

    <row v-if="!session._id">
      <column :lg="12" :xl="12" class="margin-auto m-top-lg">
        <m-button type="success" @mbclick="submitWrap" :disabled="!validForm"
          >Tokenise Peercoin</m-button
        >
      </column>
    </row>
  </div>
</template>

<script>
import axios from "axios";
import { setIntervalAsync } from "set-interval-async/fixed";
import { clearIntervalAsync } from "set-interval-async";
import VueQRCodeComponent from "vue-qrcode-component";
import MButton from "@/components/Button.vue";
import Countdown from "@/components/Countdown.vue";
import { wrapEndpoints, getNetworks, getContractAddress } from "@/Endpoints.js";
import { validate } from "wallet-address-validator";
import Modal from "@/components/Modal.vue";
import Web3 from "web3";
import ABI from "@/abi/erc20.json";

export default {
  data() {
    return {
      requestId: null,
      countDown: 100,
      countDownHandle: null,
      endpoints: wrapEndpoints,
      session: {
        _id: null,
        network: null,
        wrapping: true,
        amount: null,
        signed: false,
        signature: null,
        nonce: null,
        erc20Address: null,
        ppcAddress: null,
        completed: false,
        erc20TransactionHash: null,
        ppcTransactionHash: null,
      },
      comfirmedProceedMetaMask: false,
      amount: "",
      destinationAddress: "",
      network: "",
      endpoints: wrapEndpoints,
      networks: [],
      accounts: [],
      web3: null,

      popupModal: false,
      wrapClaimtokensTransactionHash: "",
      countTrigger: 0,
    };
  },

  async mounted() {
    this.requestId = this.newId();
    this.networks = getNetworks().filter((nw) => nw.active);
    this.resetSession();
    clearInterval(this.countDownHandle);
    if (!!this.countDownHandle) {
      (async () => {
        await clearIntervalAsync(this.countDownHandle);
        this.countDownHandle = setIntervalAsync(this.onCountDown, 350);
      })();
    } else {
      this.countDownHandle = setIntervalAsync(this.onCountDown, 350);
    }
  },

  async unmounted() {
    if (!!this.countDownHandle) {
      (async () => {
        await clearIntervalAsync(this.countDownHandle);
      })();
    }
  },

  computed: {
    showProgressbar() {
      return (
        !!this.session &&
        !!this.session._id &&
        this.session.wrapping &&
        !this.session.signed &&
        // !this.session.signature &&
        !this.comfirmedProceedMetaMask
      );
    },

    header() {
      return "Bridge Peercoin";
    },

    validAddress() {
      if (!!this.destinationAddress) {
        if (!!this.network && this.network.indexOf("TEST") != 0) {
          return validate(this.destinationAddress, "ETH", "both");
        }
        return validate(this.destinationAddress, "ETH");
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

    validForm() {
      return this.validAmount && this.validAddress && !!this.network;
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

    gotoHome(message) {
      this.eventBus.emit("add-toastr", {
        text: message,
        type: "success",
      });

      this.eventBus.emit("goto-home", {});
    },

    async onCountDown() {
      if (this.showProgressbar) {
        this.countDown = this.countDown - 1;
        if (this.countDown < 0.001) {
          await this.getSession(this.session._id);
          this.countDown = 100;
        }
      }
    },

    async getSession(sessionid) {
      if (!sessionid) return;

      try {
        const res = await axios.get(this.endpoints(sessionid).session);

        if (!!res && !!res.data && !!res.data.data) {
          this.session = res.data.data;

          if (this.session.completed) {
            this.resetSession();
            this.gotoHome(`Session ${sessionid} completed`);
          } else if (this.session.signed) {
            this.popupModal = true;
          }
        }
      } catch (error) {
        console.warn(error);
        this.eventBus.emit("add-toastr", {
          text: `Unable to retrieve session ${sessionid}`,
          type: "error",
        });
      }
    },

    resetSession() {
      this.web3 = null;
      this.comfirmedProceedMetaMask = false;
      this.accounts = [];
      this.wrapClaimtokensTransactionHash = "";
      this.popupModal = false;
      this.session = {
        _id: null,
        network: null,
        wrapping: true,
        amount: null,
        signed: false,
        signature: null,
        nonce: null,
        erc20Address: null,
        ppcAddress: null,
        completed: false,
        erc20TransactionHash: null,
        ppcTransactionHash: null,
      };
    },

    async submitWrap() {
      let nb = parseFloat(this.amount);
      const data = {
        amount: nb,
        destinationAddress: this.destinationAddress,
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
      console.log("POST Wrap to wrapmeister");
      let response = await axios.post(this.endpoints().wrap, null, config);

      if (
        (!!response && !!response.error) ||
        !(
          !!response &&
          !!response.data &&
          !!response.data.data &&
          !!response.data.data._id
        )
      ) {
        this.eventBus.emit("add-toastr", {
          text:
            !!response && !!response.data && !!response.data.message
              ? response.data.message
              : `Unable to start session`,
          type: "error",
        });
        return;
      }
      this.session = response.data.data;
    },

    onModalConfirm() {
      if (
        !this.comfirmedProceedMetaMask &&
        !this.session.completed &&
        !!this.session.wrapping &&
        !!this.session.signed &&
        !!this.session.signature
      ) {
        this.popupModal = false;
        this.comfirmedProceedMetaMask = true;
        this.doClaimTokens();
      }
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
          const accounts = await this.web3.eth.getAccounts();
          return accounts;
        } catch (error) {
          console.log("getAccounts");
          console.log(error);
        }
      }
      return [];
    },

    //wrap:
    async doClaimTokens() {
      if (!!this.wrapClaimtokensTransactionHash) return;

      this.accounts = await this.getAccounts();
      if (
        !this.accounts ||
        this.accounts.length < 1 ||
        !this.session ||
        !this.session.signature ||
        !this.session.wrapping ||
        !this.session.erc20Address ||
        !this.session.network ||
        !this.hasValidSignature()
      )
        return;

      const contractAddress = getContractAddress(this.session.network);

      if (!contractAddress) {
        console.warn(
          "No contract address found for network: " + this.session.network
        );
        return;
      }

      const optionsContract = {
        from: this.session.erc20Address, //should be equal to destinationAddress
      };

      //https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
      const contractInstance = new this.web3.eth.Contract(
        ABI,
        contractAddress,
        optionsContract
      );

      try {
        let signature = JSON.parse(this.session.signature);

        //claimTokens is defined in @/abi/erc20.json
        const result = await contractInstance.methods
          .claimTokens(
            this.session.amount,
            this.session.nonce,
            this.session.erc20Address,
            signature.v,
            signature.r,
            signature.s
          )
          .send();

        this.wrapClaimtokensTransactionHash = result.transactionHash;
        console.log(
          "wrapClaimtokensTransactionHash: " + result.transactionHash
        );
        this.resetSession();

        this.gotoHome(`Tokenise Peercoin to ETH completed`);
      } catch (e) {
        console.log("doClaimTokens exception");
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

<style lang="scss" scoped>
.wrap-container {
  padding: 20px 12px 10px 20px;
  margin: auto;
  width: 60%;
}
.wrap-container-heading {
  font-weight: bold;
  font-style: italic;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
  font-size: 15px;
  padding-bottom: 3px;
}
</style>
