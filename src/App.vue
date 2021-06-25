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

  background: url("./assets/efficient-and-sustainable.svg") bottom left
    no-repeat;
  background-position: 15% 75%;
  background-size: 40%;
}

.maincontainer {
  margin-left: 85px;
  margin-right: 85px;
}

.form-row {
  overflow: auto;
}
.form-row-right {
  float: right;
  min-width: 272px;
  padding-top: 16px;
  text-align: right;
}

.icon-case {
  width: 35px;
  float: left;
  border-radius: 5px 0px 0px 5px;
  height: 42px;
  position: relative;
  text-align: center;
  line-height: 40px;
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

.row-textarea-field {
  height: 100px;
  width: 100%;
}

/*
  Dynamic spacing classes
  Spacers that grow and shrink based off ratios between the breakpoints

  Margins:
  <div class="m-top-sm m-right-md m-bottom-sm m-left-md">...</div>
  <div class="m-sm">...</div>

  Padding:
  <div class="p-top-sm p-right-md p-bottop-sm p-left-md">...</div>
  <div class="p-sm">...</div>

  ---

  Rigid spacing classes
  Spacers that stay the same size in all breakpoints

  Margins:
  <div class="m-rigid-top-sm m-rigid-right-md m-rigid-bottom-rigid-sm m-rigid-left-md">...</div>
  <div class="m-rigid-sm">...</div>

  Padding:
  <div class="p-rigid-top-sm p-rigid-right-md p-rigid-bottop-rigid-sm p-rigid-left-md">...</div>
  <div class="p-rigid-sm">...</div>
*/
@mixin spaces {
  // Spaces based on breakpoints
  $spaces: (
    xs: 5,
    sm: 10,
    md: 15,
    lg: 30,
    xl: 45,
  );

  $directions: (top, right, bottom, left);

  // Responsive stepped percentages
  $xs-percentage: 0.55;
  $sm-percentage: $xs-percentage / 3 + $xs-percentage;
  $md-percentage: $sm-percentage / 3 + $sm-percentage;

  @each $direction in $directions {
    @each $name, $space in $spaces {
      // .m-top-md
      .m-#{$direction}-#{$name} {
        margin-#{$direction}: rem($space * $xs-percentage);

        @include breakpoint(sm) {
          margin-#{$direction}: rem($space * $sm-percentage);
        }

        @include breakpoint(md) {
          margin-#{$direction}: rem($space * $md-percentage);
        }

        @include breakpoint(lg) {
          margin-#{$direction}: rem($space);
        }
      }

      // .m-rigid-top-md
      .m-rigid-#{$direction}-#{$name} {
        margin-#{$direction}: rem($space);
      }

      // .m-md
      .m-#{$name} {
        margin: rem($space * $xs-percentage);

        @include breakpoint(sm) {
          margin: rem($space * $sm-percentage);
        }

        @include breakpoint(md) {
          margin: rem($space * $md-percentage);
        }

        @include breakpoint(lg) {
          margin: rem($space);
        }
      }

      // .m-rigid-md
      .m-rigid-#{$name} {
        margin: rem($space);
      }

      // .p-top-sm
      .p-#{$direction}-#{$name} {
        padding-#{$direction}: rem($space * $xs-percentage);

        @include breakpoint(sm) {
          padding-#{$direction}: rem($space * $sm-percentage);
        }

        @include breakpoint(md) {
          padding-#{$direction}: rem($space * $md-percentage);
        }

        @include breakpoint(lg) {
          padding-#{$direction}: rem($space);
        }
      }

      // .p-rigid-top-md
      .p-rigid-#{$direction}-#{$name} {
        padding-#{$direction}: rem($space);
      }

      // .p-sm
      .p-#{$name} {
        padding: rem($space * $xs-percentage);

        @include breakpoint(sm) {
          padding: rem($space * $sm-percentage);
        }

        @include breakpoint(md) {
          padding: rem($space * $md-percentage);
        }

        @include breakpoint(lg) {
          padding: rem($space);
        }
      }

      // .p-rigid-sm
      .p-rigid-#{$name} {
        padding: rem($space);
      }
    }
  }
}

// px to rem converter
@function rem($pxval) {
  $default-font-size-base: 16;

  @return ($pxval / $default-font-size-base) * 1rem;
}

// breakpoint helper
@mixin breakpoint($point: xs) {
  $screen-xs-max-width: 767;
  $screen-sm-min-width: 768;
  $screen-sm-max-width: 991;
  $screen-md-min-width: 992;
  $screen-md-max-width: 1199;
  $screen-lg-min-width: 1200;

  @if $point == xs {
    @media (max-width: rem($screen-xs-max-width)) {
      @content;
    }
  } @else if $point == sm {
    @media (min-width: rem($screen-sm-min-width)) {
      @content;
    }
  } @else if $point == md {
    @media (min-width: rem($screen-md-min-width)) {
      @content;
    }
  } @else if $point == lg {
    @media (min-width: rem($screen-lg-min-width)) {
      @content;
    }
  }
}

@include spaces;
</style>
