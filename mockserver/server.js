var cors = require("cors");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const options = {
  inflate: true,
  limit: 1000,
};
app.use(bodyParser.json(options));
app.use(cors());

app.get("/", (req, res) => {
  res.send("mockserver");
});

app.post("/ppceth/deposit", function(req, res, next) {
  console.log(req.body); // {'refundAddress':"PJLTZiAYJ4fdQggM4UyVLfxxv33WoQWq4V", 'destinationAdres': "0xeee84A4E17eaA817e72FED60EEd579eE8cb5BBcC"}
  res.json({
 
    sessionId:
      "70F4E46ABF55E1FFC6771E86103F3DADB46BC0115559D86F540D8BAB39A87F4D",
  });
});

app.post("/ethppc/deposit", function(req, res, next) {
  console.log(req.body); // {'refundAddress':"0xeee84A4E17eaA817e72FED60EEd579eE8cb5BBcC", 'destinationAdres': "PJLTZiAYJ4fdQggM4UyVLfxxv33WoQWq4V"}
  res.json({
  
    sessionId:
      "70F4E46ABF55E1FFC6771E86103F3DADB46BC0115559D86F540D8BAB39A87F4D",
  });
});

app.get("/bridge/:id", function(req, res, next) {
  // Retrieve the tag from our URL path
  var id = req.params.id;
  res.json({
    depositAddress: "PW9AkY8arvR8GnfS9v7qxvnwPqXTSzckKm",  
    mode:"ppceth"
  });
});

app.listen(8083);
