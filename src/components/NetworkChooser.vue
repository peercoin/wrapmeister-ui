<template>
  <vue-multiselect
    v-model="curSelected"
    label="network"
    track-by="network"
    :options="availableNetworks"
    :option-height="104"
    placeholder="Select smart contract platform"
    selectLabel=""
    deselectLabel=""
    :show-labels="false"
    :allow-empty="false"
    @select="onOptionSelectChange"
  >
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
import { getNetworks, getContractAddress } from "@/Endpoints.js";

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
        let network = this.$store.state.network;
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
    onOptionSelectChange: function(newoption) {
      this.$store.commit("setNetwork", newoption.network);
    },
  },

  components: {
    VueMultiselect,
  },
};
</script>

<style lang="scss" scoped>
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
}
</style>
