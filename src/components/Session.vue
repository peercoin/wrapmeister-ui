<template>
  <div>
    <div class="form-style-2">
      <div class="form-style-2-heading">Peercoin to ETH token</div>
      <div>
        <label for="field1"
          ><span>Name <span class="required">*</span></span
          ><input type="text" class="input-field" name="field1" value=""
        /></label>
        <label for="field2"
          ><span>Email <span class="required">*</span></span
          ><input type="text" class="input-field" name="field2" value=""
        /></label>
        <label
          ><span>Telephone</span
          ><input
            type="text"
            class="tel-number-field"
            name="tel_no_1"
            value=""
            maxlength="4"/>-<input
            type="text"
            class="tel-number-field"
            name="tel_no_2"
            value=""
            maxlength="4"/>-<input
            type="text"
            class="tel-number-field"
            name="tel_no_3"
            value=""
            maxlength="10"
        /></label>
        <label for="field4"
          ><span>Regarding</span
          ><select name="field4" class="select-field">
            <option value="General Question">General</option>
            <option value="Advertise">Advertisement</option>
            <option value="Partnership">Partnership</option>
          </select></label
        >
        <label for="field5"
          ><span>Message <span class="required">*</span></span
          ><textarea name="field5" class="textarea-field"></textarea
        ></label>

        <label><span> </span><input type="submit" value="Submit"/></label>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { wrapEndpoints } from "@/Endpoints.js";

export default {
  props: ["sessionId"],

  watch: {
    sessionId(newval, oldVal) {
      if (newval !== oldVal) {
        this.getTransaction(newval);
      }
    },
  },

  data() {
    return {
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
    //console.warn("mounted", this.sessionId);
    this.getTransaction(this.sessionId);
  },
  //   created() {
  //     console.warn("created", this.sessionId);
  //     this.getTransaction(this.sessionId);
  //   },

  methods: {
    getTransaction(id) {
      if (!id) return;

      axios
        .get(this.endpoints(id).session)
        .then((res) => {
  

          if (!!res && !!res.data && !!res.data.data) {
            this.transaction = res.data.data;
            this.eventBus.emit("add-toastr", {
              text: res.data.message,
              type: "success",
            });
          } else {
            this.eventBus.emit("add-toastr", {
              text: !!res && !!res.data && !!res.data.message ? res.data.message :`Unable to retrieve session ${id}`,
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

<style lang="scss" scoped>
.form-style-2 {
  // text-align: center;
  //max-width: 500px;
  padding: 20px 12px 10px 20px;
  //font: 13px Arial, Helvetica, sans-serif;
  margin: auto;
  width: 50%;
  // border: 3px solid green;
  //padding: 10px;
}
.form-style-2-heading {
  font-weight: bold;
  font-style: italic;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
  font-size: 15px;
  padding-bottom: 3px;
}
.form-style-2 label {
  display: block;
  margin: 0px 0px 15px 0px;
}
.form-style-2 label > span {
  width: 100px;
  font-weight: bold;
  float: left;
  padding-top: 8px;
  padding-right: 5px;
}
.form-style-2 span.required {
  color: red;
}
.form-style-2 .tel-number-field {
  width: 40px;
  text-align: center;
}
.form-style-2 input.input-field,
.form-style-2 .select-field {
  width: 48%;
}
.form-style-2 input.input-field,
.form-style-2 .tel-number-field,
.form-style-2 .textarea-field,
.form-style-2 .select-field {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  border: 1px solid #c2c2c2;
  box-shadow: 1px 1px 4px #ebebeb;
  -moz-box-shadow: 1px 1px 4px #ebebeb;
  -webkit-box-shadow: 1px 1px 4px #ebebeb;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  padding: 7px;
  outline: none;
}
.form-style-2 .input-field:focus,
.form-style-2 .tel-number-field:focus,
.form-style-2 .textarea-field:focus,
.form-style-2 .select-field:focus {
  border: 1px solid #0c0;
}
.form-style-2 .textarea-field {
  height: 100px;
  width: 55%;
}
.form-style-2 input[type="submit"],
.form-style-2 input[type="button"] {
  border: none;
  padding: 8px 15px 8px 15px;
  background: #ff8500;
  color: #fff;
  box-shadow: 1px 1px 4px #dadada;
  -moz-box-shadow: 1px 1px 4px #dadada;
  -webkit-box-shadow: 1px 1px 4px #dadada;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
}
.form-style-2 input[type="submit"]:hover,
.form-style-2 input[type="button"]:hover {
  background: #ea7b00;
  color: #fff;
}
</style>
