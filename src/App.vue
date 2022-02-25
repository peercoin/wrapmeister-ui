<template>
  <div class="Site-content" ref="sitecontent">
    <div :style="centeredWhenCapped">
      <notifications />

      <router-view />
    </div>

    <wrap-footer
      :innerheigth="heightApp"
      :innerwidth="actualInnerWidth"
    ></wrap-footer>
  </div>
</template>

<script>
import Notifications from "@/components/Notifications.vue";
import WrapFooter from "@/components/WrapFooter.vue";
import { debounce } from "@/helpers.js";

export default {
  components: {
    Notifications,
    WrapFooter,
  },

  data() {
    return {
      heightApp: 0,
      widthApp: 0,
      actualInnerWidth: 0,
      deboucedGetDimension: null,
      resizeObserver: null,
    };
  },

  mounted() {
    this.getDimensions();

    this.deboucedGetDimension = debounce(this.getDimensions, 500);

    this.resizeObserver = new ResizeObserver(() => {
      this.getDimensions();
    });
    this.resizeObserver.observe(document.body);
  },

  unmounted() {
    this.resizeObserver.unobserve(document.body);
  },

  methods: {
    getDimensions() {
      this.heightApp = this.$refs.sitecontent.clientHeight; // El. width minus scrollbar

      this.actualInnerWidth = document.body.clientWidth; // El. width minus scrollbar width

      this.widthApp = this.$refs.sitecontent.offsetWidth;
      //});
    },
  },

  computed: {
    centeredWhenCapped() {
      if (
        this.actualInnerWidth > 0 &&
        this.actualInnerWidth - this.widthApp > 1
      ) {
        const offset = Math.floor(
          0.5 * (this.actualInnerWidth - this.widthApp)
        );
        return {
          position: "relative",
          left: offset + "px",
        };
      }

      return {};
    },
  },
};
</script>

<style lang="scss">
@import "../node_modules/typeface-roboto/index.css";

@import "@/variables.scss";

//@import "../node_modules/bootstrap/scss/bootstrap";

// see node_modules/bootstrap/scss/bootstrap.scss
@import "../node_modules/bootstrap/scss/root";
@import "../node_modules/bootstrap/scss/reboot";
@import "../node_modules/bootstrap/scss/type";
@import "../node_modules/bootstrap/scss/buttons";
@import "../node_modules/bootstrap/scss/containers";
@import "../node_modules/bootstrap/scss/grid";
@import "../node_modules/bootstrap/scss/forms";
//@import "../node_modules/bootstrap/scss/spinners";
@import "../node_modules/bootstrap/scss/helpers";
@import "../node_modules/bootstrap/scss/list-group";
@import "../node_modules/bootstrap/scss/progress";
@import "../node_modules/bootstrap/scss/utilities/api";

@import "~vue-multiselect/dist/vue-multiselect.css";
#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}

html {
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.7;
  -webkit-text-size-adjust: 100%;
  color: #ffffff;
  //height: 100%;
  // min-height: 100%;
  background-color: #efefef !important;
}

body {
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  background-color: #efefef !important;
  min-height: 100vh;
}

.Site-content {
  min-height: 100vh;
  max-width: 1000px;
}

.btn-success {
  color: #fff;
  border-radius: 8px;
  background-color: #3cb054;
  border-color: #fff;
  &:hover {
    position: relative;
    top: -2px;
    color: #ffffff;
    background-color: #3cb054;
    border-color: #fff;
  }
}

.btn-success:not(:disabled):not(.disabled) {
  background-color: #3cb054;
}

.btn-outline-success {
  border-width: 1;
  color: #3cb054;
  border-radius: 8px;
  border-color: #3cb054;
  &:hover {
    position: relative;
    top: -2px;
    background-color: #ffffff;
    color: #3cb054;
  }
}

.btn-outline-success:not(:disabled):not(.disabled) {
  background-color: #ffffff;
}

.wrapinput {
  color: #fff;
  background-color: transparent !important;
  border: 0;
  outline: 0;
  background: transparent;
  border-radius: 0px;
  border-bottom: 2px solid #fff;
  padding: 5px 5px 0px 5px;
  &:focus {
    box-shadow: none;
    border-color: #fff;
    color: #fff;
  }
  &:focus-visible {
    background-color: #3cb054 !important;
  }
  &.invalid {
    border-bottom: 2px solid rgb(223, 98, 98);
  }
}

.wrapinput-label-container {
  width: 100%;
}

.wrapinput-label {
  font-size: 70%;
  font-weight: 600;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
