<template>
  <div class="maincontainer">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Red+Hat+Text&display=swap");

#app {
  font-family: "Red Hat Text", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html {
  font-family: "Red Hat Text", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.7;
  -webkit-text-size-adjust: 100%;
  color: #4d4d4d;
  background-color: #3cb054;
}
body {
  font-size: 1.5rem;
  min-height: 800px;

  background: url("./assets/efficient-and-sustainable.svg") bottom left
    no-repeat;
  background-position: 15% 75%;
  background-size: 40%;
}
.maincontainer {
  margin-left: 85px;
  margin-right: 85px;
}
</style>
