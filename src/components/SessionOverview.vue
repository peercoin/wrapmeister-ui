<template>
  <div v-if="showTable" class="table-overview">
    <div class="tbl-header">
      <table cellpadding="0" cellspacing="0" border="0">
        <thead>
          <tr>
            <th>Wrap session</th>
            <th>Direction</th>
            <th>Amount</th>
            <th>Status</th>
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
            <td>{{ item.sessionId }}</td>
            <td class="to-upper">{{ item.direction }}</td>
            <td>{{ item.amount }}</td>
            <td class="to-upper">{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { wrapEndpoints } from "@/Endpoints.js";

export default {
  props: {
    propsaccounts: Array, // will use first account only
  },

  data() {
    return {
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
  },

  methods: {
    async getWrapSessions() {
      if (this.propsaccounts.length === 0) return [];

      try {
        const id = this.propsaccounts[0];

        const res = await axios.get(this.endpoints(id).openwrapsessions);

        if (!!res && !!res.data && !!res.data.data) {
          let sessions = res.data.data;
          this.setSessions(sessions);
        }
      } catch (error) {
        console.warn(error);
        this.eventBus.emit("add-toastr", {
          text: `Unable to connect to backend with account ${this.propsaccounts[0]}. Please try again later.`,
          type: "error",
        });
      }
    },

    setSessions(sessions) {
      if (Array.isArray(sessions) && sessions.length > 0) {
        let isOpen = (session) => {
          if (!session.wrapSignatureA) return true;
          if (!session.wrapSignatureB) return true;
          return false;
        };

        this.mysessions = sessions.map((session) => {
          return {
            status: isOpen(session) ? "open" : "open",
            txid: "", //figure out UI columns later when we add completed txids too
            direction: "wrap",
            amount: session.amount,
            sessionId: session._id,
          };
        });
      }
    },

    onRowClick(item) {
      if (item.direction === "wrap" && item.status === "open") {
        this.$router.push({
          name: "ContinueWith",
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
  height: 300px;
  overflow-x: hidden;
  margin-top: 0px;
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
