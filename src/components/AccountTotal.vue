<template>
  <div class="row justify-content-between mt-2 mx-1 g-0">
    <div class="col-md-6 pe-md-2 mt-3">
      <div class="totalppc" @click="onClick1">
        total peercoin wrapped: <strong>{{ amount }}</strong>
      </div>
    </div>
    <div class="col-md-6 ps-md-2 mt-3">
      <div class="totalstorageppc" @click="onClick2">
        custodian balance: <strong>{{ amountStorage }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getContractAddress, wrapEndpoints, getNetworks } from "@/Endpoints.js";
import { isValidAddress } from "../crypto/peercoin-address-validation.js";

export default {
  data() {
    return {
      endpoints: wrapEndpoints,
      token: "",
      amount: 0,
      amountStorage: "",
      peercoinAddressStorage: "",
    };
  },

  async mounted() {
    await this.inititialise();
  },

  watch: {
    "$store.state.network": {
      handler: function(nv, oldValue) {
        console.log("inititialise account total", nv);
        this.inititialise();
      },
      immediate: true,
    },
  },

  methods: {
    async inititialise() {
      try {
        const nw = this.$store.state.network;
        if (!nw) return;
        this.token = getContractAddress(nw);

        const ne = getNetworks().find((n) => n.key === nw);

        if (!ne) return;

        const url = ne.accountTotalUrl;

        let query = await axios.get(url);
        if (!!query && !!query.data && !!query.data.result) {
          //todo might not work for all urls:
          this.amount = parseInt(query.data.result, 10) * (1.0 / 10 ** 6);
        }

        const storagedata = await axios.get(this.endpoints().storageAddress);
        if (!!storagedata && !!storagedata.data && !!storagedata.data.data) {
          this.peercoinAddressStorage = storagedata.data.data;

          let storageDetails;
          if (isValidAddress(this.peercoinAddressStorage, "prod")) {
            storageDetails = await axios.get(
              this.endpoints(this.peercoinAddressStorage)
                .APIaddressPeercoinExplorer
            );
          } else if (isValidAddress(this.peercoinAddressStorage, "both")) {
            storageDetails = await axios.get(
              this.endpoints(this.peercoinAddressStorage)
                .APIaddressPeercoinExplorerTest
            );
          }

          if (
            !!storageDetails &&
            !!storageDetails.data &&
            !!storageDetails.data.balance
          ) {
            this.amountStorage = storageDetails.data.balance;
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    onClick2() {
      let url = "";

      if (isValidAddress(this.peercoinAddressStorage, "prod")) {
        url = this.endpoints(this.peercoinAddressStorage)
          .addressPeercoinExplorer;
      } else if (isValidAddress(this.peercoinAddressStorage, "both")) {
        url = this.endpoints(this.peercoinAddressStorage)
          .addressPeercoinExplorerTest;
      }
      if (!!url) window.open(url, "_blank");
    },

    onClick1() {
      const network = this.$store.state.network;
      if (!network) return;
      const ne = getNetworks().find((nw) => nw.key === network);
      if (!!ne) window.open(ne.viewContractUrl, "_blank");
    },
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
  &:hover {
    cursor: pointer;
    color: #3cb054;
    background-color: white;
  }
}
.totalstorageppc {
  padding-bottom: 7px;
  padding-top: 7px;
  text-transform: uppercase;
  border: 1px solid white;
  background-color: #3cb054;
  text-align: center;
  opacity: 1;
  font-size: 14px;
  color: white;
  &:hover {
    cursor: pointer;
    color: #3cb054;
    background-color: white;
  }
}
</style>
