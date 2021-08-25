<template>
  <div class="container home mt-5">
    <div class="row">
      <div class="col-xs-12 col-lg-2">
        <img
          alt="Peercoin"
          class="logopeercoin"
          height="75"
          src="../assets/logo-white.svg"
        />
      </div>
      <div class="col-xs-12 col-lg-10">
        <p class="page-title">Ethereum ↔ Peercoin Bridge</p>
      </div>
    </div>

    <div class="row mt-3 mx-1">
      <collapse-transition>
        <div v-if="!metaMaskEnabled">
          <meta-mask-info />
        </div>
      </collapse-transition>
    </div>

    <div class="row mt-3 mx-1">
      <collapse-transition>
        <div
          v-if="metaMaskEnabled && (iswrapping || isUnwrapping)"
          class="gobackdiv"
          @click="onBackClick"
        >
          Back
        </div>
      </collapse-transition>

      <collapse-transition>
        <div class="col py-3 px-3 body-mid" v-if="showMenu">
          <m-button class="mx-1" type="success" @mbclick="toggleWrap"
            >Wrap Peercoin</m-button
          >

          <m-button class="mx-1" type="success" @mbclick="toggleUnwrap"
            >Unwrap Peercoin</m-button
          >
        </div>
      </collapse-transition>

      <collapse-transition>
        <div v-if="iswrapping || isUnwrapping">
          <div v-if="iswrapping">
            <wrap-peercoin :propsessionid="propsessionid" />
          </div>
          <div v-if="isUnwrapping">
            <unwrap-peercoin />
          </div>
        </div>
      </collapse-transition>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import MButton from "@/components/Button.vue";
import WrapPeercoin from "@/components/WrapPeercoin.vue";
import UnwrapPeercoin from "@/components/UnwrapPeercoin.vue";
import CollapseTransition from "@/components/CollapseTransition.vue";
import MetaMaskInfo from "@/components/MetaMaskInfo.vue";

export default {
  name: "Home",

  props: {
    propsessionid: String,
  },

  data() {
    let defaultState = {
      sessionId: "",
      iswrapping: false,
      isUnwrapping: false,
    };

    if (!!this.propsessionid) {
      defaultState.iswrapping = true;
      defaultState.sessionId = this.propsessionid;
    }

    return defaultState;
  },

  created() {
    this.eventBus.on("goto-home", this.gotoHome);
  },

  beforeUnmount() {
    this.eventBus.off("goto-home", this.gotoHome);
  },

  methods: {
    gotoHome() {
      this.sessionId = "";
      this.iswrapping = false;
      this.isUnwrapping = false;
      this.$router.push({
        name: "Home",
      });
    },

    onBackClick() {
      //for now:
      this.gotoHome();
    },

    gotoSession(id) {
      this.$router.push({
        name: "Session",
        params: { id: id },
      });
    },

    toggleWrap() {
      this.iswrapping = !this.iswrapping;
    },

    toggleUnwrap() {
      this.isUnwrapping = !this.isUnwrapping;
    },
  },

  computed: {
    metaMaskEnabled() {
      return !!window.ethereum && !!ethereum.request;
    },

    showMenu() {
      return (
        !!this.metaMaskEnabled &&
        !this.iswrapping &&
        !this.isUnwrapping
      );
    },
  },

  components: {
    MButton,
    CollapseTransition,
    WrapPeercoin,
    UnwrapPeercoin,
    MetaMaskInfo,
  },
};
</script>

<style lang="scss" scoped>
.home {
  max-width: 900px;
  min-width: 400px;
}
.page-title {
  color: rgb(251, 251, 251);
  font-size: 2rem;
}
.gobackdiv {
  text-align: left;
  font-size: 70%;
  &:hover {
    cursor: pointer;
  }
}
</style>
