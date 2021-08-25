<template>
  <button
    type="button"
    :class="{ btn:true, 'btn-success': type==='success', 'btn-danger': type==='danger' }"
    @click="handleClick"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script>
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export default {
  name: "m-button",
  props: {
    type: {
      type: String,
      default: "",
    },
  //   effect: {
  //     type: Boolean,
  //     default: true,
  //   },
  //   size: {
  //     type: String,
  //     default: "",
  //   },
    disabled: {
      type: Boolean,
      default: false,
    },
  //   active: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   plain: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   round: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   block: {
  //     type: Boolean,
  //     default: false,
  //   },
     router: [String, Object],
  },

  data() {
    return {
      clicked: false,
      dbclick: null,
    };
  },

  methods: {
    handleClick(e) {
      if (this.router && this.$router) {
        if (typeof this.router === "string") {
          this.$router.push({ path: this.router });
          return false;
        } else if (typeof this.router === "object") {
          this.$router.push(this.router);
          return false;
        }
      }

      if (!this.dbclick)
        this.dbclick = debounce(function () {
          this.clicked = true;
          this.$emit("mbclick", e);
          setTimeout(() => {
            this.clicked = false;
          }, 500);
        }, 200);

      this.dbclick();
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-success {
  color: #fff;
  background-color: #03914f;
  border-color: #198754;
  &:hover {
    background-color: #229b62;
  }
}
</style>
