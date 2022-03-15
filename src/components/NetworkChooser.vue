<template>
  <vue-multiselect
    class="dropdown-ppc-style"
    v-model="curSelected"
    label="network"
    track-by="network"
    :searchable="false"
    :options="availableNetworks"
    :option-height="104"
    placeholder="Select smart contract platform"
    selectLabel=""
    deselectLabel=""
    :show-labels="false"
    :allow-empty="false"
    @select="onOptionSelectChange"
  >
    <template v-slot:caret="slotProps">
      <span class="arrowcaret">
        <img
          alt="Peercoin"
          height="7"
          src="../assets/arrowdown.svg"
          @mousedown.prevent.stop="slotProps.toggle"
        />
      </span>
    </template>

    <template v-slot:singleLabel="slotProps">
      <img
        v-if="!!slotProps && !!slotProps.option && !!slotProps.option.img"
        class="option__image"
        :src="require(`@/assets/${slotProps.option.img}`)"
      />

      <span class="option__desc">
        <span class="option__title">{{ slotProps.option.desc }}</span></span
      >
    </template>
    <template v-slot:option="slotProps">
      <div class="select__container">
        <div class="image">
          <img
            v-if="!!slotProps && !!slotProps.option && !!slotProps.option.img"
            class="option__image__select"
            :src="require(`@/assets/${slotProps.option.img}`)"
          />
        </div>
        <div class="option__desc__select">
          <span>{{ slotProps.option.desc }}</span>
        </div>
      </div>
    </template>
  </vue-multiselect>
</template>

<script>
import VueMultiselect from "vue-multiselect";
import { getNetworks } from "@/Endpoints.js";

export default {
  data() {
    return {
      options: [
        {
          network: "ETH_TESTNET",
          desc: "Ethereum (ETH) - Testnet",
          img: "ethereum-eth-logo.svg",
        },
        {
          network: "BSC_TESTNET",
          desc: "Binance Smart Chain (BSC) - Testnet",
          img: "binance-coin-bnb-logo.svg",
        },
        {
          network: "MATIC_TESTNET",
          desc: "Polygon (Matic) - Testnet",
          img: "polygon-matic-logo.svg",
        },
        {
          network: "ETH_MAINNET",
          desc: "Ethereum (ETH)",
          img: "ethereum-eth-logo.svg",
        },
        {
          network: "BSC_MAINNET",
          desc: "Binance Smart Chain (BSC)",
          img: "binance-coin-bnb-logo.svg",
        },
        {
          network: "MATIC_MAINNET",
          desc: "Polygon (Matic)",
          img: "polygon-matic-logo.svg",
        },
      ],
    };
  },

  computed: {
    curSelected: {
      get() {
        const network = this.$store.state.network;
        if (!!network) {
          const ne = this.options.find((nw) => nw.network === network);

          return ne;
        }
        return null;
      },
      set(_) {
        //handled in onOptionSelectChange
      },
    },

    availableNetworks() {
      if (!this.options) return [];
      const networks = getNetworks().filter((nw) => nw.active);

      return networks.map((network) => {
        return this.options.find((nw) => nw.network === network.key);
      });
    },
  },

  methods: {
    async onOptionSelectChange(newoption) {
      this.$store.commit("setNetwork", newoption.network);
      await this.switchEthereumChain(newoption.network);
    },

    async switchEthereumChain(network) { 
      if (!this.$store.state.account || !window.ethereum || !network) return;
      const ne = getNetworks().find((nw) => nw.key === network);
      if (!ne || !ne.chainId) return;

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ne.chainId }],
        });
      } catch (e) {
        if (
          e.code === 4902 &&
          !!ne.chainId &&
          !!ne.chainName &&
          !!ne.nativeCurrency &&
          !!ne.blockExplorerUrls &&
          !!ne.rpcUrls
        ) {
          //console.log("wallet_addEthereumChain");
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: ne.chainId,
                  chainName: ne.chainName,
                  nativeCurrency: ne.nativeCurrency,
                  blockExplorerUrls: ne.blockExplorerUrls,
                  rpcUrls: ne.rpcUrls,
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
        //console.error(e);
      }
    },
  },

  components: {
    VueMultiselect,
  },
};
</script>

<style lang="scss">
///////////////////////////////////////////////

.dropdown-ppc-style .multiselect__option {
  font-size: 14px;
  padding: 6px 12px;
  min-height: 20px;
  color: #2f2f2f;
  background-color: #3cb054;
}

.dropdown-ppc-style .multiselect__option--highlight {
  background-color: #ade2b7;
}

.dropdown-ppc-style .multiselect__option--disabled {
  background-color: #f0f0f0;
  border-bottom: solid 1px #ccc;
  color: #777;
  font-size: 12px;
  line-height: 1.428571429;
  white-space: nowrap;
  font-weight: bold;
}

.dropdown-ppc-style .multiselect-disabled,
.dropdown-ppc-style .multiselect {
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #555;
  font-size: 14px;
  min-height: 34px;
}

.dropdown-ppc-style .multiselect-disabled {
  margin-right: 6px;
}

.dropdown-ppc-style .multiselect-disabled .multiselect__tags {
  border-radius: 4px;
}

.dropdown-ppc-style .multiselect__select {
  padding-top: 0px;
}

.dropdown-ppc-style .multiselect-disabled .multiselect__select {
  background-color: #fff;
}

.dropdown-ppc-style .multiselect__single {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
}

.dropdown-ppc-style .multiselect__tag {
  color: #555;
  background: rgb(83, 3, 3);
  border: 1px solid #ccc;
  margin-bottom: 0px;
}

.dropdown-ppc-style .multiselect__tag-icon:hover {
  background: #cacaca;
}

.dropdown-ppc-style .multiselect__tags {
  padding-top: 5px;
  min-height: 34px;
}

.dropdown-ppc-style.multiselect-is-invalid .multiselect__tags {
  border-color: #a94442 !important;
}

.dropdown-ppc-style .multiselect--active {
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
  -webkit-transition: border-color ease-in-out 0.15s,
    box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  border-color: #66afe9;
}

.dropdown-ppc-style .multiselect__content-wrapper {
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  border-color: #66afe9;
  overflow-x: hidden;
  margin-top: -1px;
  margin-left: -1px;
  width: calc(100% + 2px);
}

.dropdown-ppc-style .multiselect__tags .multiselect__input {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
}

.dropdown-ppc-style .multiselect__tags .multiselect__placeholder {
  //color: $vue-multiselect-placeholder-color;
  display: inline-block;
  margin-bottom: 4px;
  padding-top: 0px;
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
}

.dropdown-ppc-style .multiselect__option--selected {
  background: #3cb054;
  color: #fff;
}

.dropdown-ppc-style
  .multiselect__option--selected.multiselect__option--highlight {
  background-color: #ade2b7;
}

.dropdown-ppc-style
  .multiselect__option--selected.multiselect__option--highlight:after {
  background-color: #ade2b7;
}

.dropdown-ppc-style
  .multiselect__option--group-selected.multiselect__option--highlight {
  background-color: #ade2b7;
}

.dropdown-ppc-style
  .multiselect__option--group-selected.multiselect__option--highlight:after {
  background-color: #ade2b7;
}
.dropdown-ppc-style .multiselect__placeholder {
  color: inherit;
  font-size: 16px;
  padding-left: 6px;
  padding-top: 0px;
}

.dropdown-ppc-style .multiselect__input,
.dropdown-ppc-style .multiselect__single {
  // position: relative;
  // display: inline-block;
  // min-height: 20px;
  // line-height: 20px;
  // border: none;
  // border-radius: 5px;
  background: #3cb054;
  // padding: 0 0 0 5px;
  // width: calc(100%);
  // transition: border 0.1s ease;
  // box-sizing: border-box;
  // margin-bottom: 8px;
  // vertical-align: top;
}
.dropdown-ppc-style .multiselect__tags {
  // min-height: 40px;
  // display: block;
  // padding: 8px 40px 0 8px;
  //border-radius: 5px;
  border: 1px solid #e8e8e8;
  background: #3cb054;
  //font-size: 14px;
}
.dropdown-ppc-style span.option__title {
  color: #fff;
  //background-color: #061988;
}
</style>

<style lang="scss" scoped>
.arrowcaret {
  position: absolute;
  width: 40px;
  height: 38px;
  right: 1px;
  top: 1px;
  padding: 4px 8px;
  text-align: center;
  transition: transform 0.2s ease;
}
.option__image {
  height: 21px;
  padding-right: 7px;
}

.select__container {
  display: flex;
  align-items: left;
}
.option__image__select {
  max-height: 25px;
  max-width: 25px;
}
.image {
  flex-basis: 31px;
}
.option__title__select {
  font-size: 20px;
}
.option__desc__select {
  padding-top: 5px;
  text-align: left;
  width: 100%;
  color: #fff;
  //background-color: #7c2d14;
}
//multiselect__option--highlight multiselect__option--selected multiselect__option
</style>
