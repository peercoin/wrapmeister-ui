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
          :class="{ 'row-input-field': true, invalid: !validETHAddress }"
          v-model="destinationETHAdress"
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

    <row v-if="!!session.wrapPPCAddress">
      <column :lg="12" :xl="6">
        <p>Peercoin deposit address</p>
      </column>
      <column :lg="12" :xl="6" class="margin-auto">
        <row>
          <vue-q-r-code-component
            class="margin-auto"
            v-if="!!session.wrapPPCAddress"
            :size="250"
            :text="session.wrapPPCAddress"
          />
        </row>
        <row>
          <small class="margin-auto">{{ session.wrapPPCAddress }}</small>
        </row>
      </column>
    </row>

    <row v-if="!session._id">
      <column :lg="12" :xl="12" class="margin-auto m-top-lg">
        <m-button type="success" @mbclick="wrap" :disabled="!validForm">Tokenise Peercoin</m-button>
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
import { getNetworks, getContractAddress } from "@/Endpoints.js";
import Modal from "@/components/Modal.vue";
import Web3 from "web3";
import ABI from "@/abi/erc20.json";
import BaseWrapper from "./BaseWrapper.js";

export default {
  extends: BaseWrapper,
  data() {
    return {
      countDown: 100,
      countDownHandle: null
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
        this.session.wrapPPCAddress &&
        !this.session.wrapSignature &&
        !this.comfirmedProceedMetaMask
      );
    },

    validForm() {
      return this.validAmount && this.validETHAddress && !!this.network;
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

          if (this.session.inStorage) {
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

    onModalConfirm() {
      if (
        !this.comfirmedProceedMetaMask &&
        !!this.session.wrapPPCAddress &&
        !!this.session.wrapSignature
      ) {
        this.popupModal = false;
        this.comfirmedProceedMetaMask = true;

        this.claimTokens();
      }
    },

    async wrap() {
      let nb = parseFloat(this.amount);
      const data = {
        amount: nb,
        destinationAddress: this.destinationETHAdress,
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
      this.session = response.data.data;

      const success = response && !response.error;

      this.eventBus.emit("add-toastr", {
        text: response.data.message,
        type: success ? "success" : "error",
      });
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
        return console.error("No contract address found for network: " + this.session.network);
      }

      try {
        const contract = new this.web3.eth.Contract(ABI, contractAddress, {
          from: this.session.ERC20Address,
        });

        const signature = JSON.parse(this.session.wrapSignature);
        const decimals = await contract.methods.decimals().call();

        const result = await contract.methods.claimTokens(
          this.session.amount * (10 ** decimals),
          this.session.wrapNonce,
          this.session.ERC20Address,
          signature.v,
          signature.r,
          signature.s
        ).send();

        this.resetSession();
        this.gotoHome("Successfully wrapped " + this.amount + "PCC to WPPC");
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
