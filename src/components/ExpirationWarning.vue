<template>
  <div
    class="incompleteAlert"
    v-if="
      !!session &&
        !!session._id &&
        !!session.amount &&
        !!session.expiresAt &&
        session.depositedAmount < session.amount
    "
  >
    <div class="row">
      <div class="col-xs-4 col-md-3">
        <font-awesome-icon
          icon="exclamation-triangle"
          size="3x"
          :style="{ color: '#3cb054' }"
        />
      </div>
      <div class="col-xs-8 col-md-9 mt-2">
        <div class="row">
          <div class="col-lg-8">{{ missingCoins }}</div>
          <div class="col-lg-4">{{ time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  props: {
    session: Object,
  },

  data() {
    return {
      countDownHandle: null,
      time: "",
    };
  },

  mounted() {
    if (!!this.countDownHandle) {
      clearInterval(this.countDownHandle);
    }
    this.countDownHandle = setInterval(this.onCountDown, 1000);
  },

  unmounted() {
    if (!!this.countDownHandle) {
      clearInterval(this.countDownHandle);
    }
  },

  methods: {
    zeroPadding(num, digit) {
      let zero = "";
      for (let i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },

    async onCountDown() {
      if (!!this.session && this.session.depositedAmount > 0) {
        this.time =
          "This process cannot be cancelled. You must proceed with this session.";
      } else {
        const now = new Date().getTime();
        const countDownDate = this.session.expiresAt; //unix in ms
        const distance = countDownDate - now;
        if (distance > 0) {
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          this.time =
            this.zeroPadding(minutes, 2) + ":" + this.zeroPadding(seconds, 2);
        } else this.time = !this.missingCoins ? "" : "session expired";
      }
    },
  },

  computed: {
    countDownDate() {
      return;
    },

    missingCoins() {
      if (
        !this.session ||
        !this.session._id ||
        this.session.amount === null ||
        !this.session.expiresAt ||
        this.session.depositedAmount === null
      )
        return "";

      const remain = this.session.amount - this.session.depositedAmount;
      const remaining =
        Math.round((remain + Number.EPSILON) * 1000000) / 1000000;
      let pluralremain = remaining > 1 ? "peercoins" : "peercoin";

      if (this.session.depositedAmount > 0) {
        let plural =
          this.session.depositedAmount > 1 ? "peercoins" : "peercoin";

        return `${this.session.depositedAmount} ${plural} received, please deposit remaining ${remaining} ${pluralremain}.`;
      }

      return `Please deposit ${remaining} ${pluralremain} PPC within given time limit`;
    },
  },

  components: {
    FontAwesomeIcon,
  },
};
</script>

<style lang="scss" scoped>
.incompleteAlert {
  padding: 15px 15px 10px 15px;
  margin-bottom: 15px;
  border: 1px solid transparent;
  border-radius: 1px;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  border-radius: 8px;
  color: #3cb054;
  background-color: #ffffff;
  border-color: #faebcc;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}
</style>
