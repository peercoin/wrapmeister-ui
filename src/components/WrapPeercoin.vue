<template>
  <div class="wrap-container">
    <div class="wrap-container-heading">{{ header }}</div>

    <div class="form-row">
      <div class="form-row-right">
        <select class="row-input-field" v-model="network">
          <option value="BSC_TESTNET"
            >Binance Smart Chain (BSC) - Testnet</option
          >
          <option value="BSC_MAINNET">Binance Smart Chain (BSC)</option>
          <option value="MATIC_TESTNET">Polygon (Matic) - Testnet</option>
          <option value="MATIC_MAINNET">Polygon (Matic)</option>
          <option value="ETH_TESTNET">Ethereum (ETH) - Testnet</option>
          <option value="ETH_MAINNET">Ethereum (ETH)</option>
        </select>
      </div>
      <p>Choose network to bridge</p>
    </div>

    <div class="form-row">
      <div class="form-row-right">
        <input
          type="text"
          class="row-input-field"
          v-model="destinationAddress"
        />
      </div>
      <p>ERC-20 Address</p>
    </div>

    <div class="form-row">
      <div class="form-row-right">
        <input type="text" class="row-input-field" v-model="amount" />
      </div>
      <p>Amount</p>
    </div>

    <div class="form-row">
      <div class="form-row-right">
        <m-button class="m-top-sm" type="success" :disabled="1 == 2"
          >Tokenise Peercoin</m-button
        >
      </div>
      <p>Start session</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MButton from "@/components/Button.vue";
import { wrapEndpoints } from "@/Endpoints.js";

export default {
  data() {
    return {
      requestId: null,
      amount: 0,
      destinationAddress: "",
      network: "",
      endpoints: wrapEndpoints,
    };
  },

  mounted() {
    this.requestId = this.newId();
  },

  computed: {
    header() {
      return "Bridge Peercoin";
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
  },

  components: {
    MButton,
  },
};
</script>

<style lang="scss" scoped>
.wrap-container {
  padding: 20px 12px 10px 20px;
  margin: auto;
  width: 50%;
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
