<template>
  <div class="banner">
    <div class="container">
      <div class="d-sm-none">
        <div class="row justify-content-md-center mt-1">
          <div class="d-grid gap-2 mt-3">
            <button
              class="btn btn-success btn-lg"
              type="button"
              @click="onWrapClick"
            >
              Wrap Peercoin
            </button>
            <button
              class="btn btn-success btn-lg mb-4 mt-1"
              type="button"
              @click="onUnwrapClick"
            >
              Unwrap Peercoin
            </button>
          </div>
        </div>
      </div>
      <div class="d-none d-sm-block">
        <div class="row justify-content-md-center mt-3 pt-2">
          <div class="row justify-content-center">
            <div class="col-md-5">
              <div class="d-grid gap-2 mt-2">
                <button
                  class="btn btn-success btn-lg  mb-4 mt-2"
                  type="button"
                  @click="onWrapClick"
                >
                  Wrap Peercoin
                </button>
              </div>
            </div>
            <div class="col-md-5">
              <div class="d-grid gap-2 mt-2">
                <button
                  class="btn btn-success btn-lg mb-4 mt-2"
                  type="button"
                  @click="onUnwrapClick"
                >
                  Unwrap Peercoin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="my-3 g-0" v-if="showSessions">
        <session-overview
          :propsaccounts="propsaccounts"
          @nrofsessions="setNumberOfSessions"
        />
      </div>

      <div class="my-3 g-0" v-if="(isSigner || isOwner) && showSessions">
        <h5>SIGN OVERVIEW</h5>
        <sign-session-overview :propsaccounts="propsaccounts" />
      </div>

      <div class="container mb-3" v-if="(isSigner || isOwner) && showSessions">
        <div class="row my-3">
          <button
            class="btn btn-success mx-1 my-1"
            type="button"
            @click="gotoNomination"
          >
            {{ nominateLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <slideout-panel
    ref="slideoutpanel"
    color-icon="#fff"
    @hideSlideOutPanel="onHideSlideOutPanel"
  >
    <template v-slot:panelslot>
      <div class="container">
        <div class="row g-0 py-0">
          <div class="col py-0">
            <div class="warranty mx-2 my-0" v-if="showWarranty">
              The software is provided "as is", without warranty of any kind,
              express or implied, including but not limited to the warranties of
              merchantability, fitness for a particular purpose and
              noninfringement. In no event shall the authors or copyright
              holders be liable for any claim, damages or other liability,
              whether in an action of contract, tort or otherwise, arising from,
              out of or in connection with the software or the use or other
              dealings in the software.
            </div>
          </div>
        </div>
      </div>
    </template>
  </slideout-panel>
</template>

<script>
import SignSessionOverview from "@/components/SignSessionOverview.vue";
import SessionOverview from "@/components/SessionOverview.vue";
import SlideoutPanel from "@/components/SlideoutPanel.vue";

export default {
  emits: ["wrapaction-current"],

  components: {
    SessionOverview,
    SignSessionOverview,
    SlideoutPanel,
  },

  props: {
    isOwner: Boolean,
    isSigner: Boolean,
    showSessions: Boolean,
    propsaccounts: Array,
  },

  data() {
    return {
      nrofsessions: -1,
      nominateLabel: "???",
      currentPanelId: "",
    };
  },

  mounted() {
    this.nominateLabel = this.isOwner
      ? "Nominate"
      : this.isSigner
      ? "Vote"
      : "Nope";
  },

  watch: {
    nrofsessions() {
      this.$nextTick(() => {
        if (this.showWarranty) {
          this.popupWarranty();
        }
      });
    },
  },

  computed: {
    showWarranty() {
      return (
        !this.$store.state.warrantyhide &&
        !this.isOwner &&
        !this.isSigner &&
        this.nrofsessions === 0
      );
    },
  },

  methods: {
    setNumberOfSessions(nr) {
      this.nrofsessions = nr;
    },

    popupWarranty() {
      if (this.showWarranty) {
        this.currentPanelId = "panelId" + Date.now();
        const options = {
          id: this.currentPanelId,
          height: "20%",
          width: "100%",
          openOn: "bottom",
          background: "#3cb054",
        };

        this.$refs.slideoutpanel.showSlideOutPanel(options);
      }
    },

    onWrapClick() {
      this.$emit("wrapaction-current", 1);
    },

    onUnwrapClick() {
      this.$emit("wrapaction-current", 2);
    },

    gotoNomination() {
      if (!!this.propsaccounts)
        this.$router.push({
          name: "NominateAndVote",
          params: {
            selectedaccount: this.propsaccounts,
          },
        });
    },

    onHideSlideOutPanel(panelresult) {
      this.$store.commit("setWarrantySeen", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.banner {
  margin-bottom: 20px;
  border: 0x solid transparent;
  border-radius: 10px;

  color: #fff;
  background-color: #3cb054;
  border-color: #faebcc;
}
.maxwidthexplain {
  max-width: 295px;
}
.warranty {
  font-size: 80%;
  color: #fff;
}
// .inner {
//   display: table;
//   margin: 0 auto;
// }
// .outer {
//   width: 100%;
// }
</style>
