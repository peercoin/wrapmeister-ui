<template>
  <div class="d-sm-none">
    <div class="row g-0">
      <div class="col-12">
        <hr class="connect" />
        <ul id="progressbar">
          <li
            v-for="index in 6"
            :key="index"
            :class="{ active: step >= index }"
          ></li>
        </ul>

        <div class="outer">
          <div class="inner">
            <span class="explain">{{ currentStepText(step) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="d-none d-sm-block">
    <div class="row g-0">
      <div class="col-12">
        <hr class="connect" />
        <ul id="progressbar">
          <li
            v-for="index in 6"
            :key="index"
            :class="{ active: step >= index }"
          >
            {{ currentStepText(index) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    iswrapping: Boolean,
    step: Number,
  },

  methods: {
    currentStepText(stepid) {
      switch (stepid) {
        case 6:
          return "Completed";
        case 5:
          return "Mint wPPC";
        case 4:
          return "Wait for witnesses";
        case 3:
          return "Wait for confirmations";
        case 2:
          return "Send amount";
        default:
          return "Enter amount";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.inner {
  display: table;
  margin: 0 0 0 0;
  border: 0px solid black;
}

.outer {
  border: 0px solid red;
  width: 90%;
  position: relative;
  top: -38px;
  left: 20px;
}
.explain {
  font-weight: 600;
  font-size: 9px;
  color: #3cb054;
  text-transform: uppercase;
}
hr.connect {
  border: 1px solid #3cb054;
  border-radius: 5px;
  opacity: 1;
  width: 80%;
  position: relative;
  left: 9.9%;
  top: 39px;
}
#progressbar {
  margin-bottom: 30px;
  overflow: hidden;
  /*CSS counters to number the steps*/
  counter-reset: step;
  position: relative;
  left: -20px;
}
#progressbar li {
  list-style-type: none;
  color: #3cb054;
  text-transform: uppercase;
  font-size: 9px;
  width: 16.66666%;
  float: left;
  position: relative;
  font-weight: 500;
}
#progressbar li:before {
  content: counter(step);
  counter-increment: step;
  width: 44px;
  line-height: 44px;
  display: block;
  font-size: 22px;
  color: #3cb054;
  background: #e3f3e6;
  border-radius: 9px;
  margin: 0 auto 5px auto;
}

/*progressbar connectors*/
// #progressbar li:after {
//   content: "";
//   width: 70%;
//   height: 2px;
//   background: #3cb054;
//   position: absolute;
//   left: -38%;
//   top: 23px;
//   z-index: -1; /*put it behind the numbers*/
// }
// #progressbar li:first-child:after {
//   /*connector not needed before the first step*/
//   content: none;
// }

/*marking active/completed steps green*/
/*The number of the step and the connector before it = green*/
#progressbar li.active:before,
#progressbar li.active:after {
  background: #3cb054;
  color: white;
}
</style>
