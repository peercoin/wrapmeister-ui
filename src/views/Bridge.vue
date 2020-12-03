<template>
  <div class="layout-dark">
    <div class="layout-dark-form">
      <span v-if="!!info">Deposit here: {{ info }}</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

//change these endpoints and build again
const bridgeEndpoint = "http://localhost:8083/bridge/";

export default {
  data() {
    return {
      info: "",
    };
  },
  mounted() {
    axios.get(bridgeEndpoint + this.$route.params.username).then((response) => {
      this.info = response.data.depositAddress;
    });
  },
};
</script>
