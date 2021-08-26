<template>
  <div v-if="propsaccounts" class="row mt-5 mx-1 g-0">    
    <div class="col-md-4">
      <div class="totalppc">
        total peercoin wrapped: <strong>{{ amount }}</strong>
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
      amount: 0,
    };
  },

  async mounted() {
    this.amount = 123.456;
  },

 
};
</script>

<style lang="scss" scoped>
.totalppc {
  padding-bottom: 7px;
  padding-top: 7px;
  text-transform: uppercase;
  border: 1px solid white;
  background-color: #3cb054;
  text-align: center;
  opacity: 1;
  font-size: 14px;
  color: white; 
}
</style>
