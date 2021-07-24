<template>
  <div>
    <div class="session-container">
      <div class="session-container-heading">{{ sessionHeader }}</div>
      <countdown v-if="!signed" :status="0.01 * countDown"></countdown>
      <row>
        <column :lg="12" :xl="6">
          <p>Completed</p>
        </column>
        <column :lg="12" :xl="6" class="margin-auto">
          <span class="icon-case"> <font-awesome-icon :icon="completedIcon" /></span>
        </column>
      </row>
      <row>
        <column :lg="12" :xl="6">
          <p>Network</p>
        </column>
        <column :lg="12" :xl="6" class="margin-auto">
          <input
            type="text"
            disabled="true"
            class="row-input-field"
            :value="mapNetworks(transaction.network)"
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
            :value="transaction.amount"
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
              v-if="!!transaction.ppcAddress && !!transaction.wrapping"
              :size="250"
              :text="transaction.ppcAddress"
            />
          </row>
          <row>
            <small class="margin-auto">{{ transaction.ppcAddress }}</small>
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
            :value="transaction.ppcTransactionHash"
          />
        </column>
      </row>
      <row>
        <column :lg="12" :xl="6">
          <p>ERC-20 address</p>
        </column>
        <column :lg="12" :xl="6" class="margin-auto">
          <row>
            <vue-q-r-code-component
              class="margin-auto"
              :size="250"
              :text="transaction.erc20Address"
            />
          </row>
          <row>
            <small class="margin-auto">{{ transaction.erc20Address }}</small>
          </row>
        </column>
      </row>
      <row class="transation-container">
        <column :lg="12" :xl="6">
          <p>ERC-20 transaction</p>
        </column>
        <column :lg="12" :xl="6" class="margin-auto">
          <row>
            <input
              type="text"
              disabled
              :placeholder="'processing...'"
              class="row-input-field"
              :value="transactionHash"
            />
          </row>
          <row>
            <m-button
              class="m-top-sm margin-auto"
              v-if="!transaction.wrapping"
              type="success"
              @mbclick="submitRetrievePeercoin"
              :disabled="!transactionHash"
              >Retrieve Peercoin</m-button
            >
          </row>
        </column>
      </row>
      <row>
        <column :lg="12" :xl="6">
          <p>Signature</p>
        </column>
        <column :lg="12" :xl="6" class="margin-auto">
          <row>
            <vue-q-r-code-component
              class="margin-auto"
              v-if="transaction.signature"
              :size="250"
              :text="transaction.signature"
            />
          </row>
          <row>
            <textarea
              disabled
              v-if="transaction.signature"
              class="row-input-field row-textarea-field m-top-sm"
              v-model="transaction.signature"
            ></textarea>
          </row>
        </column>
      </row>
      <row>
        <column :lg="12" :xl="6">
          <p>Signed</p>
        </column>
        <column :lg="12" :xl="6" class="margin-auto">
          <span class="icon-case"> <font-awesome-icon :icon="signedIcon" /></span>
        </column>
      </row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { wrapEndpoints, getNetworks } from "@/Endpoints.js";
import VueQRCodeComponent from "vue-qrcode-component";
import MButton from "@/components/Button.vue";
import Countdown from "@/components/Countdown.vue";
import Web3 from "web3";
import ABI from "@/abi/erc20.json";

export default {
  props: ["sessionId"],
  components: {
    VueQRCodeComponent,
    MButton,
    Countdown,
  },

  watch: {
    sessionId(newval, oldVal) {
      if (newval !== oldVal) {
        this.getSession(newval);
        this.countDown = 100;
      }
    },
  },

  data() {
    return {
      requestId: null,
      countDown: 100,
      countDownHandle: 0,
      endpoints: wrapEndpoints,
      transaction: {
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
      transactionHash: "",//from web3
      accounts: [],
      web3: null,
      contractAddress: process.env.VUE_APP_CONTRACT_ADDRESS,//todo
    };
  },

  async mounted() {
    this.requestId = this.newId();
    clearInterval(this.countDownHandle);
    this.countDownHandle = 0;
    this.countDownHandle = setInterval(this.onCountDown, 300);
    const enabled = await this.ethEnabled();
    if (!enabled) {
      alert("Please install MetaMask to use this dApp!");
    }
    await this.getSession(this.sessionId);
  },

  unmounted() {
    clearInterval(this.countDownHandle);
    this.countDownHandle = 0;
  },

  computed: {
    signed() {
      return !!this.transaction && !!this.transaction._id && this.transaction.signed;
    },

    completedIcon() {
      if (!!this.transaction && !!this.transaction._id && this.transaction.completed) {
        return "check-square";
      }
      return "times";
    },

    signedIcon() {
      if (!!this.transaction && !!this.transaction._id && this.transaction.signed) {
        return "check-square";
      }
      return "times";
    },

    peercoinAddressLabel() {
      return this.transaction.wrapping
        ? "Peercoin deposit address"
        : "Peercoin receive address";
    },

    sessionHeader() {
      if (!!this.transaction && !!this.transaction._id) {
        if (!!this.transaction.network) {
          if (this.transaction.wrapping) {
            return "Send Peercoin to " + this.mapNetworks(this.transaction.network);
          } else {
            return "Get Peercoin from " + this.mapNetworks(this.transaction.network);
          }
        }
      }

      return "No details available";
    },
  },

  methods: {
    newId() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },

    onCountDown() {
      if (!this.signed) {
        this.countDown = this.countDown - 1;
        if (this.countDown < 0.001) {
          this.getSession(this.transaction._id);
          this.countDown = 100;
        }
      }
    },

    mapNetworks(key) {
      let network = getNetworks().find((nw) => nw.key === key);
      return !!network ? network.description : key;
    },

    async ethEnabled() {
      if (window.ethereum) {
        try {
          await ethereum.request({
            method: "eth_requestAccounts",
          });
          this.web3 = new Web3(ethereum);
          this.accounts = await this.web3.eth.getAccounts();
          return true;
        } catch (error) {
          console.log(error);
        }
      }
      return false;
    },

    async sendBurnTransaction() {
      if (this.accounts.length > 0) {
        const contractInstance = new this.web3.eth.Contract(ABI, this.contractAddress, {
          from: this.transaction.erc20Address,
        });
        let signature = JSON.parse(this.transaction.signature);
        try {
          const result = await contractInstance.methods
            .burnTokens(
              this.transaction.amount,
              this.transaction.nonce,
              signature.v,
              signature.r,
              signature.s
            )
            .send();
          const r = confirm(
            `Please sign with your MetaMask \n ${result.transactionHash}`
          );
          if (r) {
            try {
              let signResult = await this.web3.eth.sign(
                result.transactionHash,
                this.transaction.erc20Address
              );
              this.transactionHash = result.transactionHash;
              console.log(signResult);
            } catch (e) {
              console.log(e);
            }
          } else {
            alert("Transaction sign rejected by user.");
          }
        } catch {}
      }
    },

    async sendMinTransaction() {
      if (this.accounts.length > 0) {
        const contractInstance = new this.web3.eth.Contract(ABI, this.contractAddress, {
          from: this.transaction.erc20Address,
        });
        let signature = JSON.parse(this.transaction.signature);
        try {
          const result = await contractInstance.methods
            .claimTokens(
              this.transaction.amount,
              this.transaction.nonce,
              this.transaction.erc20Address,
              signature.v,
              signature.r,
              signature.s
            )
            .send();
          const r = confirm(
            `Please sign with your MetaMask \n ${result.transactionHash}`
          );
          if (r) {
            try {
              let signResult = await this.web3.eth.sign(
                result.transactionHash,
                this.transaction.erc20Address
              );
              this.transactionHash = result.transactionHash;
              console.log(signResult);
            } catch (e) {
              console.log(e);
            }
          } else {
            alert("Transaction sign rejected by user.");
          }
        } catch {}
      }
    },

    async getSession(id) {
      if (!id) return;
      axios
        .get(this.endpoints(id).session)
        .then((res) => {
          if (!!res && !!res.data && !!res.data.data) {
            this.transaction = res.data.data;
            if (this.transaction.signed && !this.transaction.completed) {
              if (this.transaction.wrapping) {
                this.sendMinTransaction();
              } else {
                this.sendBurnTransaction();
              }
            }
          } else {
            this.eventBus.emit("add-toastr", {
              text:
                !!res && !!res.data && !!res.data.message
                  ? res.data.message
                  : `Unable to retrieve session ${id}`,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.eventBus.emit("add-toastr", {
            text: `Unable to retrieve session ${id}`,
            type: "error",
          });
        });
    },

    async submitRetrievePeercoin() {
      const config = {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
          network: this.transaction.network,
          "Idempotency-Key": this.requestId,
        },
      };

      const data = {
        erc20TransactionHash: "", // (gotten as response from the transaction that burns wppc)
        signedMessage: "", //(use users address to sign transaction hash)
        sessionID: this.transaction._id,
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
      //todo reset to homepage
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
