<template>
  <div class="home">
    <row :gutter="12">
      <column> </column>
      <column> </column>
      <column> </column>
    </row>
    <row :gutter="12">
      <column :md="8" :mdOffset="2" :lg="6" :lgOffset="3">
        <img alt="Vue logo" height="75" src="../assets/logo-white.svg" />
      </column>
    </row>

    <row :gutter="50">
      <column :xs="12" :lg="3">
        <div class="body-column">
          <h3 class="explain-title">01</h3>
          <p>Convert Peercoins to token on ETH</p>
          <h3 class="explain-title">02</h3>
          <p>Send Peercoins to generated address</p>
          <h3 class="explain-title">03</h3>
          <p>Claim Tokens on the ETH smart contract with given signature???</p>
          <hr class="hr-text" data-content="OR" />
          <h3 class="explain-title">04</h3>
          <p>Convert Tokens back to Peercoin</p>
          <h3 class="explain-title">05</h3>
          <p>Release Peercoins on the ETH smart contract with given signature???</p>
          <h3 class="explain-title">06</h3>
          <p>Claim Peercoins with given transactionhash</p>
        </div>
      </column>
      <column :xs="12" :lg="9">
        <div class="body-column">
          <p>
            <m-button size="max" type="success"
              >Peercoin to token on ETH</m-button
            >
          </p>
          <p>
            <m-button size="max" type="success"
              >Token on ETH to Peercoin</m-button
            >
          </p>
          <p>
            <m-button size="max" type="success">I have a sessionId</m-button>
          </p>
        </div>
      </column>
    </row>
  </div>
</template>

<script>
// @ is an alias to /src
import MButton from "@/components/Button.vue";
import MButtonGroup from "@/components/ButtonGroup.vue";

export default {
  name: "Home",
  components: {
    MButton,
    MButtonGroup,
  },
};
</script>
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

.body-column {
  padding: 25px;
  background-color: rgba(255, 255, 255, 0.85);
  min-height: 300px;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.7;
}
</style>
