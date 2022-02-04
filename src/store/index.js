import { createStore } from "vuex";

const state = {
  network: "",
  account: "",
  warrantyhide: false
};

const mutations = {
  setNetwork(state, n) {
    state.network = n;
  },

  setAccount(state, n) {
    state.account = n;
  },

  setWarrantySeen(state, n) {
    state.warrantyhide = n;
  },
};

export default createStore({
  state,
  mutations,
});
