import { createStore } from "vuex";

const state = {
  network: "",
};

const mutations = {
  setNetwork(state, n) {
    state.network = n;
  },
};

export default createStore({
  state,
  mutations,
});
