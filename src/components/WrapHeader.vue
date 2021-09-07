<template>
  <div class="row">
    <div class="col-xs-12 col-lg-2">
      <img alt="Peercoin" height="75" src="../assets/logo-white.svg" />
    </div>
    <div class="col-xs-12 col-lg-10">
      <p class="page-title">{{ curSelectedTitle }}</p>
    </div>
  </div>
</template>

<script>
import { getNetworks } from "@/Endpoints.js";

export default {
  computed: {
    curSelectedTitle() {
      let network = this.$store.state.network;
      console.log(network)
      if (!!network) {
        const networkdetail = getNetworks().find(
          (nw) => nw.key === network
        );

        return !!networkdetail ? networkdetail.pagetitle : "";
      }
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.page-title {
  color: rgb(251, 251, 251);
  font-size: 2rem;
}
</style>
