<template>
  <div class="row">
    <div class="col-12">
      <ul id="progressbar">
        <li :class="{ active: step >= 1 }">Enter amount</li>
        <li :class="{ active: step >= 2 }">Send amount</li>
        <li :class="{ active: step >= 3 }">Wait for confirmations</li>
        <li :class="{ active: step >= 4 }">Wait for witnesses</li>
        <li :class="{ active: step >= 5 }">Proceed to MetaMask</li>
        <li :class="{ active: step >= 6 }">Completed</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    iswrapping: Boolean,
    step: Number,
  },
};
</script>

<style lang="scss" scoped>
#progressbar {
  margin-bottom: 30px;
  overflow: hidden;
  /*CSS counters to number the steps*/
  counter-reset: step;
}
#progressbar li {
  list-style-type: none;
  color: white;
  text-transform: uppercase;
  font-size: 9px;
  width: 16.66666%;
  float: left;
  position: relative;
}
#progressbar li:before {
  content: counter(step);
  counter-increment: step;
  width: 54px;
  line-height: 54px;
  display: block;
  font-size: 28px;
  color: #03914F;
  background: white;
  border-radius: 9px;
  margin: 0 auto 5px auto;
}
/*progressbar connectors*/
#progressbar li:after {
  content: "";
  width: 100%;
  height: 2px;
  background: white;
  position: absolute;
  left: -50%;
  top: 25px;
  z-index: -1; /*put it behind the numbers*/
}
#progressbar li:first-child:after {
  /*connector not needed before the first step*/
  content: none;
}
/*marking active/completed steps green*/
/*The number of the step and the connector before it = green*/
#progressbar li.active:before,
#progressbar li.active:after {
  background: #03914f;
  color: white;
}
</style>
