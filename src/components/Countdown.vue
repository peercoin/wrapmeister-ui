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
  height: 4px;
}
progress::-moz-progress-bar {
  background: #3cb054;
}
progress::-webkit-progress-value {
  background: #3cb054;
}
progress {
  color: #3cb054;
}
</style>
