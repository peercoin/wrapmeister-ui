import { createStore } from "vuex";

const state = {
  network: "",
  account: ""
};

const mutations = {
  setNetwork(state, n) {
    state.network = n;
  },
  setAccount(state, n) {
    state.account = n;
  },
};

export default createStore({
  state,
  mutations,
});
