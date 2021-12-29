<template>
  <div class="helpbg">
    <div class="row">
      <div class="col-2">
        <p class="bullet">1.</p>
      </div>
      <div class="col-10 text-start">
        <p
          :class="{
            explaintx: true,
            currentstep: step === 1,
          }"
        >
          Enter amount of peercoins you want wrapped
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <p class="bullet">2.</p>
      </div>
      <div class="col-10 text-start">
        <p
          :class="{
            explaintx: true,
            currentstep: step === 2,
          }"
        >
          Send the said amount of peercoins to the deposit Peercoin address within 1
          hour.
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <p class="bullet">3.</p>
      </div>
      <div class="col-10 text-start">
        <p
          :class="{
            explaintx: true,
            currentstep: step === 3,
          }"
        >
          Wait for the transaction to be confirmed.
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <p class="bullet">4.</p>
      </div>
      <div class="col-10 text-start">
        <p
          :class="{
            explaintx: true,
            currentstep: step === 4,
          }"
        >
          Wait for witnesses to verify your deposit transaction. This
          process may take a while as some witnesses may wait for six confirmations or more. You can come
          back to this session any time to see how the progress.
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <p class="bullet">5.</p>
      </div>
      <div class="col-10 text-start">
        <p class="explaintx">Proceed to MetaMask extension to mint your wPPC tokens.</p>
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <p class="bullet">6.</p>
      </div>
      <div class="col-10 text-start">
        <p class="explaintx">Wrappping is completed. Find your tokens in the MetaMask wallet. This session will soon be deleted.</p>
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
};
</script>

<style lang="scss" scoped>
.helpbg {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 10px 5px 20px 7px;
}
.bullet {
  font-family: "Red Hat Text", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  line-height: 35px;

  color: #3cb054;
}
.explaintx {
  padding-top: 9px;
  padding-left: 4px;
  font-family: "Red Hat Text", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;

  color: #000000;
}
.currentstep {
  color: #3cb054;
}
</style>
