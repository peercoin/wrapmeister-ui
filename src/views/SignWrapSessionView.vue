<template>
  <div class="wrapview">
    <div class="container mb-3">
      <div class="row my-3 mx-1">
        <div col-12>
          <div class="greenwrapcontainer">
            <div class="row gx-0">
              <div class="col-3 text-start">
                <font-awesome-icon
                  :icon="['fas', 'arrow-circle-left']"
                  size="1x"
                  class="headericon"
                  @click="onBackClick"
                />
              </div>
              <div class="col-6">
                SIGN WRAP PEERCOIN
              </div>
              <div class="col-3 text-end"></div>
            </div>

            <div class="container">
              <div class="row gx-5 my-1">
                <div class="col-12"></div>

                <sign-wrap-peercoin
                  :propsessionid="propsessionid"
                  :propsaccounts="propsaccounts"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//this page is used for signing wrap sessions
import WrapHeader from "@/components/WrapHeader.vue";
import SignWrapPeercoin from "@/components/SignWrapPeercoin.vue";
import { getNetworks } from "@/Endpoints.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  props: {
    propsessionid: String,
    propsaccounts: Array,
  },

  created() {
    this.eventBus.on("goto-home", this.gotoHome);
  },

  async mounted() {
    //set a default network if empty, aka user refreshes page:
    if (!this.$store.state.network) {
      const networks = getNetworks().filter((nw) => nw.active);

      if (!!networks && networks.length > 0) {
        if (!!this.propnetwork) {
          // fallback 1: querystring
          let nw = this.propnetwork || "";
          const ne = networks.find((n) => n.key === nw);

          if (!!ne) {
            this.$store.commit("setNetwork", ne.key);
          }
        } else {
          // fallback 2: pick first
          const network = networks[0].key;

          this.$store.commit("setNetwork", network);
        }
      }
    }

    //set vuex account if empty, aka user refreshes page:
    if (!this.$store.state.account) {
      //fallback 1: querystring
      if (Array.isArray(this.propsaccounts) && this.propsaccounts.length > 0) {
        this.$store.commit("setAccount", this.propsaccounts[0]);
      }
      //fallback 2: ask metamask again and take first:
      else if (!!window.ethereum) {
        await ethereum.request({
          method: "eth_requestAccounts",
        });
        try {
          const web3 = new Web3(ethereum);
          const accounts = await web3.eth.getAccounts();

          this.$store.commit("setAccount", accounts[0]);
        } catch (error) {
          console.log(error);
        }
      }
    }
  },

  beforeUnmount() {
    this.eventBus.off("goto-home", this.gotoHome);
  },

  methods: {
    gotoHome() {
      this.$router.push({
        name: "HomeAccount",
        params: {
          selectedaccount: this.propsaccounts,
        },
      });
    },

    onBackClick() {
      this.gotoHome();
    },
  },

  components: {
    SignWrapPeercoin,
    WrapHeader,
    FontAwesomeIcon,
  },
};
</script>

<style lang="scss" scoped>
.wrapview {
  min-height: 550px;
}
.greenwrapcontainer {
  padding: 15px;
  margin-bottom: 20px;
  border: 0x solid transparent;
  border-radius: 10px;

  color: #fff;
  background-color: #3cb054;
  border-color: #faebcc;
}
.headericon {
  color: #fff;
  &:hover {
    cursor: pointer;
    position: relative;
    top: -2px;
  }
}
</style>
