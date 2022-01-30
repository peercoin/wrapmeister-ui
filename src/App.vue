<template>
  <div class="Site-content" ref="sitecontent">
    <notifications />
    <wrap-header />
    <router-view />
    <wrap-footer :fixed="this.clientHeight > this.heightApp" />
  </div>
</template>

<script>
import Notifications from "@/components/Notifications.vue";
import WrapFooter from "@/components/WrapFooter.vue";
import WrapHeader from "@/components/WrapHeader.vue";
import { debounce } from "@/helpers.js";

export default {
  components: {
    Notifications,
    WrapHeader,
    WrapFooter,
  },

  data() {
    return {
      clientHeight: 0,
      heightApp: 0,
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
    this.resizeObserver.observe(this.$refs.sitecontent);
  },

  unmounted() {
    resizeObserver = null;
  },

  methods: {
    getDimensions() {
      this.clientHeight = document.documentElement.clientHeight;
      this.heightApp = this.$refs.sitecontent.offsetHeight;
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
  height: 100%;
}

html {
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.7;
  -webkit-text-size-adjust: 100%;
  color: #ffffff;
  background-color: #ffffff;
  height: 100%;
  min-height: 100%;
  background-color: #ffffff !important;
}

body {
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  background-color: #ffffff !important;
}

.Site-content {
  min-height: 85%;
}

.body-mid {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 5px;
  font-size: 18px;
  font-weight: 400;
  padding-left: 20px;
  padding-right: 20px;
}

.row-input-field {
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  border: 1px solid #c2c2c2;
  box-shadow: 1px 1px 4px #ebebeb;
  -moz-box-shadow: 1px 1px 4px #ebebeb;
  -webkit-box-shadow: 1px 1px 4px #ebebeb;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  padding: 7px;
  outline: none;
  font-size: 14px;
  &:focus {
    border: 1px solid #0c0;
  }

  &.invalid {
    border: 1px solid rgb(223, 98, 98);
  }
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
</style>
