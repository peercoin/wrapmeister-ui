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
export default {
  props: {
    propsaccounts: Array,
  },

  data() {
    return {
      token: "",
    };
  },

  async mounted() {
    this.token = "0x5b8ef6ee9ec9df9f240febaca2ae88ce3eb950dc";
  },

  methods: {
    onClick() {
      if (this.propsaccounts.length > 0) {
        let url = `https://ropsten.etherscan.io/token/${this.token}?a=${this.propsaccounts[0]}`;

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
