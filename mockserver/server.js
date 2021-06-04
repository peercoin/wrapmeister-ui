var cors = require("cors");

const express = require("express");

const app = express();
// const options = {
//   inflate: true,
//   limit: 1000,
// };

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get("/", (req, res) => {
  res.send("mockserver");
});

app.post("/wrap-peercoin", function(req, res, next) {
  console.log(req.body); // {'amount':"1984.42", 'receivingAddress': "0xeee84A4E17eaA817e72FED60EEd579eE8cb5BBcC"}
  res.json({
    success: true,
    message: "wrap request received and is being processed",
    data: {
      _id: "70F4E46ABF55E1FF",
      network: "BSC_TESTNET",
      wrapping: true,
      signed: false,
      signature: "somesignatureinjsonwrapping",
      erc20Address: req.body.receivingAddress,
      amount: req.body.amount,
      ppcAddress: "PQvkFUNfdNfx9TMmC2NDUo418s8vxXaQMz",
      completed: false,
      erc20TransactionHash: "sometxidontheotherblockchainforwrapping",
      ppcTransactionHash: "thisshouldbeatxidonppcblockchainforwrapping",
    },
  });
});

app.post("/unwrap-peercoin", function(req, res, next) {
  console.log(req.body); // // {'amount':"1984.42", 'receivingAddress': "PJLTZiAYJ4fdQggM4UyVLfxxv33WoQWq4V"}
  res.json({
    success: true,
    message: "unwrap request received and is being processed",
    data: {
      _id: "someunwrapid",//is it the same id?
      network: "BSC_TESTNET",
      wrapping: false,
      signed: true,
      signature: "somesignatureinjsonUNwrapping",
      erc20Address: "",
      amount: req.body.amount,
      ppcAddress: req.body.receivingAddress,
      completed: false,
      erc20TransactionHash: "sometxidontheotherblockchainforUNwrapping",
      ppcTransactionHash: "thisshouldbeatxidonppcblockchainforUNwrapping",
    },
  });
});



app.get("/retrieve-peercoin", function(req, res, next) {
  var id = req.query.id; // $_GET["id"]
  var tx = req.query.transactionHash;
  var ret ={
        success: true,
        message: "peercoins have been sent to your address",
        data: {
          _id: id,
          network: "BSC_TESTNET",
          wrapping: false,
          signed: true,
          signature: "somesignatureinjsonUNwrapping",
          erc20Address: "someotheraddressfromsender",
          amount: 123,
          ppcAddress: "someppcAddress",
          completed: false,
          erc20TransactionHash: tx,
          ppcTransactionHash: "thisshouldbeatxidonppcblockchainforUNwrapping",
        },
      };

  res.json(ret);
});



app.get("/get-transaction/:transactionId", function(req, res, next) {
  // Retrieve the tag from our URL path
  var id = req.params.transactionId;
  var ret =
    id === "70F4E46ABF55E1FF"
      ? {
          success: true,
          message: "wrap request received and is being processed",
          data: {
            _id: "70F4E46ABF55E1FF",
            network: "BSC_TESTNET",
            wrapping: true,
            signed: false,
            signature: "somesignatureinjsonwrapping",
            erc20Address: req.body.receivingAddress,
            amount: req.body.amount,
            ppcAddress: "PQvkFUNfdNfx9TMmC2NDUo418s8vxXaQMz",
            completed: false,
            erc20TransactionHash: "sometxidontheotherblockchainforwrapping",
            ppcTransactionHash: "thisshouldbeatxidonppcblockchainforwrapping",
          },
        }
      : {
        success: true,
        message: "wrap request received and is being processed",
        data: {
          _id: "someunwrapid",
          network: "BSC_TESTNET",
          wrapping: false,
          signed: true,
          signature: "somesignatureinjsonUNwrapping",
          erc20Address: "",
          amount: req.body.amount,
          ppcAddress: req.body.receivingAddress,
          completed: false,
          erc20TransactionHash: "sometxidontheotherblockchainforUNwrapping",
          ppcTransactionHash: "thisshouldbeatxidonppcblockchainforUNwrapping",
        },
      };

  res.json(ret);
});

app.listen(8083);
