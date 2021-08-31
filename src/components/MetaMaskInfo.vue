<template>
  <div class="ftralert ftralert-warning">
    <div class="row">
      <div class="col-xs-12 col-lg-3">
        <img
          alt="MetaMask"
          height="35"
          src="../assets/metamask-logo-horizontal.svg"
        />
      </div>
      <div class="col-xs-12 col-lg-9">
        <p v-html="missingPlugin"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    missingPlugin() {
      let intro =
        "This website is built on top of MetaMask, an extension for accessing Ethereum enabled distributed applications in your browser!";

      intro +=
        " Please install the <a href='https://metamask.io/download.html'>extension</a> to proceed.";

      return intro;
    },
  },
};
</script>

<style lang="scss" scoped>
.ftralert {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 1px;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}
.ftralert-warning {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border-color: #faebcc;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}
</style>
