<template>
  <div class="wrap-container">
    <div class="wrap-container-heading">{{ header }}</div>
    <row>
      <column :lg="12" :xl="6">
        <p>Choose network to bridge</p>
      </column>
      <column :lg="12" :xl="6" class="margin-auto">
        <select :class="{ 'row-input-field': true, invalid: !network }" v-model="network">
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
          type="text"
          :class="{ 'row-input-field': true, invalid: !validAmount }"
          v-model="amount"
        />
      </column>
    </row>
    <row>
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
import MButton from "@/components/Button.vue";
import { wrapEndpoints, getNetworks } from "@/Endpoints.js";
import { validate } from "wallet-address-validator";

export default {
  data() {
    return {
      requestId: null,
      amount: "",
      destinationAddress: "0x5e9560b6DC421E3Dd6021de4a4094be8517F7E34",
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
      return !!this.destinationAddress && validate(this.destinationAddress, "ETH");
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
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
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

    async submitWrap() {
      let n = parseFloat(this.amount);
      const data = {
        amount: n,
        destinationAddress: this.destinationAddress,
        erc20Address: this.destinationAddress,
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
