<template><!-- shows a explainer on the left page side, NOT USED FOR NOW -->
  <h3 class="explain-title">01</h3>
  <p>Tokenize Peercoins on ETH</p>
  <h3 class="explain-title">02</h3>
  <p>Send said amount of Peercoins to generated address</p>
  <h3 class="explain-title">03</h3>
  <p>Withdraw tokens of said amount from ETH smart contract</p>
  <hr class="hr-text" data-content="OR" />
  <h3 class="explain-title">04</h3>
  <p>Convert Tokens back to Peercoin</p>
  <h3 class="explain-title">05</h3>
  <p>Release Peercoins on the ETH smart contract with given signature???</p>
  <h3 class="explain-title">06</h3>
  <p>Claim Peercoins with given transactionhash</p>
</template>

<style lang="scss" scoped>
.explain-title {
  text-align: left;
  font-weight: 900;
  color: #4d4d4d;
  font-size: 1.5rem;
  line-height: 1.4;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    width: 50px;
    height: 5px;
    left: 0;
    bottom: -10px;
    background-color: #3cb054;
  }
}

.hr-text {
  line-height: 1em;
  position: relative;
  outline: 0;
  border: 0;
  color: black;
  text-align: center;
  height: 1.5em;
  opacity: 0.5;
  &:before {
    content: "";
    // use the linear-gradient for the fading effect
    // use a solid background color for a solid bar
    background: linear-gradient(to right, transparent, #818078, transparent);
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
  }
  &:after {
    content: attr(data-content);
    position: relative;
    display: inline-block;
    color: black;

    padding: 0 0.5em;
    line-height: 1.5em;
    // this is really the only tricky part, you need to specify the background color of the container element...
    color: #818078;
    background-color: #fcfcfa;
  }
}
</style>
