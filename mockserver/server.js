var cors = require("cors");
const ws = require("ws");
const express = require("express");
const nocache = require("nocache");
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

app.set('query parser', 'simple');

app.get("/", (req, res) => {
  res.send("mockserver");
});

app.post("/api/v1/wrap", function(req, res, next) {
  console.log(req.body); // {'amount':"1984.42", 'erc20Address': "", 'destinationAddress': "PJLTZiAYJ4fdQggM4UyVLfxxv33WoQWq4V"}
  res.json({
    //error: false,
    //statusCode: 0,
    message: "wrap request received and is being processed",
    data: {
      _id: "70F4E46ABF55E1FF",
      network: "BSC_TESTNET",
      amount: 47.56,
      wrapSignature: null,
      wrapTxid: null,
      wrapNonce: null,
      wrapPPCAddress: "PQvkFUNfdNfx9TMmC2NDUo418s8vxXaQMz",
      unwrapSignature: null,
      unwrapTxid: null,
      unwrapNonce: false,
      unwrapPPCAddress: null,
      ERC20Address: null
    },
  });
});

app.post("/api/v1/unwrap", function(req, res, next) {
  console.log(req.body); // // {'amount':"1984.42",  'erc20Address': "0xeee84A4E17eaA817e72FED60EEd579eE8cb5BBcC", 'destinationAddress': "PJLTZiAYJ4fdQggM4UyVLfxxv33WoQWq4V"}
  res.json({
    success: true,
    message: "unwrap request received and is being processed",
    data: {
      _id: "piwcayw9m1PG9CCr",
      network: "BSC_TESTNET",
      wrapping: false,
      signed: true,
      signature: '{"message":"0x2225b71678bdce5f7f13efd911e41c980ad4af2b92e4468eba591ab4d2b2f6f8","messageHash":"0x1f9c424590f61d8d73c5b3b8701352d6a388b67ce18198233e231058d4b12922","v":"0x1c","r":"0x2127929fa25de5a6f50bb107ba0606468e7c26b14bfd37561ff3bf15329941ab","s":"0x0db2954c47b4f0afa627561dd2ccfff8297689e879f744db94c4eed1d2b98553","signature":"0x2127929fa25de5a6f50bb107ba0606468e7c26b14bfd37561ff3bf15329941ab0db2954c47b4f0afa627561dd2ccfff8297689e879f744db94c4eed1d2b985531c"}',
      erc20Address: "",
      amount: req.body.amount,
      ppcAddress: req.body.destinationAddress,
      completed: false,
      erc20TransactionHash: "sometxidontheotherblockchainforUNwrapping",
      ppcTransactionHash: "ppc receiving transaction hash",
    },
  });
});


function unfinishedSessions(req, res, next){
  let mockResponse=  {
  data:  [
        {
            "network": "ETH_TESTNET",
            "amount": "1.234",
            "wrapSignature": null,
            "wrapTxid": null,
            "wrapNonce": null,
            "wrapPPCAddress": "mknrT8gvsUwADkUwH3pbrBeGFMKsn2QXZ5",
            "unwrapSignature": null,
            "unwrapTxid": null,
            "unwrapNonce": null,
            "unwrapPPCAddress": null,
            "ERC20Address": "0x93E16885EE732BFF281285efe2f2F46Dc92590C5",
            "_id": "0SeZp78Jg8ZE4C4q",
            "txid":"gsdfgkldgkhdsfghkgdsfh",
            claimed: false
        },
        {
            "network": "ETH_TESTNET",
            "amount": "123.45",
            "wrapSignature": null,
            "wrapTxid": null,
            "wrapNonce": null,
            "wrapPPCAddress": "msSDctnCauMhKES8ZS4zcap9MuQjC7Uzwi",
            "unwrapSignature": null,
            "unwrapTxid": null,
            "unwrapNonce": null,
            "unwrapPPCAddress": null,
            "ERC20Address": "0x93E16885EE732BFF281285efe2f2F46Dc92590C5",//"0x79969B981326C56fE638b176c5D5A6Cc4C6A910F",
            "_id": "2jNtPy75UIEkRR6G",
            "txid":"dsbdsfnfj2768376823",
            claimed: false
        }
    ]};
    res.json(mockResponse);
}

app.get("/api/v1/sessions", unfinishedSessions);

app.get("/api/v1/session/:sessionId", function(req, res, next) {
  // Retrieve the tag from our URL path
  var id = req.params.sessionId;
  var ret =
    id === "0SeZp78Jg8ZE4C4q"
      ?   {
        success: true,
        message: "wrap request received and is being processed",
        data: {
          "network": "ETH_TESTNET",
          "amount": 1.234,
          "wrapSignature": null,
          "wrapTxid": null,
          "wrapNonce": null,
          "wrapPPCAddress": "mknrT8gvsUwADkUwH3pbrBeGFMKsn2QXZ5",
          "unwrapSignature": null,
          "unwrapTxid": null,
          "unwrapNonce": null,
          "unwrapPPCAddress": null,
          "ERC20Address": "0x93E16885EE732BFF281285efe2f2F46Dc92590C5",
          "_id": "0SeZp78Jg8ZE4C4q",
          "txid":"gsdfgkldgkhdsfghkgdsfh",
          claimed: false
        },
      }
      : {
          success: true,
          message: "wrap request received and is being processed",
          data: {
            "network": "ETH_TESTNET",
            "amount": 123.45,
            "wrapSignature": null,
            "wrapTxid": null,
            "wrapNonce": null,
            "wrapPPCAddress": "msSDctnCauMhKES8ZS4zcap9MuQjC7Uzwi",
            "unwrapSignature": null,
            "unwrapTxid": null,
            "unwrapNonce": null,
            "unwrapPPCAddress": null,
            "ERC20Address": "0x93E16885EE732BFF281285efe2f2F46Dc92590C5",//"0x79969B981326C56fE638b176c5D5A6Cc4C6A910F",
            "_id": "2jNtPy75UIEkRR6G",
            "txid":"dsbdsfnfj2768376823",
            claimed: false
          },
        };

  res.json(ret);
});







const server = app.listen(3000);

const wss = new ws.Server({ server /*path: "/someendpoint"  */ });

wss.on("connection", (mywebsocket) => {
  
  console.log("connection");
  mywebsocket.isAlive = true;

  mywebsocket.send(
    JSON.stringify({
      Id: 42,
      content: "hello world!",
      isBroadcast: false,
      sender: "NS",
    })
  );

  mywebsocket.on("pong", () => {
    mywebsocket.isAlive = true;
  });

  mywebsocket.on("error", (err) => {
    console.warn(`Client disconnected - reason: ${err}`);
  });

 
  mywebsocket.on("message", (message) => {
    
    console.log("received: %s", message);
    
  });
 
});

//cleanup
setInterval(() => {
  wss.clients.forEach((myWebSocket) => {
    if (!myWebSocket.isAlive) {
      console.warn("I am the terminator", myWebSocket);
      return myWebSocket.terminate();
    }
  });
}, 10000);

console.log("mock started on port 3000!");
