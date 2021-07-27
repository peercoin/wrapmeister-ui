<template>
  <div>
    <modal
      v-if="popupModal"
      @modalconfirm="onModalConfirm"
      @modalclose="onModalClose"
      body="Proceed with MetaMask?"
    ></modal>
    <div class="session-container">
      <div class="session-container-heading">{{ sessionHeader }}</div>
      <countdown v-if="showProgressbar" :status="0.01 * countDown"></countdown>

      <row>
        <column :lg="12" :xl="6">
          <p>Network</p>
        </column>
        <column :lg="12" :xl="6" class="margin-auto">
          <input
            type="text"
            disabled="true"
            class="row-input-field"
            :value="mapNetworks(session.network)"
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
            disabled="true"
            class="row-input-field"
            :value="session.amount"
          />
        </column>
      </row>
      <row>
        <column :lg="12" :xl="6">
          <p>{{ peercoinAddressLabel }}</p>
        </column>
        <column :lg="12" :xl="6" class="margin-auto">
          <row>
            <vue-q-r-code-component
              class="margin-auto"
              v-if="!!session.ppcAddress && !!session.wrapping"
              :size="250"
              :text="session.ppcAddress"
            />
          </row>
          <row>
            <small class="margin-auto">{{ session.ppcAddress }}</small>
          </row>
        </column>
      </row>
      <row>
        <column :lg="12" :xl="6">
          <p>Peercoin transaction</p>
        </column>
        <column :lg="12" :xl="6" class="margin-auto">
          <input
            type="text"
            :disabled="1 == 1"
            class="row-input-field"
            placeholder="waiting for deposit..."
            :value="session.ppcTransactionHash"
          />
        </column>
      </row>
      <row>
        <column :lg="12" :xl="6">
          <p>ERC-20 address</p>
        </column>
        <column :lg="12" :xl="6" class="margin-auto">
          <row v-if="2 == 1">
            <vue-q-r-code-component
              class="margin-auto"
              :size="250"
              v-if="!!session.erc20Address"
              :text="session.erc20Address"
            />
          </row>
          <row>
            <small class="margin-auto">{{ session.erc20Address }}</small>
          </row>
        </column>
      </row>

      <row
        v-if="!session.wrapping && !!unwrapBurnTokensTransactionHash"
        class="transation-container"
      >
        <column :lg="12" :xl="6">
          <p>Burn tokens</p>
        </column>
        <column :lg="12" :xl="6" class="margin-auto">
          <row>
            <input
              type="text"
              disabled
              :placeholder="''"
              class="row-input-field"
              :value="unwrapBurnTokensTransactionHash"
            />
          </row>
          <row>
            <m-button
              class="m-top-sm margin-auto"
              v-if="!!session.wrapping"
              type="success"
              @mbclick="signUnwrapBurnTokensTransactionHash"
              :disabled="!unwrapBurnTokensTransactionHash"
              >Sign hash with MetaMask</m-button
            >
          </row>
        </column>
      </row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { setIntervalAsync } from "set-interval-async/fixed";
import { clearIntervalAsync } from "set-interval-async";
import { wrapEndpoints, getNetworks, getContractAddress } from "@/Endpoints.js";
import VueQRCodeComponent from "vue-qrcode-component";
import MButton from "@/components/Button.vue";
import Countdown from "@/components/Countdown.vue";
import Modal from "@/components/Modal.vue";
import Web3 from "web3";
import ABI from "@/abi/erc20.json";

export default {
  props: ["sessionId"],
  components: {
    VueQRCodeComponent,
    MButton,
    Countdown,
    Modal,
  },

  watch: {
    async sessionId(newval, oldVal) {
      if (newval !== oldVal) {
        await this.getSession(newval);
        this.countDown = 100;
      }
    },
  },

  data() {
    return {
      requestId: null,
      countDown: 100,
      countDownHandle: null,
      endpoints: wrapEndpoints,
      session: {
        _id: null,
        network: null,
        wrapping: true,
        amount: null,
        signed: false,
        signature: null,
        nonce: null,
        erc20Address: null,
        ppcAddress: null,
        completed: false,
        erc20TransactionHash: null,
        ppcTransactionHash: null,
      },

      wrapClaimtokensTransactionHash: "",
      unwrapBurnTokensTransactionHash: "",
      unwrapSignedMessage: "",
      accounts: [],
      web3: null,
      contractAddress: "",
      popupModal: false,
    };
  },

  async mounted() {
    this.resetSession();
    this.requestId = this.newId();
    clearInterval(this.countDownHandle);

    if (!!this.countDownHandle) {
      (async () => {
        await clearIntervalAsync(this.countDownHandle);
        this.countDownHandle = setIntervalAsync(this.onCountDown, 350);
      })();
    } else {
      this.countDownHandle = setIntervalAsync(this.onCountDown, 350);
    }

    await this.getSession(this.sessionId);
  },

  async unmounted() {
    if (!!this.countDownHandle) {
      (async () => {
        await clearIntervalAsync(this.countDownHandle);
      })();
    }
  },

  computed: {
    showProgressbar() {
      return (
        !!this.session &&
        !!this.session._id &&
        !this.session.signed &&
        this.session.wrapping
      );
    },

    completedIcon() {
      if (!!this.session && !!this.session._id && this.session.completed) {
        return "check-square";
      }
      return "times";
    },

    signedIcon() {
      if (!!this.session && !!this.session._id && this.session.signed) {
        return "check-square";
      }
      return "times";
    },

    peercoinAddressLabel() {
      return this.session.wrapping
        ? "Peercoin deposit address"
        : "Peercoin receive address";
    },

    sessionHeader() {
      if (!!this.session && !!this.session._id) {
        if (!!this.session.network) {
          if (this.session.wrapping) {
            return "Send Peercoin to " + this.mapNetworks(this.session.network);
          } else {
            return (
              "Get Peercoin from " + this.mapNetworks(this.session.network)
            );
          }
        }
      }

      return "No details available";
    },
  },

  methods: {
    resetSession() {
      this.accounts = [];
      this.wrapClaimtokensTransactionHash = "";
      this.unwrapBurnTokensTransactionHash = "";
      this.unwrapSignedMessage = "";
      this.popupModal = false;
      this.session = {
        _id: null,
        network: null,
        wrapping: true,
        amount: null,
        signed: false,
        signature: null,
        nonce: null,
        erc20Address: null,
        ppcAddress: null,
        completed: false,
        erc20TransactionHash: null,
        ppcTransactionHash: null,
      };
    },

    onModalConfirm() {
      if (this.session.signed) {
        this.popupModal = false;
        if (!!this.session.wrapping) {
          this.sendMinTransaction();
        } else {
          this.sendBurnTransaction();
        }
      }
    },

    onModalClose() {
      this.popupModal = false;
    },

    newId() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },

    async onCountDown() {
      if (this.showProgressbar) {
        this.countDown = this.countDown - 1;
        if (this.countDown < 0.001) {
          await this.getSession(this.session._id);
          this.countDown = 100;
        }
      }
    },

    mapNetworks(key) {
      let network = getNetworks().find((nw) => nw.key === key);
      return !!network ? network.description : key;
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
      if (!!this.unwrapBurnTokensTransactionHash) return;

      this.accounts = await this.getAccounts();
      if (
        !this.accounts ||
        this.accounts.length < 1 ||
        !this.session ||
        !this.session.signature ||
        !!this.session.wrapping ||
        !this.session.erc20Address ||
        !this.session.network ||
        !this.hasValidSignature()
      )
        return;

      const optionsContract = {
        from: this.session.erc20Address,
      };

      //https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
      const contractInstance = new this.web3.eth.Contract(
        ABI,
        this.contractAddress,
        optionsContract
      );

      try {
        // burnTokens is from erc20.json ABI file
        let signature = JSON.parse(this.session.signature);
        const result = await contractInstance.methods
          .burnTokens(
            this.session.amount,
            this.session.nonce,
            signature.v,
            signature.r,
            signature.s
          )
          .send();

        this.unwrapBurnTokensTransactionHash = result.transactionHash;
      } catch (e) {
        console.log(e);
      }
    },

    async signUnwrapBurnTokensTransactionHash() {
      if (!this.unwrapBurnTokensTransactionHash || !this.session.erc20Address)
        return;
      try {
        let signResult = await this.web3.eth.sign(
          this.unwrapBurnTokensTransactionHash,
          this.session.erc20Address
        );

        console.log(signResult);
        this.unwrapSignedMessage = signResult;
        await this.submitRetrievePeercoin();
      } catch (e) {
        console.log(e);
      }
    },

    hasValidSignature() {
      if (!!this.session && !!this.session.signed && !!this.session.signature) {
        try {
          let signature = JSON.parse(this.session.signature);
          return "v" in signature && "r" in signature && "s" in signature;
        } catch (error) {}
      }
      return false;
    },

    //wrap:
    async sendMinTransaction() {
      if (!!this.wrapClaimtokensTransactionHash) return;

      this.accounts = await this.getAccounts();
      if (
        !this.accounts ||
        this.accounts.length < 1 ||
        !this.session ||
        !this.session.signature ||
        !this.session.wrapping ||
        !this.session.erc20Address ||
        !this.session.network ||
        !this.hasValidSignature()
      )
        return;

      if (!this.contractAddress) {
        console.warn(
          "No contract address found for network: " + this.session.network
        );
        return;
      }

      const optionsContract = {
        from: this.session.erc20Address,
      };

      //https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
      const contractInstance = new this.web3.eth.Contract(
        ABI,
        this.contractAddress,
        optionsContract
      );

      try {
        let signature = JSON.parse(this.session.signature);

        //claimTokens is defined in @/abi/erc20.json
        const result = await contractInstance.methods
          .claimTokens(
            this.session.amount,
            this.session.nonce,
            this.session.erc20Address,
            signature.v,
            signature.r,
            signature.s
          )
          .send();

        this.wrapClaimtokensTransactionHash = result.transactionHash;

        this.resetSession();
        this.eventBus.emit("add-toastr", {
          text: `Tokenise Peercoin to ETH completed`,
          type: "success",
        });
        this.eventBus.emit("goto-home", {});
      } catch (e) {
        console.log("sendMinTransaction exception");
        console.log(e);
      }
    },

    // async signWrapClaimtokensTransactionHash() {
    //   if (!this.wrapClaimtokensTransactionHash || !this.session.erc20Address)
    //     return;

    //   try {
    //     const signResult = await this.web3.eth.sign(
    //       this.wrapClaimtokensTransactionHash,
    //       this.session.erc20Address
    //     );

    //     console.log(signResult);

    //     //wrapping done, as soon as Completed is retrieved this page wil automatically close.
    //   } catch (e) {
    //     console.log("signWrapClaimtokensTransactionHash");
    //     console.log(e);
    //   }
    // },

    async getSession(sessionid) {
      if (!sessionid) return;

      try {
        const res = await axios.get(this.endpoints(sessionid).session);

        if (!!res && !!res.data && !!res.data.data) {
          this.session = res.data.data;

          this.contractAddress = getContractAddress(this.session.network);
 
          if (this.session.completed) {
            this.resetSession();
            this.eventBus.emit("add-toastr", {
              text: `Session ${sessionid} completed`,
              type: "success",
            });

            this.eventBus.emit("goto-home", {});
          } else if (this.session.signed) {
            this.popupModal = true;
          }
        }
      } catch (error) {
        this.eventBus.emit("add-toastr", {
          text: `Unable to retrieve session ${sessionid}`,
          type: "error",
        });
      }
    },

    async submitRetrievePeercoin() {
      if (
        !!this.session.wrapping ||
        !this.unwrapSignedMessage ||
        !this.unwrapBurnTokensTransactionHash ||
        !this.session._id ||
        !this.session.network
      )
        return;

      const config = {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
          network: this.session.network,
          "Idempotency-Key": this.requestId,
        },
      };

      const data = {
        erc20TransactionHash: this.unwrapBurnTokensTransactionHash, // (gotten as response from the transaction that burns wppc)
        signedMessage: this.unwrapSignedMessage, //(use users address to sign transaction hash)
        sessionID: this.session._id,
      };
      let response = await axios.post(this.endpoints().retrieve, data, config);

      if (
        (!!response && !!response.error) ||
        (!!response && !!response.data.error) ||
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
              : `Unable to request peercoins`,
          type: "error",
        });
        return;
      }
      this.eventBus.emit("add-toastr", {
        text:
          !!response && !!response.data && !!response.data.message
            ? response.data.message
            : `getting peercoins...`,
        type: "success",
      });

      this.eventBus.emit("goto-home", {});
    },
  },
};
</script>

<style lang="scss" scoped>
.session-container {
  padding: 20px 12px 10px 20px;
  margin: auto;
  width: 50%;
}

.session-container-heading {
  font-weight: bold;
  font-style: italic;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
  font-size: 15px;
  padding-bottom: 3px;
}

.transation-container {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
}
</style>
