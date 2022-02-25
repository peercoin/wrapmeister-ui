<template>
  <wrap-header title="FAQ" />

  <div class="container pt-4">
    <div>
      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            What is wrapped peercoin (wPPC)?
          </div>
          <div class="text-start">
            Wrapped peercoin (wPPC) is a synthetic peercoin-backed token that
            can exist and be used on foreign EVM-based blockchains like
            Ethereum. wPPC is created when peercoin is wrapped using
            bridge.peercoin.net and destroyed as peercoins are unwrapped.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            What is the purpose of wPPC?
          </div>
          <div class="text-start">
            Peercoin remains one of the oldest, most secure, and truly
            egalitarian blockchains in existence. Peercoin was prominent and
            easy to obtain on the first generation of cryptocurrency exchanges.
            Unfortunately, as the industry evolved, centralized exchanges became
            less and less hospitable to open-source, community driven projects
            like Peercoin. Now a new era of decentralized finance (DeFi) is
            restoring the freedom that is at the heart of blockchain technology.
            Through the process of wrapping Peercoin, the unrestricted exchange
            of PPC for other currencies is once again accessible to everyone.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            Where can I find more details on how bridge.peercoin.net works?
          </div>
          <div class="text-start">
            The architect of bridge.peercoin.net wrote this article describing
            how it works under the hood.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            Can I really use my PPC on the Ethereum blockchain?
          </div>
          <div class="text-start">
            No, you cannot use PPC on Ethereum, since peercoin lives on the
            Peercoin blockchain. You can however use wrapped peercoin (wPPC) on
            Ethereum as if it were any other ERC-20 token.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            Can I use wPPC on blockchains other than Ethereum?
          </div>
          <div class="text-start">
            Yes, bridge.peercoin.net can work with other EVM-based blockchains
            like Polygon and BNB Chain. Once support is added for these and
            other blockchains, you will be able to select them from the dropdown
            list. Ethereum is selected by default.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            What is the process for wrapping my peercoin?
          </div>
          <div class="text-start">
            The wrapping process consists of six steps. After selecting the
            blockchain you wish your wPPC to be created on, you must enter the
            amount of peercoins that you want to wrap.Then send this amount to
            the listed deposit address. Wait for your transaction to be
            confirmed and witnesses to verify your deposit. After verification
            is finished, you will be prompted to proceed to your MetaMask wallet
            to mint your wPPC. Your wPPC tokens can then be found in and
            transacted from your MetaMask wallet.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">What is MetaMask?</div>
          <div class="text-start">
            MetaMask is a browser extension and mobile app that allows you to
            store, transact and swap ETH and other ERC-20 tokens. Currently
            MetaMask supports all Ethereum-based networks that follow the ERC-20
            token standard. Bridge.peercoin.net is designed to work with
            MetaMask, so in order to use the wrapping and unwrapping features,
            you must first connect your MetaMask wallet to the website.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            Can I use bridge.peercoin.net on my phone?
          </div>
          <div class="text-start">
            Yes, MetaMask has an app compatible with iOS and Android. Open the
            MetaMask app on your phone and connect to bridge.peercoin.net using
            the mobile browser that is built into the app. The browser can be
            found from the menu.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            Why can&rsquo;t I see my wPPC in my MetaMask wallet?
          </div>
          <div class="text-start">
            If you successfully minted your wPPC, but can&rsquo;t see the
            balance in your MetaMask wallet, it&rsquo;s likely that you
            didn&rsquo;t import the wPPC token into your wallet. In the MetaMask
            wallet, select import tokens, and then custom token. Fill in the
            token contract address, which is listed on bridge.percoin.net under
            the name “official wrapped peercoin token.” Also enter in the token
            symbol (wPPC) and token decimal (6). Additionally, all this
            information can be filled in for you by selecting the button “Add
            wPPC Token to MetaMask” on the bridge.peercoin.net website. Either
            way you do it, this action will import the wPPC token to your
            MetaMask wallet, allowing you to see the wPPC balance that you
            already minted.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            Can I mint Proof of Stake blocks with my wPPC?
          </div>
          <div class="text-start">
            No, wPPC cannot be used to mint blocks on the Peercoin blockchain.
            wPPC is bound by the rules of the blockchain it was created on and
            cannot directly communicate with the Peercoin blockchain. If you
            want to mint blocks, you must first unwrap your coins using the
            bridge.peercoin.net website. By carrying out this process, your wPPC
            is burned, and PPC is released back to you from the custodian
            multisig, which you can then use for minting.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            Does bridge.peercoin.net charge a service fee?
          </div>
          <div class="text-start">
            The service itself does not charge a fee, but there are transaction
            fees that must be paid in order to move PPC and mint wPPC. One of
            the postulates of the design of the system is that the user always
            pays for all fees.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            I deposited 10 PPC, but only minted 9.99 wPPC. Where is the rest of
            my deposit?
          </div>
          <div class="text-start">
            Once your PPC is deposited, it is then transferred to a multisig
            storage address to be held until withdrawal. A transaction fee must
            be paid to the Peercoin network from the deposited amount in order
            to transfer your PPC to the multisig. If you want to mint exactly 10
            wPPC, then consider depositing enough to account for this additional
            transaction fee. The system presumes that the average transaction
            fee will be 0.01 PPC. On the Peercoin side, this is the only fee
            charged between depositing your PPC and minting wPPC. Of course
            there is also a fee that must be paid to mint the wPPC on the
            foreign blockchain. For example, a gas fee must be paid to mint wPPC
            on the Ethereum blockchain, but this will not impact the final wPPC
            balance that is minted.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            I made a partial deposit already, but changed my mind. How do I
            cancel my session?
          </div>
          <div class="text-start">
            There is no way to cancel an active session if you already made a
            partial deposit. Complete the session by depositing the remaining
            amount. Once your wPPC is minted on the selected blockchain, you can
            then unwrap to receive your PPC back.
          </div>
        </div>
      </div>

      <div class="row px-3 mt-2 mb-3">
        <div class="col-12">
          <div class="text-start fw-bold mb-2 question">
            How can I be sure my deposited PPC is secure?
          </div>
          <div class="text-start">
            You can view the custodian balance here at any time. Most exploits
            and hacks of cross-chain bridges occur at the withdrawal step,
            usually by finding a way to fool an automatic process. Because of
            this, unwrapping and the release of PPC back to the user is a manual
            process, not automated. It is the safest option to ensure the
            deposited PPC remains secure.
          </div>
        </div>
      </div>
    </div>

    <div class="row px-3 mt-3 mb-4 ">
      <div class="col-md-12">
        <div class="faqclose" @click="gotoHome">
          <span>GO BACK</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WrapHeader from "@/components/WrapHeader.vue";
export default {
  components: {
    WrapHeader,
  },

  methods: {
    gotoHome() {
      if (!!this.$store.state.account) {
        this.$router.push({
          name: "HomeAccount",
          params: {
            selectedaccount: [this.$store.state.account],
          },
        });
      } else {
        this.$router.push({
          name: "Home",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.question {
  color: #3cb054;
}

.faqclose {
  padding-bottom: 7px;
  padding-top: 7px;

  border: 1px solid #3cb054;
  // background-color: #fff;
  text-align: center;
  opacity: 1;
  font-size: 14px;
  background-color: #3cb054;
  color: white;
  border-radius: 8px;
  &:hover {
    cursor: pointer;
    background-color: #efefef;
    color: #3cb054;
  }
}
</style>
