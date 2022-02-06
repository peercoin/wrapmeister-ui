<template>
  <collapse-transition>
    <div v-if="propsaccounts && !!token" class="row g-0">
      <div class="col-md-12">
        <div class="totalofficialppc" @click="onClick">
          <span class="allcaps">official wrapped peercoin token: </span
          ><strong>{{ token }}</strong>
        </div>
      </div>
    </div>
  </collapse-transition>
</template>

<script>
import CollapseTransition from "@/components/CollapseTransition.vue";
import { getContractAddress, wrapEndpoints, getNetworks } from "@/Endpoints.js";

export default {
  props: {
    propsaccounts: Array,
  },

  data() {
    return {
      endpoints: wrapEndpoints,
      token: "",
      retrycount: 1,
    };
  },

  mounted() {
    this.retryInit();
  },

  watch: {
    "$store.state.network": {
      handler: function(nv, oldValue) {
        this.inititialise();
      },
      immediate: true,
    },
  },

  methods: {
    retryInit() {
      this.inititialise();

      this.$nextTick(() => {
        if (!this.token) {
          if (this.retrycount < 10) {
            window.setTimeout(() => {
              this.retryInit();
            }, 1200 * this.retrycount);
          }
        }
        this.retrycount++;
      });
    },

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

  components: {
    CollapseTransition,
  },
};
</script>

<style lang="scss" scoped>
.totalofficialppc {
  padding-bottom: 7px;
  padding-top: 7px;

  border: 1px solid #3cb054;
  // background-color: #fff;
  text-align: center;
  opacity: 1;
  font-size: 14px;
  color: #3cb054;
  border-radius: 8px;
  &:hover {
    cursor: pointer;
    background-color: #3cb054;
    color: white;
  }
}
.allcaps {
  text-transform: uppercase;
}
</style>
