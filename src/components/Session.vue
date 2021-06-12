<template>
  <div>
    <div class="session-container">
      <div class="session-container-heading">{{ sessionHeader }}</div>

      <countdown v-if="!completed" :status="0.01 * countDown"></countdown>

      <div class="form-row">
        <div class="form-row-right">
          <span class="icon-case">
            <font-awesome-icon :icon="completedIcon"
          /></span>
        </div>
        <p>Completed</p>
      </div>

      <div class="form-row">
        <div class="form-row-right">
          <input
            type="text"
            disabled="true"
            class="row-input-field"
            :value="transaction.network"
          />
        </div>
        <p>Network</p>
      </div>

      <div class="form-row">
        <div class="form-row-right">
          <input
            type="text"
            disabled="true"
            class="row-input-field"
            :value="transaction.amount"
          />
        </div>
        <p>Amount</p>
      </div>

      <div class="form-row">
        <div class="form-row-right">
          <vue-q-r-code-component
            v-if="!!transaction.ppcAddress && !!transaction.wrapping"
            :size="250"
            :text="transaction.ppcAddress"
          />

          <small>{{ transaction.ppcAddress }}</small>
        </div>
        <p>{{ peercoinAddressLabel }}</p>
      </div>

      <div class="form-row">
        <div class="form-row-right">
          <input
            type="text"
            :disabled="1 == 1"
            class="row-input-field"
            placeholder="waiting for deposit..."
            :value="transaction.ppcTransactionHash"
          />
        </div>
        <p>Peercoin transaction</p>
      </div>

      <div class="form-row" v-if="!!transaction.erc20Address">
        <div class="form-row-right">
          <vue-q-r-code-component
            :size="250"
            :text="transaction.erc20Address"
          />

          <small>{{ transaction.erc20Address }}</small>
        </div>
        <p>ERC-20 address</p>
      </div>

      <div class="form-row">
        <div class="form-row-right">
          <input
            type="text"
            :disabled="!!transaction.wrapping"
            :placeholder="
              !!transaction.wrapping
                ? 'processing...'
                : 'please input the transaction hash'
            "
            class="row-input-field"
            :value="transaction.erc20TransactionHash"
          />
          <m-button
            class="m-top-sm"
            v-if="!transaction.wrapping"
            type="success"
            :disabled="
              !!transaction.erc20TransactionHash &&
                transaction.erc20TransactionHash.length > 64
            "
            >Retrieve Peercoin</m-button
          >
        </div>
        <p>ERC-20 transaction</p>
      </div>

      <div class="form-row" v-if="!!transaction.signature">
        <div class="form-row-right">
          <vue-q-r-code-component :size="250" :text="transaction.signature" />
          <textarea
            disabled
            class="row-input-field row-textarea-field m-top-sm"
            v-model="transaction.signature"
          ></textarea>
        </div>
        <p>Signature</p>
      </div>

      <div class="form-row">
        <div class="form-row-right">
          <span class="icon-case">
            <font-awesome-icon :icon="signedIcon"
          /></span>
        </div>
        <p>Signed</p>
      </div>

      <div class="form-row">
        <div class="form-row-right">
          <select class="row-input-field">
            <option value="BSC_TESTNET"
              >Binance Smart Chain (BSC) - Testnet</option
            >
            <option value="BSC_MAINNET">Binance Smart Chain (BSC)</option>
            <option value="MATIC_TESTNET">Polygon (Matic) - Testnet</option>
            <option value="MATIC_MAINNET">Polygon (Matic)</option>
            <option value="ETH_TESTNET">Ethereum (ETH) - Testnet</option>
            <option value="ETH_MAINNET">Ethereum (ETH)</option>
          </select>
        </div>
        <p>Choose network to bridge</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { wrapEndpoints } from "@/Endpoints.js";
import VueQRCodeComponent from "vue-qrcode-component";
import MButton from "@/components/Button.vue";
import Countdown from "@/components/Countdown.vue";

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
        this.getTransaction(newval);
        this.countDown = 100;
      }
    },
  },

  data() {
    return {
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
    };
  },

  mounted() {
    console.warn("mounted", this.sessionId);
    clearInterval(this.countDownHandle);
    this.countDownHandle = 0;
    this.countDownHandle = setInterval(this.onCountDown, 300);
    this.getTransaction(this.sessionId);
  },

  unmounted() {
    console.warn("unnnnnnnmounted", this.sessionId);
    clearInterval(this.countDownHandle);
    this.countDownHandle = 0;
  },
  //   created() {
  //     console.warn("created", this.sessionId);
  //     this.getTransaction(this.sessionId);
  //   },

  computed: {
    completed() {
      return (
        !!this.transaction &&
        !!this.transaction._id &&
        this.transaction.completed
      );
    },

    completedIcon() {
      if (
        !!this.transaction &&
        !!this.transaction._id &&
        this.transaction.completed
      ) {
        return "check-square";
      }
      return "times";
    },

    signedIcon() {
      if (
        !!this.transaction &&
        !!this.transaction._id &&
        this.transaction.signed
      ) {
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
      //console.log(this.transaction);
      if (!!this.transaction && !!this.transaction._id) {
        if (!!this.transaction.network) {
          if (this.transaction.wrapping) {
            return "Send Peercoin to " + this.transaction.network;
          } else {
            return "Get Peercoin from " + this.transaction.network;
          }
        }
      }

      return "No details available";
    },
  },

  methods: {
    // async copy(s) {
    //   await navigator.clipboard.writeText(s);
    //   alert("Copied!");
    // },
    onCountDown() {
      if (!this.completed) {
        this.countDown = this.countDown - 1;
        if (this.countDown < 0.001) {
          this.getTransaction(this.transaction._id);
          this.countDown = 100;
        }
      }
    },
    
    getTransaction(id) {
      if (!id) return;

      axios
        .get(this.endpoints(id).session)
        .then((res) => {
          if (!!res && !!res.data && !!res.data.data) {
            this.transaction = res.data.data;
            // this.eventBus.emit("add-toastr", {
            //   text: res.data.message,
            //   type: "success",
            // });
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
          // if (err.response) {
          //   // client received an error response (5xx, 4xx)
          // } else if (err.request) {
          //   // client never received a response, or request never left
          // } else {
          //   // anything else
          // }
        });
    },
  },
};
</script>
<style>
.session-container .form-row-right img {
  position: relative;
  left: 100px;
}
</style>

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
</style>
