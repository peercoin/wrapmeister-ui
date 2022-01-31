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
              <div class="row my-1">
                <div class="col-md-2 my-2 "></div>

                123

                <div class="col-md-2 my-2 "></div>
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
//import { getNetworks, getSignAccounts, getOwnerAccounts } from "@/Endpoints.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  components: {
    // WrapPeercoin,
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
      accounts: [],
      account: null,
      showHelp: false, //?
      wrapStatus: 1,
      currentPanelId: "",
    };
  },

  created() {
    console.warn("vreated!");
    this.eventBus.on("goto-home", this.gotoHome);
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

    toggleHelp() {
      //this.showHelp = !this.showHelp;
      this.showHelp = true;

      this.currentPanelId = "panelId" + Date.now();
      const options = {
        id: this.currentPanelId,
        panelMode: true,
        width: "344px",
      };

      this.$refs.slideoutpanel.showSlideOutPanel(options);
    },

    onHideSlideOutPanel(panelresult) {
      this.showHelp = false;
    },

    onBackClick() {
      this.gotoHome();
    },

    setWrapStatus(status) {
      this.wrapStatus = status;
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
