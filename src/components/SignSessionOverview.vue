<template>
  <div v-if="showTable" class="table-overview">
    <div class="d-sm-none">
      <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        v-for="item in mysessions"
        class="tbl-content mb-3"
        :class="{ clickable: item.status === 'open' }"
        @click="onRowClick(item)"
        :key="item.sessionId"
      >
        <tr>
          <td class="tbl-header">
            <span class="headertext">Sign Wrap session</span>
          </td>
          <td>{{ item.sessionId }}</td>
        </tr>

        <tr>
          <td class="tbl-header"><span class="headertext">Amount</span></td>
          <td>{{ item.amount }}</td>
        </tr>

        <tr v-for="txId in item.txIds" :key="txId">
          <td class="tbl-header">
            <span class="headertext">Transaction</span>
          </td>
          <td class="to-upper">
            <a
              @click.stop=""
              :href="item.explorerUrl + txId"
              target="_blank"
              rel="noopener noreferrer"
              >{{ txId || "..." }}</a
            >
          </td>
        </tr>

        <tr>
          <td class="tbl-header"><span class="headertext">Witness A</span></td>
          <td>{{ item.signatureA ? "signed" : "..." }}</td>
        </tr>

        <tr>
          <td class="tbl-header"><span class="headertext">Witness B</span></td>
          <td>{{ item.signatureB ? "signed" : "..." }}</td>
        </tr>

        <tr>
          <td class="tbl-header"><span class="headertext">Witness C</span></td>
          <td>{{ item.signatureC ? "signed" : "..." }}</td>
        </tr>
      </table>
    </div>

    <div class="d-none d-sm-block">
      <div class="tbl-header">
        <table cellpadding="0" cellspacing="0" border="0">
          <thead>
            <tr>
              <th>Sign Wrap session</th>
              <th>Amount</th>
              <th>Transactions</th>
              <th>Witnesses</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="tbl-content">
        <table cellpadding="0" cellspacing="0" border="0">
          <tbody>
            <tr
              v-for="item in mysessions"
              :class="{ clickable: item.status === 'open' }"
              @click="onRowClick(item)"
              :key="item.sessionId"
            >
              <td>{{ item.shortsessionId }}</td>
              <td>{{ item.amount }}</td>
              <td>
                <ul style="list-style-type:none;padding-left:0px;">
                  <li v-for="txId in item.txIds" :key="txId">
                    <a
                      @click.stop=""
                      :href="item.explorerUrl + txId"
                      target="_blank"
                      rel="noopener noreferrer"
                      >{{ txId || "..." }}</a
                    >
                  </li>
                </ul>
              </td>
              <td>
                <ul style="list-style-type:none;padding-left:0px;">
                  <li>{{ item.signatureA ? "signed" : "..." }}</li>
                  <li>{{ item.signatureB ? "signed" : "..." }}</li>
                  <li>{{ item.signatureC ? "signed" : "..." }}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Web3 from "web3";

import {
  wrapEndpoints,
  getSignAccounts,
  getPeercoinExplorerUrl,
} from "@/Endpoints.js";

export default {
  props: {
    propsaccounts: Array, // will use first account only
  },

  data() {
    return {
      testing: false, // restore this before commit
      endpoints: wrapEndpoints,
      mysessions: [],
    };
  },

  computed: {
    showTable() {
      return this.mysessions.length > 0;
    },
  },

  async mounted() {
    await this.getWrapSessions();

    if (this.propsaccounts.length > 0) {
      const account = this.propsaccounts[0];
      const accounts = await this.getAccounts();
      if (!account || !accounts.includes(account)) {
        this.$store.commit("setAccount", "");
        console.warn("not allowed!!!!!!!!!!!!!");

        this.gotoHome();
      }
    }
  },

  methods: {
    gotoHome() {
      this.$router.push({
        name: "Home",
      });
    },

    async getAccounts() {
      if (window.ethereum) {
        try {
          await ethereum.request({
            method: "eth_requestAccounts",
          });

          this.web3 = new Web3(ethereum);
          return await this.web3.eth.getAccounts();
        } catch (error) {
          console.log(error);
        }
      }

      return [];
    },

    async getWrapSessions() {
      if (this.propsaccounts.length === 0) return;

      try {
        const id = this.propsaccounts[0];

        if (!!id && (this.testing || getSignAccounts().includes(id))) {
          const res = await axios.get(this.endpoints(id).signwrapsessions, {headers: {network: this.$store.state.network}});

          if (!!res && !!res.data && !!res.data.data) {
            let sessions = res.data.data;
            this.setSessions(sessions);
          }
        }
      } catch (err) {
        if (
          !!err.response &&
          !!err.response.data &&
          !!err.response.data.message
        )
          console.warn(err.response.data.message);

        this.eventBus.emit("add-toastr", {
          text: `Unable to connect to backend with account ${this.propsaccounts[0]}. Please try again later.`,
          type: "error",
        });
      }
    },

    setSessions(sessions) {
      if (Array.isArray(sessions) && sessions.length > 0) {
        let isOpen = (session) => {
          if (!session.witnessASignature) return true;
          if (!session.witnessBSignature) return true;
          if (!session.witnessCSignature) return true;
          return false;
        };

        this.mysessions = sessions
          .sort((a, b) =>
            (a.expiresAt || 0) > (b.expiresAt || 0)
              ? 1
              : (b.expiresAt || 0) > (a.expiresAt || 0)
              ? -1
              : 0
          )
          .map((session) => {
            return {
              status: isOpen(session) ? "open" : "closed",
              //txid: "", //figure out UI columns later when we add completed txids too
              direction: "wrap",
              amount: session.amount,
              sessionId: session._id,
              shortsessionId: this.shortenedSessionId(session._id),
              txIds: session.wrapTxids,
              explorerUrl: getPeercoinExplorerUrl(session.network),
              signatureA: !!session.witnessASignature,
              signatureB: !!session.witnessBSignature,
              signatureC: !!session.witnessCSignature,
            };
          });
      }
    },

    shortenedSessionId(id) {
      if (!!id && id.length > 10) {
        return id.substring(0, 4) + "..." + id.substr(id.length - 5);
      }
      return id;
    },

    onRowClick(item) {
      if (item.direction === "wrap" && item.status === "open") {
        this.$router.push({
          name: "SignWith",
          params: {
            sessionid: item.sessionId,
            selectedaccount: this.propsaccounts,
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$table-bg: tranparent;

.table-overview {
  opacity: 0.9;
}
h1 {
  font-size: 30px;
  color: rgb(26, 143, 15);
  text-transform: uppercase;
  font-weight: 300;
  text-align: center;
  margin-bottom: 15px;
}
table {
  width: 100%;
  table-layout: fixed;
}
.tbl-header {
  background-color: #fff;
  color: transparent;
}
.tbl-content {
  overflow-x: hidden;
  margin-top: 0px;
  margin-bottom: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: $table-bg;
}
th {
  padding: 20px 15px;
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  color: #29881d;
  text-transform: uppercase;
}
.clickable:hover {
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
}
td {
  padding: 15px;
  text-align: left;
  vertical-align: middle;
  font-weight: 300;
  font-size: 12px;
  color: #fff;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.to-upper {
  text-transform: uppercase;
}
.headertext {
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  color: #29881d;
  text-transform: uppercase;
}
/* for custom scrollbar for webkit browser*/

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
</style>
