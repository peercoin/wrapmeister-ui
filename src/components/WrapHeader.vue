<template>
  <div class="container pt-4">
    <div class="d-sm-none">
      <div class="text-center">
        <div class="row my-2">
          <div class="col ">
            <img
              alt="Peercoin"
              height="55"
              src="../assets/logo-topleft.svg"
              class="iconleaf"
              @click.stop="gotoHome"
            />
          </div>
        </div>

        <div class="row my-2">
          <div class="col">
            <p class="page-title smaller mt-2">{{ curSelectedTitle }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="d-none d-sm-block">
      <div class="row px-3 my-2">
        <div class="col-3 text-start">
          <img
            alt="Peercoin"
            height="75"
            src="../assets/logo-topleft.svg"
            class="iconleaf"
            @click.stop="gotoHome"
          />
        </div>

        <div class="col-7">
          <div class="page-title floating-title ">{{ curSelectedTitle }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNetworks } from "@/Endpoints.js";

export default {
  computed: {
    curSelectedTitle() {
      let network = this.$store.state.network;

      if (!!network) {
        const networkdetail = getNetworks().find((nw) => nw.key === network);

        return !!networkdetail ? networkdetail.pagetitle : "";
      }
      return "";
    },
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
  },
};
</script>

<style lang="scss" scoped>
.page-title {
  color: #3cb054;
  font-size: 1.7rem;
  font-weight: 400;
  &.smaller {
    font-size: 1.4rem;
  }
}
.floating-title {
  position: absolute;
  left: 0px;
  width: 100%;
  //background-color: aqua;
}
.iconleaf {
  &:hover {
    cursor: pointer;
  }
}
</style>
