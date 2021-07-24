<template>
  <div class="ftralert ftralert-warning">
    <row :gutter="12">
      <column :xs="12" :md="7" :lg="4" class="margin-auto">
        <img
          alt="MetaFlask"
          height="35"
          src="../assets/metamask-logo-horizontal.svg"
        />
      </column>
      <column :xs="12" :md="5" :lg="8">
        <p v-html="missingPlugin"></p>
      </column>
    </row>
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
