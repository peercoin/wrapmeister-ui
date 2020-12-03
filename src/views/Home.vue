<template>
  <div class="layout-dark">
    <div class="layout-dark-form">
      <b-row class="text-center mb-5">
        <b-col> </b-col>
        <b-col cols="8"><h2 class="head">Crypto bridge</h2></b-col>
        <b-col> </b-col>
      </b-row>

      <b-row class="text-center mb-4">
        <b-col> </b-col>
        <b-col cols="8">
          <mode-selector :fromCoin="fromCoin" :toCoin="toCoin" @swapped="swap"
        /></b-col>
        <b-col> </b-col>
      </b-row>

      <b-form-group
        :description="destinationText"
        :state="stateDestinationAddress"
      >
        <b-form-input
          class="form-control"
          id="inputDestination"
          placeholder="Enter destination wallet address"
          v-model="destinationAddress"
          :state="stateDestinationAddress"
          trim
        ></b-form-input>
      </b-form-group>
      <b-form-group :description="refundText" :state="stateRefundAddress">
        <b-form-input
          class="form-control"
          id="inputRefund"
          placeholder="Enter refund wallet address"
          v-model="refundAddress"
          :state="stateRefundAddress"
          trim
        ></b-form-input>
      </b-form-group>

      <b-form-group :disabled="!allowSubmit">
        <b-button block variant="primary" @click="doSubmit"
          >{{ depositText }} <b-icon-hourglass v-if="submitting"
        /></b-button>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import WAValidator from "wallet-address-validator";
import ModeSelector from "../components/ModeSelector.vue";

//change these endpoints and build again
const ppcethEndpoint = "http://localhost:8083/ppceth/deposit";
const ethpcEndpoint = "http://localhost:8083/ethppc/deposit";

export default {
  name: "Home",

  data() {
    return {
      currentMode: "ppceth",
      destinationAddress: "",
      refundAddress: "",
      submitting: false,
    };
  },

  computed: {
    allowSubmit() {
      return this.stateDestinationAddress && this.stateRefundAddress;
    },
    stateDestinationAddress() {
      if (!!this.destinationAddress) {
        return WAValidator.validate(
          this.destinationAddress,
          this.currentMode == "ppceth" ? "ethereum" : "peercoin"
        );
      }
      return false;
    },
    stateRefundAddress() {
      if (!!this.refundAddress) {
        return WAValidator.validate(
          this.refundAddress,
          this.currentMode == "ppceth" ? "peercoin" : "ethereum"
        );
      }
      return false;
    },
    fromCoin() {
      return this.currentMode == "ppceth" ? "Peercoin" : "Ethereum";
    },
    toCoin() {
      return this.currentMode == "ppceth" ? "Ethereum" : "Peercoin";
    },
    destinationText() {
      return this.currentMode == "ppceth"
        ? "ETH Wallet address"
        : "PPC Wallet address";
    },
    refundText() {
      return this.currentMode == "ppceth"
        ? "PPC Refund wallet address"
        : "ETH Refund wallet address";
    },
    depositText() {
      return this.submitting ? "" : "Deposit";
    },
  },

  methods: {
    swap() {
      this.currentMode = this.currentMode == "ppceth" ? "ethppc" : "ppceth";
    },
    doSubmit() {
      if (!this.submitting) {
        this.submitting = true;
        const endpoint =
          this.currentMode == "ppceth" ? ppcethEndpoint : ethpcEndpoint;
        const postdata = {
          refundAddress: this.refundAddress,
          destinationAdres: this.destinationAddress,
        };
        axios
          .post(endpoint, postdata)
          .then((response) => {
            this.$router.push({
              name: "Bridge",
              params: { id: response.data.sessionId },
            });
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      }
    },
  },

  components: {
    ModeSelector,
  },
};
</script>
<style lang="scss" scoped>
.head {
  color: #2980ef;
}
</style>
