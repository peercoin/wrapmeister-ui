<template>
  <div>
    <b-button disabled variant="outline-light">{{ fromCoin }}</b-button>
    <b-button variant="outline-primary" class="mr-3 ml-3">
      <b-icon-arrow-left-right
        class="swap"
        @click="swap"
      ></b-icon-arrow-left-right>
    </b-button>
    <b-button disabled variant="outline-light">{{ toCoin }}</b-button>
  </div>
</template>

<script>
export default {
  props: {
    fromCoin: String,
    toCoin: String,
  },
  methods: {
    swap() {
      this.$emit("swapped", {});
    },
  },
};
</script>

<style lang="scss" scoped>
.swap {
  :hover {
    cursor: pointer;
  }
}
</style>
