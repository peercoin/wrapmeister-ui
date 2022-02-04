<template>
  <div class="ftralert ftralert-warning">
    <div class="row">
      <div class="col-12 my-2">
        <img
          alt="MetaMask"
          height="35"
          src="../assets/metamask-logo-horizontal.svg"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="outer">
          <div class="inner">
            <p class="mt-2 maxwidthexplain " v-html="missingPlugin"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    missingPlugin() {
      let intro =
        "This website is built with MetaMask, " +
        "a browser extension which allows for Ethereum enabled " +
        "distributed applications in your browser. " +
        "Please install the <a style='color: #fff' href='https://metamask.io/download.html'>extension</a> to proceed.";

      return intro;
    },
  },
};
</script>

<style lang="scss" scoped>
.ftralert {
  padding: 15px;
  margin-bottom: 20px;
  border: 0x solid transparent;
  border-radius: 10px;
}
.ftralert-warning {
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
