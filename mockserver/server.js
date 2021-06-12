var cors = require("cors");

const express = require("express");
const nocache = require('nocache');
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
app.use(nocache());

app.get("/", (req, res) => {
  res.send("mockserver");
});

app.post("/api/v1/peercoin/wrap", function(req, res, next) {
  console.log(req.body); // {'amount':"1984.42", 'destinationAddress': "0xeee84A4E17eaA817e72FED60EEd579eE8cb5BBcC"}
  res.json({
    //error: false,
    //statusCode: 0,
    message: "wrap request received and is being processed",
    data: {
      _id: "70F4E46ABF55E1FF",
      network: "BSC_TESTNET",
      wrapping: true,
      signed: false,
      signature: "somesignatureinjsonwrapping",
      erc20Address: req.body.destinationAddress,
      amount: req.body.amount,
      ppcAddress: "PQvkFUNfdNfx9TMmC2NDUo418s8vxXaQMz",
      completed: false,
      erc20TransactionHash: "sometxidontheotherblockchainforwrapping",
      ppcTransactionHash: "thisshouldbeatxidonppcblockchainforwrapping",
    },
  });
});

app.post("/api/v1/peercoin/unwrap", function(req, res, next) {
  console.log(req.body); // // {'amount':"1984.42", 'destinationAddress': "PJLTZiAYJ4fdQggM4UyVLfxxv33WoQWq4V"}
  res.json({
    success: true,
    message: "unwrap request received and is being processed",
    data: {
      _id: "piwcayw9m1PG9CCr", 
      network: "BSC_TESTNET",
      wrapping: false,
      signed: true,
      signature: "{\"message\":\"0x2225b71678bdce5f7f13efd911e41c980ad4af2b92e4468eba591ab4d2b2f6f8\",\"messageHash\":\"0x1f9c424590f61d8d73c5b3b8701352d6a388b67ce18198233e231058d4b12922\",\"v\":\"0x1c\",\"r\":\"0x2127929fa25de5a6f50bb107ba0606468e7c26b14bfd37561ff3bf15329941ab\",\"s\":\"0x0db2954c47b4f0afa627561dd2ccfff8297689e879f744db94c4eed1d2b98553\",\"signature\":\"0x2127929fa25de5a6f50bb107ba0606468e7c26b14bfd37561ff3bf15329941ab0db2954c47b4f0afa627561dd2ccfff8297689e879f744db94c4eed1d2b985531c\"}",
      erc20Address: "",
      amount: req.body.amount,
      ppcAddress: req.body.destinationAddress,
      completed: false,
      erc20TransactionHash: "sometxidontheotherblockchainforUNwrapping",
      ppcTransactionHash: "ppc receiving transaction hash",
    },
  });
});



app.get("/api/v1/peercoin/retrieve", function(req, res, next) {
  var id = req.query.id;  
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



app.get("/api/v1/transaction/:transactionId", function(req, res, next) {
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
            erc20Address: "aERC20Address",
            amount: "123.45",
            ppcAddress: "PQvkFUNfdNfx9TMmC2NDUo418s8vxXaQMz",
            completed: false,
            erc20TransactionHash: "sometxidontheotherblockchainforwrapping",
            ppcTransactionHash: "ppc receiving transaction hash",
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
          signature: "{\"message\":\"0x2225b71678bdce5f7f13efd911e41c980ad4af2b92e4468eba591ab4d2b2f6f8\",\"messageHash\":\"0x1f9c424590f61d8d73c5b3b8701352d6a388b67ce18198233e231058d4b12922\",\"v\":\"0x1c\",\"r\":\"0x2127929fa25de5a6f50bb107ba0606468e7c26b14bfd37561ff3bf15329941ab\",\"s\":\"0x0db2954c47b4f0afa627561dd2ccfff8297689e879f744db94c4eed1d2b98553\",\"signature\":\"0x2127929fa25de5a6f50bb107ba0606468e7c26b14bfd37561ff3bf15329941ab0db2954c47b4f0afa627561dd2ccfff8297689e879f744db94c4eed1d2b985531c\"}",
          nonce:"6430808011",
          erc20Address: "",
          amount: "543.56",
          ppcAddress: "P8hVyPCKnFjGNDck9kMFzQTZ7GDym7VzA2",
          completed: false,
          erc20TransactionHash: "sometxidontheotherblockchainforUNwrapping",
          ppcTransactionHash: "ppc receiving transaction hash",
        },
      };

  res.json(ret);
});

app.listen(3000);
