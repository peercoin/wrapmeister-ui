<template>
  <notifications />
  <div class="maincontainer">
    <router-view />
  </div>
</template>

<script>
import Notifications from "@/components/Notifications.vue";

export default {
  components: {
    Notifications,
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Red+Hat+Text&display=swap");

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
//@import "../node_modules/bootstrap/scss/tooltip";
@import "../node_modules/bootstrap/scss/utilities/api";
 
#app {
  font-family: "Red Hat Text", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html {
  font-family: "Red Hat Text", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.7;
  -webkit-text-size-adjust: 100%;
  color: #4d4d4d;
  background-color: #3cb054;
}

body {
  font-size: 1.5rem;
  min-height: 800px;
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

  &:focus {
    border: 1px solid #0c0;
  }

  &.invalid {
    border: 1px solid rgb(223, 98, 98);
  }
}
 
</style>
