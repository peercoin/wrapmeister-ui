<template>
  <div v-if="showTable" class="table-overview">
    <div class="tbl-header">
      <table cellpadding="0" cellspacing="0" border="0">
        <thead>
          <tr>
            <th>TXID</th>
            <th>Direction</th>
            <th>Volume</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="tbl-content">
      <table cellpadding="0" cellspacing="0" border="0">
        <tbody>
          <tr
            v-for="item in mysessions"
            @click="onRowClick(item)"
            :key="item.txid"
          >
            <td>{{ item.txid }}</td>
            <td class="to-upper">{{ item.direction }}</td>
            <td>{{ item.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    propsaccounts: Array,
  },

  data() {
    return {
      mysessions: [],
    };
  },

  computed: {
    showTable() {
      return this.mysessions.length > 0;
    },
  },

  async mounted() {
    //get data somewhere with axios:
    setTimeout(() => {
      this.mysessions = [
        {
          txid:
            "0xd6c021b604c6753ab79c1f2e75703f6884d0fbda96b745d312892b061ab34059",
          direction: "wrap",
          amount: "1234.567",
          otherdata: "for flying start wrap",
        },
        {
          txid:
            "0xd6c021b604c6753ab79c1f2e75703f6884d0fbda96b745d312892b061ab34059",
          direction: "wrap",
          amount: "1234.567",
          otherdata: "for flying start wrap",
        },
        {
          txid:
            "0xd6c021b604c6753ab79c1f2e75703f6884d0fbda96b745d312892b061ab34059",
          direction: "wrap",
          amount: "1234.567",
          otherdata: "for flying start wrap",
        },
        {
          txid:
            "0xd6c021b604c6753ab79c1f2e75703f6884d0fbda96b745d312892b061ab34059",
          direction: "wrap",
          amount: "1234.567",
          otherdata: "for flying start wrap",
        },
        {
          txid:
            "0xd6c021b604c6753ab79c1f2e75703f6884d0fbda96b745d312892b061ab34059",
          direction: "wrap",
          amount: "1234.567",
          otherdata: "for flying start wrap",
        },
        {
          txid:
            "0xd6c021b604c6753ab79c1f2e75703f6884d0fbda96b745d312892b061ab34059",
          direction: "wrap",
          amount: "1234.567",
          otherdata: "for flying start wrap",
        },
        {
          txid:
            "0xd6c021b604c6753ab79c1f2e75703f6884d0fbda96b745d312892b061ab34059",
          direction: "wrap",
          amount: "1234.567",
          otherdata: "for flying start wrap",
        },
        {
          txid:
            "0xd6c021b604c6753ab79c1f2e75703f6884d0fbda96b745d312892b061ab34059",
          direction: "wrap",
          amount: "1234.567",
          otherdata: "for flying start wrap",
        },
        {
          txid:
            "0xd6c021b604c6753ab79c1f2e75703f6884d0fbda96b745d312892b061ab34059",
          direction: "wrap",
          amount: "1234.567",
          otherdata: "for flying start wrap",
        },
        {
          txid:
            "0xd6c021b604c6753ab79c1f2e75703f6884d0fbda96b745d312892b061ab34059",
          direction: "wrap",
          amount: "1234.567",
          otherdata: "for flying start wrap",
        },
        {
          txid:
            "0xd6c021b604c6753ab79c1f2e75703f6884d0fbda96b745d312892b061ab34059",
          direction: "wrap",
          amount: "1234.567",
          otherdata: "for flying start wrap",
        },
      ];
    }, 1000);
  },

  methods: {
    onRowClick(item) {
      cosole.log(item.direction);
      if (item.direction == "wrap") {
        // this.$router.push({
        //     path: '/continuewith',
        //     params: {
        //         sessionid:"asfdg33dfsv24e"
        //     }
        // });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$table-bg: #54ac49;

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
  color: #29881d;
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
tr:hover {
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
  width: 280px;
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
