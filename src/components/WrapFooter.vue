<template>
  <div>
    <div class="d-sm-none">
      <div
        ref="sitecontentfootersmall"
        class="Site-footer "
        :style="dynamicsmall"
      >
        <div class="container text-center">
          <div class="row my-2">
            <div class="col-12 my-2 text-center">
              <span
                ><a class="footerlink" href="https://peercoin.net"
                  >Peercoin.net</a
                ></span
              >

              <span class="ms-5">
                <a class="footerlink" href="https://talk.peercoin.net"
                  >Forum</a
                ></span
              >
              <span class="ms-5"
                ><router-link class="footerlink" to="/faq">FAQ</router-link>
              </span>
            </div>

            <div class="col-12 my-1 text-center">
              <a href="https://github.com/peercoin"
                ><font-awesome-icon
                  :icon="['fab', 'github']"
                  size="1x"
                  :style="{ color: '#ffffff' }"
              /></a>

              <a href="https://t.me/peercoin">
                <font-awesome-icon
                  :icon="['fab', 'telegram-plane']"
                  size="1x"
                  :style="{ 'margin-left': '10px', color: '#ffffff' }"
              /></a>

              <a href="https://discord.gg/XPxfwtG">
                <font-awesome-icon
                  :icon="['fab', 'discord']"
                  size="1x"
                  :style="{ 'margin-left': '10px', color: '#ffffff' }"
              /></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- sm view or larger: -->

    <div class="d-none d-sm-block">
      <div
        ref="sitecontentfooter"
        class="Site-footer "
        :style="dynamicbigfooter"
      >
        <div class="container text-center">
          <div class="row my-0 py-2">
            <div class="col-sm-6 text-start">
              <span
                ><a class="footerlink" href="https://peercoin.net"
                  >Peercoin.net</a
                ></span
              >

              <span class="ms-5">
                <a class="footerlink" href="https://talk.peercoin.net"
                  >Forum</a
                ></span
              >

              <span class="ms-5"
                ><router-link class="footerlink" to="/faq">FAQ</router-link>
              </span>
            </div>

            <div class="col-sm-6 text-end">
              <a href="https://github.com/peercoin"
                ><font-awesome-icon
                  :icon="['fab', 'github']"
                  size="1x"
                  :style="{ color: '#ffffff' }"
              /></a>

              <a href="https://t.me/peercoin">
                <font-awesome-icon
                  :icon="['fab', 'telegram-plane']"
                  size="1x"
                  :style="{ 'margin-left': '10px', color: '#ffffff' }"
              /></a>

              <a href="https://discord.gg/XPxfwtG">
                <font-awesome-icon
                  :icon="['fab', 'discord']"
                  size="1x"
                  :style="{ 'margin-left': '10px', color: '#ffffff' }"
              /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { debounce } from "@/helpers.js";

export default {
  components: {
    FontAwesomeIcon,
  },

  props: {
    innerwidth: Number,
    innerheigth: Number,
  },

  data() {
    return {
      clientHeight: 0, //heigth of browser
      heightAppfooter: 0,
      heightAppfootersmall: 0,
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

  computed: {
    dynamicbigfooter() {
      if (this.clientHeight < this.innerheigth) {
        //does not fit in window
        return {
          width: this.innerwidth + "px",
        };
      }

      return {
        width: this.innerwidth + "px",
        top:
          Math.min(this.clientHeight, this.innerheigth) -
          this.heightAppfooter +
          "px",
      };
    },

    dynamicsmall() {
      if (this.clientHeight < this.innerheigth) {
        //does not fit in window
        return {
          width: this.innerwidth + "px",
        };
      }

      return {
        width: this.innerwidth + "px",
        top:
          Math.min(this.clientHeight, this.innerheigth) -
          this.heightAppfootersmall +
          "px",
      };
    },
  },

  methods: {
    getDimensions() {
      this.clientHeight = document.documentElement.clientHeight;

      this.heightAppfooter = this.$refs.sitecontentfooter.offsetHeight;
      this.heightAppfootersmall = this.$refs.sitecontentfootersmall.offsetHeight;
      // console.log(
      //   "footer: ",
      //   this.innerheigth,
      //   this.innertop,

      //   this.heightAppfooter,
      //   this.heightAppfootersmall
      // );
    },
  },
};
</script>

<style lang="scss" scoped>
.Site-footer {
  background-color: #3cb054;
  color: #ffffff;
  position: absolute;
  &.TestBottom {
    background-color: #8b1e8f;
  }
}
.footerlink {
  color: white;
  text-decoration: none;
}
</style>
