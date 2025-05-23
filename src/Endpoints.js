//todo change these vars:
const isDeveloping = false; // <----------false for production-----!!!!!!!!!!!!!!!!!!!!
const isTesting = false; // <----------false for production-----!!!!!!!!!!!!!!!!!!!!

const APP_WRAPPERHOST = isDeveloping
  ? "http://localhost:3000"
  : isTesting
  ? "https://dev-wrapmeister.peercoin.net"
  : "https://wrapmeister.peercoin.net";

const APP_WRAPPERHOSTWSS = "ws://localhost:3000"; //not yet used anywhere

const isNullOrEmpty = function(value) {
  return !(typeof value === "string" && value.length > 0);
};

export function getMinAmount() {
  return isDeveloping || isTesting ? 1.0 : 500.0;
}

export function getContractAddress(network) {
  const ne = getNetworks().find((nw) => nw.key === network);
  return !!ne ? ne.contract : "";
}

export function getPeercoinExplorerUrl(network) {
  return network.includes("TEST")
    ? "https://tblockbook.peercoin.net/tx/"
    : "https://blockbook.peercoin.net/tx/";
}

export function wrapEndpoints(id) {
  let _host = isNullOrEmpty(APP_WRAPPERHOST)
    ? "http://localhost:3000"
    : APP_WRAPPERHOST;
  let wsshost = isNullOrEmpty(APP_WRAPPERHOSTWSS)
    ? "ws://localhost:3000"
    : APP_WRAPPERHOSTWSS;

  return {
    wrap: `${_host}/api/v1/wrap`,
    unwrap: `${_host}/api/v1/unwrap`,
    storageAddress: `${_host}/api/v1/storage-address`,
    session: `${_host}/api/v1/sessions/${id}`,
    addressPeercoinExplorerTest: `https://tblockbook.peercoin.net/address/${id}`, //id is address
    addressPeercoinExplorer: `https://blockbook.peercoin.net/address/${id}`, //id is address
    apiaddressPeercoinExplorerTest: `https://tblockbook.peercoin.net/api/address/${id}`, //id is address
    apiaddressPeercoinExplorer: `https://blockbook.peercoin.net/api/address/${id}`, //id is address
    openwrapsessions: `${_host}/api/v1/sessions?address[]=${id}`, // id is metamask account here
    signwrapsessions: `${_host}/api/v1/sessions/unsigned`,
    sign: `${_host}/api/v1/sessions/${id}/sign`, // id is metamask account here
    websocket: wsshost,
  };
}

//todo: returns a list of special accounts who may sign sessions
export function getSignAccounts() {
  return [
    "0x8809465617E09405a1af06C2d93C2bcE0Ce5Ac80",
    "0xfCab1090e039D4B44c3862F46b7d55bC256AB041",
    "0x2313D59CbEfd6c6eB5A72Ad439c0e3D0CB03d536",
    "0xc6999670a636fb21F3ba1D49F8b185424EAEE5Df",
    "0xf6882FB86c017d708BADFBE816442411B2ad2dd7",
    "0xddFbc2dd1692e16Fd60e442a7251461903393A69",
    "0x2A4727fA1b6B13F670093a8bF91631cf0c7F46E1",
    "0x25c1cA465E71A5C9c162ce3030E48b546f867617",
    "0x2fdA056131C98AACb6893fbbbA772D7379f5B508",
    "0x7b79850b6d3aB66edaffF2a21860972a1dD2e407"
  ];
}
export function getOwnerAccounts() {
  return isDeveloping
    ? "0xc6999670a636fb21F3ba1D49F8b185424EAEE5Df"
    : isTesting
    ? "0x8809465617E09405a1af06C2d93C2bcE0Ce5Ac80"
    : "0xF02594A6335E7340109d75E771D7716c395bd995";
}

//todo change these vars:
//default is the first active network
export function getNetworks() {
  return [
    {
      key: "ETH_MAINNET",
      description: "Ethereum (ETH)",
      active: true,
      chainId: "0x1",
      contract: "0x044d078F1c86508e13328842Cc75AC021B272958",
      pagetitle: "Peercoin - Ethereum Bridge",
      viewContractUrl:
        "https://etherscan.io/address/0x044d078F1c86508e13328842Cc75AC021B272958",
      accountTotalUrl:
        "https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x044d078F1c86508e13328842Cc75AC021B272958&apikey=DMB9CZKSZP56AJK2Z7BZPHH61ZVQ58IYHQ",
      officialTotalUrl:
        "https://etherscan.io/token/0x044d078F1c86508e13328842Cc75AC021B272958?a={{{id}}}",

      tokenSymbol: "wPPC",
      tokenDecimals: 6,
      tokenImage:
        "https://www.peercoin.net/img/logos/icononly/insidecircle/Transparent/GreenIcon/peercoin-icon-green-transparent.svg",
    },
    {
      key: "BSC_TESTNET",
      description: "Binance Smart Chain (BSC) - Testnet",
      active: false,
      chainId: "0x61",
      contract: "0xd11C56F90481062D3e99eA72Df816Dc768BaAeE1",
      pagetitle: "Peercoin ↔ Ethereum Bridge",
      viewContractUrl: "",
      accountTotalUrl: "",
      officialTotalUrl: "",
    },
    {
      key: "BSC_MAINNET",
      description: "Binance Smart Chain (BSC)",
      active: false,
      chainId: "0x38",
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      pagetitle: "Peercoin ↔ Ethereum Bridge",
      viewContractUrl: "",
      accountTotalUrl: "",
      officialTotalUrl: "",
    },

    {
      key: "ETH_TESTNET",
      description: "Ethereum (ETH) - Testnet",
      active: false,
      contract: "0x922C1c68355e8B1b1769388Ad096bd4171CB08ee",
      pagetitle: "Peercoin - Ethereum Bridge",
      viewContractUrl:
        "https://ropsten.etherscan.io/address/0x922C1c68355e8B1b1769388Ad096bd4171CB08ee",
      accountTotalUrl:
        "https://api-ropsten.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0xd7B1d7fE3Bea75DCC87562BD76184e230b8117dC&apikey=0x922C1c68355e8B1b1769388Ad096bd4171CB08ee",
      officialTotalUrl:
        "https://ropsten.etherscan.io/token/0x922C1c68355e8B1b1769388Ad096bd4171CB08ee?a={{{id}}}",
    },
  ];
}
