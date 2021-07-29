# wrapmeister-ui

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### deploy folder
everything in dist folder

### wrap
==========================================
wrap Peercoins:
==========================================
step 1:
POST /api/v1/peercoin/wrap 
parameters:
        amount: 1984,
        destinationAddress: an_ETHdestinationAddress,
       

OUTPUT: a session with sessionID

step 2....n:
POST /api/v1/peercoin/retrieve/{sessionID} 
Until session.signed is true and session.signature is a json-string having:
            signature.v,
            signature.r,
            signature.s

step n+1:
 - get accounts from MetaMask
 - get Contract from MetaMask 
	parameters:
 	- contractAddress of the selected network
 	- session.erc20Address
 - claimTokens(
            session.amount,
            session.nonce,
            session.erc20Address,
            signature.v,
            signature.r,
            signature.s
          )
          .send(); 	
 OUTPUT: a wrapClaimtokensTransactionHash         


Done. Return to HOME  


### unwrap
==========================================
unwrap Peercoins:
==========================================
step 1:
POST /api/v1/peercoin/unwrap 
parameters:
        amount: 1984,
        destinationAddress: an_PeercoinAddress,
        erc20Address: an_ETHdestinationAddress 

OUTPUT: a session with sessionID

step 2: 
POST /api/v1/peercoin/retrieve/{sessionID} 
Until (most likely just once) the session.signed is true and session.signature is a json-string having:
            signature.v,
            signature.r,
            signature.s

step 3:
 - get accounts from MetaMask
 - get Contract from MetaMask 
	parameters:
 	- contractAddress of the selected network
 	- session.erc20Address
 - burnTokens(
            session.amount,
            session.nonce,
            signature.v,
            signature.r,
            signature.s
          )
          .send() 	
 OUTPUT: a unwrapBurnTokensTransactionHash         

Done. Return to HOME  

 
