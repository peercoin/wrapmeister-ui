<template>
  <div class="wrapview">
    <div class="container mb-3">
      <div class="row my-3 mx-1">
        <multi-steps-progress :step="wrapStatus" />
      </div>
    </div>

    <div class="container mb-3">
      <div class="row my-3 mx-1">
        <div col-12>
          <div class="greenwrapcontainer">
            <div class="row gx-0">
              <div class="col-3 text-start">
                <img
                  alt="Peercoin"
                  height="24"
                  src="../assets/back.svg"
                  class="headericon"
                  @click.stop="onBackClick"
                />
              </div>
              <div class="col-6 fw-bold">
                WRAP PEERCOIN
              </div>
              <div class="col-3 text-end">
                <img
                  alt="Peercoin"
                  height="24"
                  src="../assets/info.svg"
                  class="headericon"
                  @click.stop="toggleHelp"
                />
              </div>
            </div>

            <div class="container">
              <div class="row gx-5 my-1">
                <div class="col-12"></div>

                <wrap-peercoin
                  v-if="showWrapForm"
                  :propsaccounts="selectedAccount"
                  :propsessionid="propsessionid"
                  :propnetwork="propnetwork"
                  @wrap-step-current="setWrapStatus"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <slideout-panel
        ref="slideoutpanel"
        color-icon="#3cb054"
        @hideSlideOutPanel="onHideSlideOutPanel"
      >
        <template v-slot:panelslot>
          <steps :step="wrapStatus" :iswrapping="true" />
        </template>
      </slideout-panel>
    </div>
  </div>
</template>

<script>
import MultiStepsProgress from "@/components/MultiStepsProgress.vue";
import Steps from "@/components/Steps.vue";
import SlideoutPanel from "@/components/SlideoutPanel.vue";
import WrapPeercoin from "@/components/WrapPeercoin.vue";
import { getNetworks } from "@/Endpoints.js";

//this view is to continue a existing wrapsession. todo Also to create a new one.
export default {
  components: {
    WrapPeercoin,
    MultiStepsProgress,
    Steps,
    SlideoutPanel,
  },

  props: {
    propsessionid: String,
    propsaccounts: Array,
    propnetwork: String, //fallback
  },

  data() {
    return {
      wrapStatus: 1,
      currentPanelId: "",
    };
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
      if (!!this.$store.state.account) {
        this.$router.push({
          name: "HomeAccount",
          params: {
            selectedaccount: [this.$store.state.account],
          },
        });
      } else {
        this.$router.push({
          name: "Home",
        });
      }
    },

    setWrapStatus(status) {
      this.wrapStatus = status;
    },

    toggleHelp() {
      this.currentPanelId = "panelId" + Date.now();
      const options = {
        id: this.currentPanelId,
        width: "300px",
      };

      this.$refs.slideoutpanel.showSlideOutPanel(options);
    },

    onHideSlideOutPanel(panelresult) {
      //this.showHelp = false;
    },

    onBackClick() {
      this.gotoHome();
    },

    setWrapStatus(status) {
      this.wrapStatus = status;
    },
  },

  ///////////////COMPUTED/////////////////////////////////
  computed: {
    curNetwork() {
      return this.$store.state.network;
    },

    //returns a array with selected account
    selectedAccount() {
      if (!!this.$store.state.account) {
        return [this.$store.state.account];
      }
      return [];
    },

    showWrapForm() {
      return this.selectedAccount.length > 0;
    },
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
