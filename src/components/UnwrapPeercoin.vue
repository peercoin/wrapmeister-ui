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
          :class="{ 'row-input-field': true, invalid: !validERC20Address }"
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
          :class="{ 'row-input-field': true, invalid: !validAddress }"
          v-model="destinationAddress"
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
          @mbclick="confirmMetaMaskStuff"
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
import { wrapEndpoints, getNetworks, getContractAddress } from "@/Endpoints.js";
import { validate } from "wallet-address-validator";
import Modal from "@/components/Modal.vue";
import Web3 from "web3";
import ABI from "@/abi/erc20.json";

export default {
  data() {
    return {
      popupModal: false,
      comfirmedProceedMetaMask: false,
      accounts: [],
      web3: null,
      requestId: null,
      amount: "",
      erc20Address: "", //0x5e9560b6DC421E3Dd6021de4a4094be8517F7E34",
      destinationAddress: "", // "mjyx4qZLNpmuWEGdghHDuzpD5Ysy4zKitS",
      network: "",
      endpoints: wrapEndpoints,
      networks: [],
      unwrapSignedMessage: "",
    };
  },

  mounted() {
    this.requestId = this.newId();
    this.networks = getNetworks().filter((nw) => nw.active);
  },

  computed: {
    header() {
      return "Bridge Peercoin";
    },

    validERC20Address() {
      if (!!this.network && this.network.indexOf("TEST") != 0) {
        return validate(this.erc20Address, "ETH", "both");
      }
      return validate(this.erc20Address, "ETH");
    },

    validAddress() {
      if (!!this.destinationAddress) {
        if (!!this.network && this.network.indexOf("TEST") != 0) {
          return validate(this.destinationAddress, "PPC", "both");
        }
        return validate(this.destinationAddress, "PPC");
      }
      return false;
    },

    validAmount() {
      if (!this.amount) return false;

      const regex = /^\d{0,9}(\.\d{0,6})?$/gm;

      if (!regex.test(this.amount)) return false;

      let n = parseFloat(this.amount);

      return typeof n == "number" && !isNaN(n) && isFinite(n) && n > 0;
    },
    validForm() {
      return this.validAmount && this.validAddress && !!this.network;
    },
  },

  methods: {
    newId() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },

    gotoHome(message) {
      this.eventBus.emit("add-toastr", {
        text: message,
        type: "success",
      });

      this.eventBus.emit("goto-home", {});
    },

    onModalConfirm() {
      if (!this.comfirmedProceedMetaMask) {
        this.popupModal = false;
        this.comfirmedProceedMetaMask = true;
        this.doMetaMaskStuff();
      }
    },

    onModalClose() {
      this.popupModal = false;
    },

    async confirmMetaMaskStuff() {
      this.popupModal = true;
    },

    async doMetaMaskStuff() {
      //todo
    },

    async getAccounts() {
      if (window.ethereum) {
        try {
          if (!!this.accounts && this.accounts.length > 0) {
            return this.accounts;
          }
          await ethereum.request({
            method: "eth_requestAccounts",
          });

          this.web3 = new Web3(ethereum);
          const accounts = await this.web3.eth.getAccounts();
          return accounts;
        } catch (error) {
          console.log("getAccounts");
          console.log(error);
        }
      }
      return [];
    },

    //unwrap:
    async sendBurnTransaction() {
      //if (!!this.unwrapBurnTokensTransactionHash) return;

      this.accounts = await this.getAccounts();

      if (
        !this.accounts ||
        this.accounts.length < 1
        //add other requirements...
      )
        return;

      const optionsContract = {
        from: "this.session.erc20Address",
      };

      //https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
      const contractInstance = new this.web3.eth.Contract(
        ABI,
        this.contractAddress,
        optionsContract
      );
      let signatureJson = ""; //from metamask?
      let amount = 12.34;
      let nonce = 42;
      try {
        // burnTokens is from erc20.json ABI file
        let signature = JSON.parse(signatureJson);
        const result = await contractInstance.methods
          .burnTokens(amount, nonce, signature.v, signature.r, signature.s)
          .send();

        this.unwrapBurnTokensTransactionHash = result.transactionHash;
        console.log(
          "unwrapBurnTokensTransactionHash: " +
            this.unwrapBurnTokensTransactionHash
        );

        //Frontend packs up burn transaction hash, amount, and destination address (Peercoin)
        // into a message and sends it to Metamask extension to be signed.

        //sign

        //submitUnWrap
      } catch (e) {
        console.log(e);
      }
    },

    async signUnwrapBurnTokensTransactionHash() {
      // if (!this.unwrapBurnTokensTransactionHash || !this.session.erc20Address)
      //   return;

      try {
        let signResult = await this.web3.eth.sign(
          "this.unwrapBurnTokensTransactionHash",
          "this.session.erc20Address"
        );

        console.log(signResult);
        this.unwrapSignedMessage = signResult;
      } catch (e) {
        console.log(e);
      }
    },

    async submitUnWrap() {
      let nb = parseFloat(this.amount);
      const data = {
        amount: nb,
        destinationAddress: "this.destinationAddress", //valid Peercoinaddress!
        erc20Address: " this.erc20Address",
        //unwrapBurnTokensTransactionHash
      };
      const config = {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
          network: this.network,
          "Idempotency-Key": this.requestId,
        },
        params: data,
      };

      let response = await axios.post(this.endpoints().unwrap, null, config);
      console.log(response);
      if (
        (!!response && !!response.error) ||
        !(
          !!response &&
          !!response.data &&
          !!response.data.data &&
          !!response.data.data._id
        )
      ) {
        this.eventBus.emit("add-toastr", {
          text:
            !!response && !!response.data && !!response.data.message
              ? response.data.message
              : `Unable to unwrap`,
          type: "error",
        });
        return;
      } else {
        //gotoHome
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
