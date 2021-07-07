<template>
  <div class="wrap-container">
    <div class="wrap-container-heading">{{ header }}</div>

    <div class="form-row">
      <div class="form-row-right">
        <select
          :class="{ 'row-input-field': true, invalid: !network }"
          v-model="network"
        >
          <option v-for="item in networks" :value="item.key" :key="item.key">
            {{ item.description }}
          </option>
        </select>
      </div>
      <p>Choose network to bridge</p>
    </div>

    <div class="form-row">
      <div class="form-row-right">
        <input
          type="text"
          :class="{ 'row-input-field': true, invalid: !validAddress }"
          v-model="destinationAddress"
        />
      </div>
      <p>Peercoin Address</p>
    </div>

    <div class="form-row">
      <div class="form-row-right">
        <input
          type="text"
          :class="{ 'row-input-field': true, invalid: !validAmount }"
          v-model="amount"
        />
      </div>
      <p>Amount</p>
    </div>

    <div class="form-row">
      <div class="form-row-right">
        <m-button
          class="m-top-sm"
          type="success"
          @mbclick="submitUnWrap"
          :disabled="!validForm"
          >Convert Peercoin Tokens</m-button
        >
      </div>
      <p>Start session</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MButton from "@/components/Button.vue";
import { wrapEndpoints, getNetworks } from "@/Endpoints.js";
import { validate } from "wallet-address-validator";

export default {
  data() {
    return {
      requestId: null,
      amount: "",
      destinationAddress: "",
      network: "",
      endpoints: wrapEndpoints,
      networks: [],
    };
  },

  mounted() {
    this.requestId = this.newId();
    this.networks = getNetworks().filter((nw) => nw.active);
  },

  computed: {
    header() {
      return "Bridge Peercoin";
    },

    validAddress() {
      return (
        !!this.destinationAddress && validate(this.destinationAddress, "PPC")
      );
    },

    validAmount() {
      if (!this.amount) return false;
      let pattern = /^\d*(\.\d+)?$/;
      if (!pattern.test(this.amount)) return false;

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

    gotoSession(id) {
      this.$router.push({
        name: "Session",
        params: { id: id },
      });
    },

    async submitUnWrap() {
      const config = {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
          network: this.network,
          "Idempotency-Key": this.requestId,
        },
      };
      const data = {
        amount: this.amount,
        destinationAddress: this.destinationAddress,
      };
      let response = await axios.post(this.endpoints().unwrap, data, config);

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
      this.gotoSession(response.data.data._id);
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
