<template>
  <div class="d-sm-none">
    <div class="Site-footer">
      <div class="container text-center">
        <div class="row my-2">
          <div class="col col-12 my-2 text-center">
            <span>Peercoin.net</span>

            <span class="ms-5">Forum</span>
          </div>

          <div class="col col-12 my-1 text-center">
            <font-awesome-icon
              :icon="['fab', 'github']"
              size="1x"
              :style="{ color: '#ffffff' }"
            />
            <font-awesome-icon
              :icon="['fab', 'telegram-plane']"
              size="1x"
              :style="{ 'margin-left': '10px', color: '#ffffff' }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="d-none d-sm-block">
    <div
      class="Site-footer "
      :class="{
        FixBottom: fixed,
      }"
    >
      <div class="container text-center">
        <div class="row my-2">
          <div class="col col-sm-6 text-start">
            <span
              ><a class="footerlink" href="https://peercoin.net"
                >Peercoin.big</a
              ></span
            >

            <span class="ms-5">
              <a class="footerlink" href="https://talk.peercoin.net"
                >Forum</a
              ></span
            >
          </div>

          <div class="col col-sm-6 text-end">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: {
    FontAwesomeIcon,
  },
  
  props: {
    fixed: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.Site-footer {
  width: 100%;
  background-color: #3cb054;
  color: #ffffff;
  &.FixBottom {
    position: absolute;
    bottom: 0px;
  }
}
.footerlink {
  color: white;
  text-decoration: none;
}
</style>
