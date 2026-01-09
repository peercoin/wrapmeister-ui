<template>
  <wrap-header />
  <div class="wrapview">
    <div class="container mb-3">
      <div class="row my-3 mx-1">
        <div col-12>
          <div class="greenwrapcontainer">
            <div class="row gx-0">
              <div class="col-3 text-start">
                <arrow-left @click.stop="gotoHome" />
              </div>
              <div class="col-6 fw-bold">
                UNWRAP PEERCOIN
              </div>
              <div class="col-3 text-end"></div>
            </div>

            <div class="container">
              <div class="row gx-5 my-1">
                <div class="col-12"></div>

                <unwrap-peercoin
                  :propsaccounts="selectedAccount"
                  :propnetwork="propnetwork"
                  :on-burn-tokens="burnTokens"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UnwrapPeercoin from "@/components/UnwrapPeercoin.vue";
import WrapHeader from "@/components/WrapHeader.vue";
import ArrowLeft from "@/components/ArrowLeft.vue";
import { getContractAddress, getNetworks } from "@/Endpoints.js";
import Web3 from "web3";
import ABI from "@/abi/erc20.json";

//this view is to show the unwrap form
export default {
  components: {
    UnwrapPeercoin,
    WrapHeader,
    ArrowLeft,
  },

  props: {
    propsaccounts: Array,
    propnetwork: String, //fallback
  },

  created() {
    this.eventBus.on("goto-home", this.gotoHome);
  },

  async mounted() {
    //set a default network if empty, aka user refreshes page:
    if (!this.$store.state.network) {
      const networks = getNetworks().filter((nw) => nw.active);

      if (!!networks && networks.length > 0) {
        if (!!this.propnetwork) {
          // fallback 1: querystring
          let nw = this.propnetwork || "";
          const ne = networks.find((n) => n.key === nw);

          if (!!ne) {
            this.$store.commit("setNetwork", ne.key);
          }
        } else {
          // fallback 2: pick first
          const network = networks[0].key;

          this.$store.commit("setNetwork", network);
        }
      }
    }

    //set vuex account if empty, aka user refreshes page:
    if (!this.$store.state.account) {
      //fallback 1: querystring
      if (Array.isArray(this.propsaccounts) && this.propsaccounts.length > 0) {
        this.$store.commit("setAccount", this.propsaccounts[0]);
      }
      //fallback 2: ask metamask again and take first:
      else if (!!window.ethereum) {
        await ethereum.request({
          method: "eth_requestAccounts",
        });
        try {
          const accounts = await this.getAccounts();

          this.$store.commit("setAccount", accounts[0]);
        } catch (error) {
          console.log(error);
        }
      }
    }

    const accounts = await this.getAccounts();
    if (
      !this.$store.state.account ||
      !accounts.includes(this.$store.state.account)
    ) {
      this.$store.commit("setAccount", "");
      console.warn("not allowed!!!!!!!!!!!!!");

      this.gotoHome();
      return;
    }
  },

  beforeUnmount() {
    this.eventBus.off("goto-home", this.gotoHome);
  },

  methods: {
    async getAccounts() {
      if (window.ethereum) {
        try {
          await ethereum.request({
            method: "eth_requestAccounts",
          });

          const web3 = new Web3(ethereum);
          return await web3.eth.getAccounts();
        } catch (error) {
          console.log(error);
        }
      }

      return [];
    },

    async burnTokens({ session, destinationPPCAddress, amount }) {
      if (!window.ethereum) {
        this.eventBus.emit("add-toastr", {
          text: "MetaMask is required to burn tokens",
          type: "error",
        });
        return false;
      }

      if (
        !session ||
        !session.amount ||
        !session.network ||
        !destinationPPCAddress
      ) {
        this.eventBus.emit("add-toastr", {
          text: "Missing unwrap details",
          type: "error",
        });
        return false;
      }

      const contractAddress = getContractAddress(session.network);
      if (!contractAddress) {
        this.eventBus.emit("add-toastr", {
          text: `No contract address found for network ${session.network}`,
          type: "error",
        });
        return false;
      }

      const fromAddress = session.ERC20Address || this.$store.state.account;
      if (!fromAddress) {
        this.eventBus.emit("add-toastr", {
          text: "No connected account found in MetaMask",
          type: "error",
        });
        return false;
      }

      const displayAmount = amount || session.amount;

      try {
        await ethereum.request({
          method: "eth_requestAccounts",
        });

        const web3 = new Web3(ethereum);
        const contract = new web3.eth.Contract(ABI, contractAddress, {
          from: fromAddress,
        });

        await contract.methods
          .burnTokens(session.amount * 10 ** 6, destinationPPCAddress)
          .send();

        this.eventBus.emit("add-toastr", {
          text:
            "Successfully burned " +
            displayAmount +
            " wPPC. Please be patient as your Peercoins are unwrapped. This process can take up to 24 hours.",
          type: "success",
        });

        this.gotoHome();
        return true;
      } catch (error) {
        console.log(error);
        this.eventBus.emit("add-toastr", {
          text: "Unable to burn tokens",
          type: "error",
        });
        return false;
      }
    },

    gotoHome() {
      if (!!this.$store.state.account) {
        this.$router.push({
          name: "HomeAccount",
          params: {
            selectedaccount: [this.$store.state.account],
          },
        });
      } else {
        this.$router.push({
          name: "Home",
        });
      }
    },
  },

  ///////////////COMPUTED/////////////////////////////////
  computed: {
    //returns a array with selected account
    selectedAccount() {
      if (!!this.$store.state.account) {
        return [this.$store.state.account];
      }
      return [];
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapview {
  min-height: 550px;
}
.greenwrapcontainer {
  padding: 15px;
  margin-bottom: 20px;
  border: 0x solid transparent;
  border-radius: 10px;

  color: #fff;
  background-color: #3cb054;
  border-color: #faebcc;
}
.headericon {
  color: #fff;
  &:hover {
    cursor: pointer;
    position: relative;
    top: -2px;
  }
}
</style>
