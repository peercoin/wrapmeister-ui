<template>
  <div class="row mt-5 mx-1 g-0">
    <div class="col-md-4">
      <div class="totalppc">
        total peercoin wrapped: <strong>{{ amount }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      token: "",
      amount: 0,
    };
  },

  async mounted() {
    try {
      this.token = "0x5b8ef6ee9ec9df9f240febaca2ae88ce3eb950dc"; // todo: place hardcoded values in Endpoints.js
      const url = `https://api-ropsten.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${this.token}&apikey=DMB9CZKSZP56AJK2Z7BZPHH61ZVQ58IYHQ`;
      let query = await axios.get(url);
      if (!!query && !!query.data && !!query.data.result) {
        this.amount = parseInt(query.data.result, 10) * (1.0 / 10 ** 6);
      }
    } catch {}
  },
};
</script>

<style lang="scss" scoped>
.totalppc {
  padding-bottom: 7px;
  padding-top: 7px;
  text-transform: uppercase;
  border: 1px solid white;
  background-color: #3cb054;
  text-align: center;
  opacity: 1;
  font-size: 14px;
  color: white;
}
</style>
