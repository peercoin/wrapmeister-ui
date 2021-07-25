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
        erc20Address: an_ETHdestinationAddress (isn't used in wrap, but required in interface)

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

click button for final step n+2:
web3.eth.sign(
          wrapClaimtokensTransactionHash,
          session.erc20Address
        )

Done. Return to HOME (once the session.completed is retrieved)


### unwrap
==========================================
unwrap Peercoins:
==========================================
todo