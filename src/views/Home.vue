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
          left
        </div>
      </column>
      <column :xs="12" :lg="9">
        <div class="body-column">
          <TokenRequestForm />
        </div>
      </column>
    </row>
  </div>
</template>

<script>
// @ is an alias to /src
import TokenRequestForm from "@/components/TokenRequestForm.vue";

export default {
  name: "Home",
  components: {
    TokenRequestForm,
  },
};
</script>
<style lang="scss" scoped>
.body-column {
  background-color: rgba(255, 255, 255, 0.75);

  border-radius: 25px;
}
</style>
