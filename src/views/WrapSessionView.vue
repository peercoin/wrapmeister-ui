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
                <font-awesome-icon
                  :icon="['fas', 'arrow-circle-left']"
                  size="1x"
                  class="headericon"
                  @click="onBackClick"
                />
              </div>
              <div class="col-6">
                WRAP PEERCOIN
              </div>
              <div class="col-3 text-end">
                <font-awesome-icon
                  :icon="['fas', 'question-circle']"
                  size="1x"
                  class="headericon"
                  @click="toggleHelp"
                />
              </div>
            </div>

            <div class="container">
              <div class="row gx-5 my-1">
                <div class="col-12"></div>

                <wrap-peercoin
                  :propsaccounts="selectedAccount"
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
import { getNetworks, getSignAccounts, getOwnerAccounts } from "@/Endpoints.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

//this view is to continue a existing wrapsession. todo Also to create a new one.
export default {
  components: {
    WrapPeercoin,
    // WrapHeader,
    MultiStepsProgress,
    FontAwesomeIcon,
    Steps,
    SlideoutPanel,
  },

  props: {
    propsessionid: String,
    propsaccounts: Array,
  },

  data() {
    return {
      //  sessionId: "",
      //   iswrapping: false,
      //   isUnwrapping: false,
      // accounts: [],
      //account: null,
      // showHelp: false, //?
      wrapStatus: 1,
      currentPanelId: "",
    };
  },

  created() {
    console.warn("vreated!");
    this.eventBus.on("goto-home", this.gotoHome);
  },

  mounted() {
    console.warn("wrappersessionview mounted");
    //set a default network if empty,  aka user refreshes page:
    if (!this.$store.state.network) {
      const networks = getNetworks().filter((nw) => nw.active);

      if (!!networks && networks.length > 0) {
        const network = networks[0].key;

        this.$store.commit("setNetwork", network);
      }
    }
    //set vuex account if empty, aka user refreshes page:
    if (
      !this.$store.state.account &&
      Array.isArray(this.propsaccounts) &&
      this.propsaccounts.length > 0
    ) {
      this.$store.commit("setAccount", this.propsaccounts[0]);
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
      //this.showHelp = !this.showHelp;
      //this.showHelp = true;

      this.currentPanelId = "panelId" + Date.now();
      const options = {
        id: this.currentPanelId,
        panelMode: true,
        width: "344px",
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
