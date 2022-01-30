<template>
  <div class="banner">
    <div class="container">
      <div class="row  ">
        <div class="col ">
          <div class="warranty mt-4 mx-2 me-3">
            The software is provided "as is", without warranty of any kind,
            express or implied, including but not limited to the warranties of
            merchantability, fitness for a particular purpose and
            noninfringement. In no event shall the authors or copyright holders
            be liable for any claim, damages or other liability, whether in an
            action of contract, tort or otherwise, arising from, out of or in
            connection with the software or the use or other dealings in the
            software. By continuing you have read and understood these
            conditions.
          </div>
        </div>
      </div>

      <div class="d-sm-none">
        <div class="row justify-content-md-center mt-3">
          <div class="d-grid gap-2 mt-2">
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
        <div class="row justify-content-md-center mt-3">
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
        <session-overview :propsaccounts="propsaccounts" />
      </div>

      <div class="my-3 g-0" v-if="(isSigner || isOwner) && showSessions">
        <h5>Sign overview</h5>
        <sign-session-overview :propsaccounts="propsaccounts" />
      </div>

      <div
        class="container mb-3"
        v-if="((isSigner || isOwner) && showSessions)"
      >
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
</template>

<script>
import SignSessionOverview from "@/components/SignSessionOverview.vue";
import SessionOverview from "@/components/SessionOverview.vue";

export default {
  emits: ["wrapaction-current"],

  components: {
    SessionOverview,
    SignSessionOverview,
  },

  props: {
    isOwner: Boolean,
    isSigner: Boolean,
    showSessions: Boolean,
    propsaccounts: Array,
  },

  data() {
    return {
      nominateLabel: "???",
    };
  },

  mounted() {
    this.nominateLabel = this.isOwner
      ? "Nominate"
      : this.isSigner
      ? "Vote"
      : "Nope";
  },

  methods: {
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
// .inner {
//   display: table;
//   margin: 0 auto;
// }
// .outer {
//   width: 100%;
// }
</style>
