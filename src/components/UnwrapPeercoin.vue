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
          v-model="erc20Address"
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
          v-model="destinationETHAdress"
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
          >Convert Peercoin Tokens</m-button
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
import Web3 from "web3";
import ABI from "@/abi/erc20.json";
import BaseWrapper from "./BaseWrapper.js";

export default {
  extends: BaseWrapper,
  data() {
    return {
      erc20Address: ""
    };
  },

  mounted() {
    this.requestId = this.newId();
    this.networks = getNetworks().filter((nw) => nw.active);
  },

  computed: {
    validForm() {
      return this.validAmount && this.validPPCAddress && !!this.network;
    },
  },

  methods: {
    onModalConfirm() {
      if (!this.comfirmedProceedMetaMask) {
        this.popupModal = false;
        this.comfirmedProceedMetaMask = true;
        this.unwrap();
      }
    },

    async enableMetaMaskConfirmationModal() {
      this.popupModal = true;
    },

    async burnTokens() {
      this.accounts = await this.getAccounts();

      if (!this.accounts || this.accounts.length < 1) {
        return;
      }

      const contractAddress = getContractAddress(this.session.network);
      if (!contractAddress) {
        return console.error("No contract address found for network: " + this.session.network);
      }
      
      try {
        const contract = new this.web3.eth.Contract(ABI, contractAddress, {
          from: this.session.ERC20Address,
        });
        
        let signature = JSON.parse(this.session.unwrapSignature);
        const decimals = await contract.methods.decimals().call();

        const result = await contract.methods.burnTokens(
          this.session.amount * (10 ** decimals), 
          this.session.unwrapNonce, 
          signature.v, 
          signature.r, 
          signature.s
        ).send();

        axios.post(this.endpoints().confirmBurn, null, {
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
          PPCAddress: this.destintionPPCAdress,
          ERC20Address: this.erc20Address,
        },
      });

      if (!!response && !!response && !!response.data && !!response.data.data && !!response.data.data._id) {
        const success = !!response && !!response.data && !!response.data.message;

        this.eventBus.emit("add-toastr", {
          text: success ? response.data.message : `Unable to unwrap`,
          type: success ? "success" : "error",
        });

        this.session = response.data.data;
        this.burnTokens();
      }
    }
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
