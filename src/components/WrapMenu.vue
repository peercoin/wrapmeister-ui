<template>
  <div class="banner">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col col-lg-2">
          <button type="button" :class="{ btn: true, 'btn-success': true }">
            Wrap
          </button>
        </div>
        <div class="col-md-auto">
          xxx
        </div>
        <div class="col col-lg-2">
          <button type="button" :class="{ btn: true, 'btn-success': true }">
            unWrap
          </button>
        </div>
      </div>
    </div>

    <div class="row  my-5">
      <div class="col-12 my-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["wrapaction-current"],

  methods: {
    onModalConfirm() {
      this.$emit("wrapaction-current", 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.banner {
  padding: 15px;
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
.inner {
  display: table;
  margin: 0 auto;
}
.outer {
  width: 100%;
}
</style>
