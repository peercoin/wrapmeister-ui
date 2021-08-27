<template>
  <div class="container session mt-5">
    <wrap-header />

    <div class="row mt-4 mx-1">
      <div class="gobackdiv" @click="onBackClick">
        Back
      </div>

      <wrap-peercoin
        :propsessionid="propsessionid"
        :propsaccounts="propsaccounts"
      />
    </div>
  </div>
</template>

<script>
import WrapHeader from "@/components/WrapHeader.vue";
import WrapPeercoin from "@/components/WrapPeercoin.vue";

export default {
  props: {
    propsessionid: String,
    propsaccounts: Array,
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
        name: "Home",
        params: {
          selectedaccount: this.propsaccounts,
        },
      });
    },

    onBackClick() {
      this.gotoHome();
    },
  },

  components: {
    WrapPeercoin,
    WrapHeader,
  },
};
</script>

<style lang="scss" scoped>
.session {
  max-width: 900px;
  min-width: 400px;
}

.gobackdiv {
  text-align: left;
  font-size: 70%;
  &:hover {
    cursor: pointer;
  }
}
</style>
