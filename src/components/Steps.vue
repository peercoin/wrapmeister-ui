<template>
  <div class="helpinfo mx-4">
    <div class="row">
      <div class="col-12 my-2">
        <p
          class="explaintx"
          :class="{
            currentstep: step === 1,
          }"
        >
          1. Enter the amount of peercoins you want to wrap. You must deposit
          the full amount!
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-12 my-2">
        <p
          class="explaintx"
          :class="{
            currentstep: step === 2,
          }"
        >
          2. Send the said amount of peercoins to the deposit Peercoin address
          within 1 hour.
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-12 my-2">
        <p
          class="explaintx"
          :class="{
            currentstep: step === 3,
          }"
        >
          3. Wait for the transaction to be confirmed.
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-12 my-2">
        <p
          class="explaintx"
          :class="{
            currentstep: step === 4,
          }"
        >
          4. Wait for witnesses to verify your deposit transaction. This process
          may take a while as some witnesses may wait for six confirmations or
          more. You can return to this session any time to view your progress.
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-12 my-2">
        <p
          class="explaintx"
          :class="{
            currentstep: step === 5,
          }"
        >
          5. Proceed to MetaMask extension to mint your wPPC tokens.
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-12 my-2">
        <p
          class="explaintx"
          :class="{
            currentstep: step === 6,
          }"
        >
          6. Wrapping is completed. Find your tokens in the MetaMask wallet.
          This session will soon be deleted.
        </p>
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
.helpinfo {
  padding: 15px;
  margin-bottom: 20px;
  border: 0x solid transparent;
  border-radius: 10px;
  color: #fff;
  background-color: #3cb054;
  border-color: #faebcc;
}

.helpbg {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 10px 5px 20px 7px;
}
.bullet {
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  line-height: 35px;

  color: #3cb054;
}
.explaintx {
  // padding-top: 9px;
  // padding-left: 4px;
  font-family: "Roboto", sans-serif;
  // font-style: normal;
  // font-weight: normal;
  // font-size: 14px;
  // line-height: 14px;
  font-weight: bold;
  color: #fff;
}
.currentstep {
  font-weight: bold;
}
</style>
