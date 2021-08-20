<template>
  <div class="home">
    <row :gutter="12">
      <column :xs="12" :lg="3" class="margin-auto">
        <img
          alt="Peercoin"
          class="logopeercoin"
          height="75"
          src="../assets/logo-white.svg"
        />
      </column>
      <column :xs="12" :lg="9">
        <p class="page-title">Ethereum ↔ Peercoin Bridge</p>
      </column>
    </row>

    <row :gutter="50">
      <!--      <column :xs="12" :lg="3" v-if="metaMaskEnabled">
        <div class="body-column">
          <steps />
        </div>
      </column> -->
      <column :xs="12" :lg="1 == 2 && !!metaMaskEnabled ? 9 : 12">
        <div
          v-if="iswrapping || isUnwrapping"
          class="gobackdiv"
          @click="onBackClick"
        >
          Back
        </div>
        <div class="body-column">
          <collapse-transition>
            <div class="body-mid center" v-if="!metaMaskEnabled">
              <meta-mask-info />
            </div>
          </collapse-transition>

          <collapse-transition>
            <div class="body-mid center" v-if="showMenu">
              <m-button block size="max" type="success" @mbclick="toggleWrap"
                >Bridge Peercoin to token</m-button
              >

              <m-button block size="max" type="success" @mbclick="toggleUnwrap"
                >Unbridge token back to Peercoin</m-button
              >
            </div>
          </collapse-transition>

          <collapse-transition>
            <div v-if="!showSession">
              <div v-if="iswrapping">
                <wrap-peercoin :propsessionid="propsessionid" />
              </div>
              <div v-if="isUnwrapping">
                <unwrap-peercoin />
              </div>
            </div>
          </collapse-transition>
        </div>
      </column>
    </row>
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
      enteringSession: false,
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
      this.enteringSession = false;
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

    toggleEnterSession() {
      this.enteringSession = !this.enteringSession;
    },

    toggleWrap() {
      this.iswrapping = !this.iswrapping;
    },

    toggleUnwrap() {
      this.isUnwrapping = !this.isUnwrapping;
    },

    onSessionEntered() {
      if (!this.sessionId) return;
      this.gotoSession(this.sessionId);
      this.enteringSession = false;
    },
  },

  computed: {
    metaMaskEnabled() {
      return !!window.ethereum && !!ethereum.request;
    },

    showMenu() {
      return (
        !!this.metaMaskEnabled &&
        !this.currentSessionId &&
        !this.iswrapping &&
        !this.isUnwrapping &&
        !this.enteringSession &&
        !this.showSession
      );
    },

    showSession() {
      return !!this.$route.params.id;
    },

    currentSessionId() {
      if (this.enteringSession) return "";

      return this.sessionId || this.$route.params.id;
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
.center {
  margin: auto;
  width: 50%;
  padding: 10px;
}
.body-mid {
  width: 70%;
}
@media screen and (max-width: 770px) {
  .body-mid {
    width: 100%;
  }
}

.gobackdiv {
  text-align: left;
  font-size: 70%;
  &:hover {
    cursor: pointer;
  }
}

.body-column {
  padding: 25px;
  background-color: rgba(255, 255, 255, 0.85);
  min-height: 100px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.7;
}
.page-title {
  color: rgb(251, 251, 251);
  font-size: 2rem;
  // &:hover {
  //   cursor: pointer;
  // }
}
.form-group {
  overflow: hidden;
  clear: both;
  width: 50%;
  margin: auto;
}
// .logopeercoin {
// &:hover {
//   cursor: pointer;
// }
// }

@media screen and (max-width: 992px) {
  .logopeercoin {
    margin-top: 20px;
  }
}
</style>
