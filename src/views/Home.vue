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
        <span class="page-title">Token bridge</span>
      </column>
    </row>

    <row :gutter="50">
      <column :xs="12" :lg="3">
        <div class="body-column">
          <steps />
        </div>
      </column>
      <column :xs="12" :lg="9">
        <div class="body-column">
          <collapse-transition>
            <div v-if="!currentSessionId">
              <p v-if="!enteringSession">
                <m-button size="max" type="success"
                  >Peercoin to token on ETH</m-button
                >
              </p>
              <p v-if="!enteringSession">
                <m-button size="max" type="success"
                  >Token on ETH to Peercoin</m-button
                >
              </p>
              <p>
                <m-button size="max" type="success" @mbclick="test"
                  >I have a sessionId</m-button
                >
              </p>

              <collapse-transition>
                <div v-if="enteringSession" class="form-group">
                  <input
                    type="text"
                    placeholder="Enter sessionId"
                    v-model="sessionId"
                  />
                  &nbsp;
                  <m-button
                    type="success"
                    size="mini"
                    @mbclick="onSessionEntered"
                    :disabled="!sessionId"
                    >View session</m-button
                  >
                </div>
              </collapse-transition>
            </div>
          </collapse-transition>

          <session v-if="inSession" :sessionId="currentSessionId" />
        </div>
      </column>
    </row>
  </div>
</template>

<script>
// @ is an alias to /src
import MButton from "@/components/Button.vue";
import Steps from "@/components/Steps.vue";
import Session from "@/components/Session.vue";
import CollapseTransition from "@/components/CollapseTransition.vue";
 
export default {
  name: "Home",
  data() {
    return {
      enteringSession: false,
      sessionId: "",
    };
  },
  methods: {
    test() {
      console.log("now:" + new Date().getTime());
      console.warn("toggleEnterSession: ", this.enteringSession);
      this.enteringSession = !this.enteringSession;
    },
    gotoSession(id) {
      this.$router.push({
        name: "Session",
        params: { id: id },
      });
    },
    toggleEnterSession() {
      this.enteringSession = !this.enteringSession;
    },
    onSessionEntered() {
      if (!this.sessionId) return;
      this.gotoSession(this.sessionId);
      this.enteringSession = false;
    },
  },
  
  computed: {
    inSession() {
      return !!this.$route.params.id;
    },
    currentSessionId() {
      if (this.enteringSession) return "";

      return this.sessionId || this.$route.params.id;
    },
  },

  components: {
    MButton,
    Steps,
    Session,
    CollapseTransition,
  },
};
</script>
<style lang="scss" scoped>
.body-column {
  padding: 25px;
  background-color: rgba(255, 255, 255, 0.85);
  min-height: 300px;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.7;
}
.page-title{
  color :antiquewhite;
  font-size: 50px;
  margin-left: 25px;
}
.form-group {
  overflow: hidden;
  clear: both;
}
</style>
