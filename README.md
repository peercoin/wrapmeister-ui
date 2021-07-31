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

## wrap peercoins to wppc ##

**step 1:**
POST /api/v1/peercoin/wrap 
query-parameters:
        amount: 1984,
        destinationAddress: an_ETHdestinationAddress,
       
OUTPUT: a session 

**step 2....n: till user has sent peercoins to given address**
GET /api/v1/session/{sessionID}
repeat until session.signed is true and session.signature is a JSON string having:
        signature.v,
        signature.r,
        signature.s

**step n+1: claimTokens with MetaMask**
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


**Done. Return to HOME**  


## unwrap wppc back to peercoins ##
**step 1: Gather data with MetaMask**
do MetaMask stuff and then call burnTokens:

 - get accounts from MetaMask
 - get Contract from MetaMask 
	parameters:
 	- contractAddress of the selected network
 	- ...?

 - burnTokens(
            amount, //userInput
            nonce,       ???       
            signature.v, ???
            signature.r, ???
            signature.s   ???
          )
          .send() 	
 OUTPUT: a unwrapBurnTokensTransactionHash         
 - sign with metamask...

**step 2:**
POST /api/v1/peercoin/unwrap 
query-parameters:
        amount: 1984,
        destinationAddress: an_PeercoinAddress,
        erc20Address: an_ETHdestinationAddress 
        signedData???


Done. Return to HOME  

 
