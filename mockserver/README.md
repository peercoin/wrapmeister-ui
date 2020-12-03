# nockserver

## Project setup
```
npm install
```

### start sterver for development
```
npm run start
```

### endoints
```
POST http://localhost:8083/ppceth/deposit  
input:   {'refundAddress':"PJLTZiAYJ4fdQggM4UyVLfxxv33WoQWq4V", 'destinationAdres': "0xeee84A4E17eaA817e72FED60EEd579eE8cb5BBcC"}

returns:  {     
    sessionId:
      "70F4E46ABF55E1FFC6771E86103F3DADB46BC0115559D86F540D8BAB39A87F4D",
  }

 
POST http://localhost:8083/ethppc/deposit  
input:   {'refundAddress':"PJLTZiAYJ4fdQggM4UyVLfxxv33WoQWq4V", 'destinationAdres': "0xeee84A4E17eaA817e72FED60EEd579eE8cb5BBcC"}

returns:  {     
    sessionId:
      "70F4E46ABF55E1FFC6771E86103F3DADB46BC0115559D86F540D8BAB39A87F4D",
  }


GET http://localhost:8083/bridge/sessionid
returns:  {
    depositAddress: "PW9AkY8arvR8GnfS9v7qxvnwPqXTSzckKm",  
    mode:"ppceth"
  }
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
