<template>
  <div
    :class="{
      container: true,
      session: !showHelp,
      'session-with-help': showHelp,
      'mt-5': true,
    }"
  >
    <div class="row">
      <div
        :class="{
          'col-12': !showHelp,
          'col-lg-10': showHelp,
        }"
      >
        <wrap-header />

        <multi-steps-progress
          class="mt-4"
          :step="wrapStatus"
          :iswrapping="true"
        />

        <div class="row g-0 mb-2 px-1">
          <div class="col-6 text-start fs-5">
            <span class="gobackdiv" @click="onBackClick">Back</span>
          </div>
          <div class="col-6 text-end">
            <font-awesome-icon
              :icon="['far', 'question-circle']"
              size="1x"
              class="helpicon"
              @click="toggleHelp"
            />
          </div>
        </div>

        <div class="row mt-1 mx-1">
          <wrap-peercoin
            :propsessionid="propsessionid"
            :propsaccounts="propsaccounts"
            @wrap-step-current="setWrapStatus"
          />
        </div>
      </div>

      <div class="col-lg-2 my-5" v-if="showHelp">
        <steps :step="wrapStatus" :iswrapping="true" />
      </div>
    </div>
  </div>
</template>

<script>
import WrapHeader from "@/components/WrapHeader.vue";
import WrapPeercoin from "@/components/WrapPeercoin.vue";
import MultiStepsProgress from "@/components/MultiStepsProgress.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Steps from "@/components/Steps.vue";

export default {
  props: {
    propsessionid: String,
    propsaccounts: Array,
  },

  data() {
    return {
      showHelp: false,
      wrapStatus: 1,
    };
  },

  created() {
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
      this.showHelp = !this.showHelp;
    },

    onBackClick() {
      this.gotoHome();
    },

    setWrapStatus(status) {
      this.wrapStatus = status;
    },
  },

  components: {
    WrapPeercoin,
    WrapHeader,
    MultiStepsProgress,
    FontAwesomeIcon,
    Steps,
  },
};
</script>

<style lang="scss" scoped>
.session {
  max-width: 900px;
  min-width: 400px;
}
.session-with-help {
  min-width: 400px;
}
.helpicon {
  color: #fefefe;
  &:hover {
    cursor: pointer;
    color: #b8bbb4;
  }
}
.gobackdiv {
  text-align: left;
  font-size: 70%;
  &:hover {
    cursor: pointer;
  }
}
</style>
