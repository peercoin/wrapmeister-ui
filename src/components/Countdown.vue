<template>
  <progress :value="status" class="my-progress"></progress>
</template>

<script>
export default {
props: {
    status: {
      type: Number,
      default: 1,
    }, 
  },

  data: () => {
    return {
      progress: 0.0,
    };
  },
};
</script>

<style lang="css">
progress {
  appearance: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
}
 
</style>
