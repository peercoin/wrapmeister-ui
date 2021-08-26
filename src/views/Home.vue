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
        <div
          class="col py-3 px-3 body-mid"
          v-if="metaMaskEnabled && accounts.length === 0"
        >
          <m-button class="mx-1" type="success" @mbclick="getAccounts"
            >Connect with MetaMask</m-button
          >
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
        <div
          v-if="
            metaMaskEnabled &&
              (iswrapping || isUnwrapping) &&
              accounts.length > 0
          "
        >
          <div v-if="iswrapping">
            <wrap-peercoin
              :propsessionid="propsessionid"
              :propsaccounts="accounts"
            />
          </div>
          <div v-if="isUnwrapping">
            <unwrap-peercoin :propsaccounts="accounts" />
          </div>
        </div>
      </collapse-transition>

      <collapse-transition>
        <div
          class="mt-5 g-0"
          v-if="
            metaMaskEnabled &&
              !(iswrapping || isUnwrapping) &&
              accounts.length > 0
          "
        >
          <session-overview :propsaccounts="accounts" />
        </div>
      </collapse-transition>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
// @ is an alias to /src
import MButton from "@/components/Button.vue";
import WrapPeercoin from "@/components/WrapPeercoin.vue";
import UnwrapPeercoin from "@/components/UnwrapPeercoin.vue";
import CollapseTransition from "@/components/CollapseTransition.vue";
import MetaMaskInfo from "@/components/MetaMaskInfo.vue";
import SessionOverview from "@/components/SessionOverview.vue";

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
      accounts: [],
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

    async getAccounts() {
      if (!window.ethereum) return;

      try {
        if (!!this.accounts && this.accounts.length > 0) {
          return;
        }

        await ethereum.request({
          method: "eth_requestAccounts",
        });

        const web3 = new Web3(ethereum);
        this.accounts = await web3.eth.getAccounts();
      } catch (error) {
        console.log(error);
      }
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
        this.accounts.length > 0 &&
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
    SessionOverview,
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
