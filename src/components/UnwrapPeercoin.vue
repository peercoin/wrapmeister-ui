<template>
  <div class="wrap-container">
    <modal
      v-if="popupModal"
      @modalconfirm="onModalConfirm"
      @modalclose="onModalClose"
      body="Proceed with MetaMask?"
    ></modal>
    <div class="wrap-container-heading">{{ header }}</div>
    <row>
      <column :lg="12" :xl="6">
        <p>Choose network to bridge</p>
      </column>
      <column :lg="12" :xl="6" class="margin-auto">
        <select
          :class="{ 'row-input-field': true, invalid: !network }"
          v-model="network"
        >
          <option v-for="item in networks" :value="item.key" :key="item.key">
            {{ item.description }}
          </option>
        </select>
      </column>
    </row>
    <row>
      <column :lg="12" :xl="6">
        <p>ERC20 Address</p>
      </column>
      <column :lg="12" :xl="6" class="margin-auto">
        <input
          type="text"
          :class="{ 'row-input-field': true, invalid: !validETHAddress }"
          v-model="destinationETHAddress"
        />
      </column>
    </row>
    <row>
      <column :lg="12" :xl="6">
        <p>Peercoin Address</p>
      </column>
      <column :lg="12" :xl="6" class="margin-auto">
        <input
          type="text"
          :class="{ 'row-input-field': true, invalid: !validPPCAddress }"
          v-model="destinationPPCAddress"
        />
      </column>
    </row>
    <row>
      <column :lg="12" :xl="6">
        <p>Amount</p>
      </column>
      <column :lg="12" :xl="6" class="margin-auto">
        <input
          type="text"
          :class="{ 'row-input-field': true, invalid: !validAmount }"
          v-model="amount"
        />
      </column>
    </row>
    <row v-if="!comfirmedProceedMetaMask">
      <column :lg="12" :xl="12" class="margin-auto m-top-lg">
        <m-button
          class="m-top-sm"
          type="success"
          @mbclick="enableMetaMaskConfirmationModal"
          :disabled="!validForm"
          >Redeem wrapped Peercoin</m-button
        >
      </column>
    </row>
  </div>
</template>

<script>
import axios from "axios";
import MButton from "@/components/Button.vue";
import { getNetworks, getContractAddress } from "@/Endpoints.js";
import Modal from "@/components/Modal.vue";
import ABI from "@/abi/erc20.json";
import BaseWrapper from "@/components/BaseWrapper.vue";

export default {
  extends: BaseWrapper,

  data() {
    return {
      erc20Address: "",
    };
  },

  mounted() {
    this.requestId = this.newId();
    this.networks = getNetworks().filter((nw) => nw.active);
    if (!!this.networks && this.networks.length > 0) {
      this.network = this.networks[0].key;
    }
  },

  computed: {
    header() {
      return "Unwrap Peercoin";
    },

    validForm() {
      return this.validAmount && this.validPPCAddress && !!this.network;
    },
  },

  methods: {
    async onModalConfirm() {
      if (!this.comfirmedProceedMetaMask) {
        this.popupModal = false;
        this.comfirmedProceedMetaMask = true;
        await this.unwrap();
      }
    },

    enableMetaMaskConfirmationModal() {
      this.popupModal = true;
    },

    async burnTokens() {
      this.accounts = await this.getAccounts();

      if (!this.accounts || this.accounts.length < 1) {
        return;
      }

      const contractAddress = getContractAddress(this.session.network);
      if (!contractAddress) {
        return console.error(
          "No contract address found for network: " + this.session.network
        );
      }

      try {
        const contract = new this.web3.eth.Contract(ABI, contractAddress, {
          from: this.session.ERC20Address,
        });

        let signature = JSON.parse(this.session.unwrapSignature);
        const decimals = await contract.methods.decimals().call();

        const result = await contract.methods
          .burnTokens(
            this.session.amount * 10 ** decimals,
            this.session.unwrapNonce,
            signature.v,
            signature.r,
            signature.s
          )
          .send();

        await axios.post(this.endpoints().confirmBurn, null, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
            network: this.network,
          },
          params: {
            txid: result.transactionHash,
            address: this.erc20Address,
          },
        });

        this.resetSession();
        this.gotoHome("Successfully burned " + this.amount + " WPPC");
      } catch (e) {
        console.log(e);
      }
    },

    async unwrap() {
      let response = await axios.post(this.endpoints().unwrap, null, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
          network: this.network,
          "Idempotency-Key": this.requestId,
        },
        params: {
          amount: this.amount,
          PPCAddress: this.destinationPPCAddress,
          ERC20Address: this.destinationETHAddress,
        },
      });

      if (
        !!response &&
        !!response &&
        !!response.data &&
        !!response.data.data &&
        !!response.data.data._id
      ) {
        const success =
          !!response && !!response.data && !!response.data.message;

        this.eventBus.emit("add-toastr", {
          text: success ? response.data.message : `Unable to unwrap`,
          type: success ? "success" : "error",
        });

        this.session = response.data.data;
        await this.burnTokens();
      }
    },
  },

  components: {
    MButton,
    Modal,
  },
};
</script>

<style lang="scss" scoped>
.wrap-container {
  padding: 20px 12px 10px 20px;
  margin: auto;
  width: 50%;
}
.wrap-container-heading {
  font-weight: bold;
  font-style: italic;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
  font-size: 15px;
  padding-bottom: 3px;
}
</style>
