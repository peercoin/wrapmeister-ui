<template>
  <svg
    class="arrowlefticon"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 30 30"
    :width="sizepx"
    :height="sizepx"
    @click="emitClick"
  >
    <defs>
      <clipPath id="clip-path" transform="translate(0)">
        <rect class="cls-1" width="30" height="30" />
      </clipPath>
    </defs>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <g clip-path="url(#clip-path)">
          <path
            :fill="fillcolor"
            d="M26.9,5.91A14.52,14.52,0,0,0,18.13.34c-.65-.14-1.31-.19-2-.29l-.28,0H14.12c-.57.08-1.14.13-1.7.23A14.77,14.77,0,0,0,3.74,5.11,14.81,14.81,0,0,0,.08,13.49c0,.21,0,.42-.08.63v1.76c.08.57.13,1.14.23,1.7a14.75,14.75,0,0,0,4.91,8.7,14.43,14.43,0,0,0,8.36,3.64,14.56,14.56,0,0,0,10.62-3,14.49,14.49,0,0,0,5.53-8.74A14.55,14.55,0,0,0,26.9,5.91ZM22.12,16.56a4.58,4.58,0,0,1-.53,0H11.85l.25.26c.87.86,1.76,1.74,2.62,2.63a2.17,2.17,0,0,1,.54,1,1.44,1.44,0,0,1-.79,1.56,1.58,1.58,0,0,1-.76.21,1.65,1.65,0,0,1-.91-.3,2.51,2.51,0,0,1-.35-.31l0,0L7.06,16.29a1.62,1.62,0,0,1,0-2.58L8.74,12,12.46,8.3a1.68,1.68,0,0,1,1.59-.55,1.56,1.56,0,0,1,.7.36,1.5,1.5,0,0,1,.44.64,1.59,1.59,0,0,1-.22,1.5,1.93,1.93,0,0,1-.27.3l0,0-2.84,2.84h9.77l.51,0A1.56,1.56,0,0,1,23.5,15a1.56,1.56,0,0,1-1.38,1.56Z"
            transform="translate(0)"
          />
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    fillcolor: {
      type: String,
      default: "#f9f9f9",
    },
    sizepx: {
      type: String,
      default: "24px",
    },
    methods: {
      emitClick() {
        this.$emit("clicked");
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes updown {
  0% {
    transform: translate(0px, 0px);
  }

  50% {
    transform: translate(0px, -2px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.arrowlefticon {
  &:hover {
    cursor: pointer;
    animation: updown 0.35s;
  }
}
</style>
