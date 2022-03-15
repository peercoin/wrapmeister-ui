<template>
  <collapse-transition>
    <div
      v-if="!!amount && !!amountStorage"
      class="row justify-content-between mt-2 g-0"
    >
      <div class="col-md-6 pe-md-2 mt-3">
        <div class="totalppc" @click="gotoExternalWrappedTotal">
          TOTAL PEERCOIN WRAPPED: <strong>{{ amount }}</strong>
        </div>
      </div>
      <div class="col-md-6 ps-md-2 mt-3">
        <div class="totalstorageppc" @click="gotoExternalCustodianBalance">
          CUSTODIAN BALANCE: <strong>{{ amountStorage }}</strong>
        </div>
      </div>
    </div>
  </collapse-transition>
</template>

<script>
import axios from "axios";
import CollapseTransition from "@/components/CollapseTransition.vue";
import { roundTo } from "@/helpers.js";
import { getContractAddress, wrapEndpoints, getNetworks } from "@/Endpoints.js";
import { isValidAddress } from "../crypto/peercoin-address-validation.js";

export default {
  data() {
    return {
      endpoints: wrapEndpoints,
      token: "",
      amount: "",
      amountStorage: "",
      peercoinAddressStorage: "",
      retrycount: 1,
    };
  },

  async mounted() {
    await this.retryInit();
  },

  watch: {
    "$store.state.network": {
      handler: function(nv, oldValue) {
        //console.log("inititialise account total", nv);
        this.amount = "";
        this.amountStorage = "";
        this.inititialise();
      },
      immediate: true,
    },
  },

  methods: {
    async retryInit() {
      await this.inititialise();

      this.$nextTick(() => {
        //console.warn(this.amount, this.amountStorage);
        if (!this.amount || !this.amountStorage) {
          if (this.retrycount < 10) {
            window.setTimeout(() => {
              this.retryInit();
            }, 1200 * this.retrycount);
          }
        }
        this.retrycount++;
      });
    },

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
          const digits = 6;
          const amountnumber = roundTo(
            parseInt(query.data.result, 10) * (1.0 / 10 ** digits),
            digits
          );
          this.amount = amountnumber > 0 ? "" + amountnumber : "";
        }

        const storagedata = await axios.get(this.endpoints().storageAddress, {headers: {network: nw}});
        if (!!storagedata && !!storagedata.data && !!storagedata.data.data) {
          this.peercoinAddressStorage = storagedata.data.data;

          let storageDetails;
          if (isValidAddress(this.peercoinAddressStorage, "prod")) {
            storageDetails = await axios.get(
              this.endpoints(this.peercoinAddressStorage)
                .apiaddressPeercoinExplorer
            );
          } else if (isValidAddress(this.peercoinAddressStorage, "both")) {
            storageDetails = await axios.get(
              this.endpoints(this.peercoinAddressStorage)
                .apiaddressPeercoinExplorerTest
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
        if (
          !!err.response &&
          !!err.response.data &&
          !!err.response.data.message
        )
          console.warn(err.response.data.message);
      }
    },

    gotoExternalCustodianBalance() {
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

    gotoExternalWrappedTotal() {
      const network = this.$store.state.network;
      if (!network) return;
      const ne = getNetworks().find((nw) => nw.key === network);
      if (!!ne) window.open(ne.viewContractUrl, "_blank");
    },
  },

  components: {
    CollapseTransition,
  },
};
</script>

<style lang="scss" scoped>
.totalppc {
  padding-bottom: 7px;
  padding-top: 7px;

  border: 1px solid #3cb054;
  // background-color: #fff;
  text-align: center;
  opacity: 1;
  font-size: 14px;
  color: #3cb054;
  border-radius: 8px;
  &:hover {
    cursor: pointer;
    background-color: #3cb054;
    color: white;
  }
}
.totalstorageppc {
  padding-bottom: 7px;
  padding-top: 7px;

  border: 1px solid #3cb054;
  // background-color: #fff;
  text-align: center;
  opacity: 1;
  font-size: 14px;
  color: #3cb054;
  border-radius: 8px;
  &:hover {
    cursor: pointer;
    background-color: #3cb054;
    color: white;
  }
}
</style>
