<template>
  <div v-if="propsaccounts" class="row mt-5 mx-1 g-0">
    <div class="col-md-10 offset-md-1">
      <div class="totalofficialppc" @click="onClick">
        official wrapped peercoin token: <strong>{{ token }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import { getContractAddress, wrapEndpoints, getNetworks } from "@/Endpoints.js";

export default {
  props: {
    propsaccounts: Array,
  },

  data() {
    return {
      endpoints: wrapEndpoints,
      token: "",
    };
  },

  mounted() {
    this.inititialise();
  },

  watch: {
    "$store.state.network": {
      handler: function(nv, oldValue) {
        console.log("inititialise official total", nv);
        this.inititialise();
      },
      immediate: true,
    },
  },

  methods: {
    inititialise() {
      const nw = this.$store.state.network;
      if (!nw) return;
      this.token = getContractAddress(nw);
    },

    onClick() {
      const nw = this.$store.state.network;
      if (!nw) return;
      if (this.propsaccounts.length > 0) {
        const ne = getNetworks().find((n) => n.key === nw);
        if (!ne || !ne.officialTotalUrl) return;

        const url = ne.officialTotalUrl.replace(
          "{{{id}}}",
          this.propsaccounts[0]
        );
        window.open(url, "_blank");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.totalofficialppc {
  padding-bottom: 7px;
  padding-top: 7px;
  text-transform: uppercase;
  border: 1px solid white;
  background-color: #3cb054;
  text-align: center;
  opacity: 1;
  font-size: 14px;
  color: white;
  &:hover {
    cursor: pointer;
    color: #3cb054;
    background-color: white;
  }
}
</style>
