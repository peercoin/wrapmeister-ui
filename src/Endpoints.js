//todo change these vars:
const isDeveloping = true; // <---------------!!!!!!!!!!!!!!!!!!!!
const APP_WRAPPERHOST = isDeveloping
  ? "http://localhost:3000"
  : "https://wrapmeister.peercoin.net";

const APP_WRAPPERHOSTWSS = "ws://localhost:3000"; //not yet used anywhere

const isNullOrEmpty = function(value) {
  return !(typeof value === "string" && value.length > 0);
};

export function getMinAmount() {
  return isDeveloping ? 1.0 : 10.0;
}

export function getContractAddress(network) {
  const ne = getNetworks().find((nw) => nw.key === network);
  return !!ne ? ne.contract : "";
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
    session: `${_host}/api/v1/session/${id}`,
    addressPeercoinExplorerTest: `https://tblockbook.peercoin.net/address/${id}`, //id is address
    addressPeercoinExplorer: `https://blockbook.peercoin.net/address/${id}`, //id is address
    APIaddressPeercoinExplorerTest: `https://tblockbook.peercoin.net/api/address/${id}`, //id is address
    APIaddressPeercoinExplorer: `https://blockbook.peercoin.net/api/address/${id}`, //id is address
    openwrapsessions: `${_host}/api/v1/sessions?address[]=${id}`, // id is metamask account here
    signwrapsessions: `${_host}/api/v1/sessions/unsigned`,
    sign: `${_host}/api/v1/sessions/${id}/sign`, // id is metamask account here
    websocket: wsshost,
  };
}

//todo: returns a list of special accounts who may sign sessions
export function getSignAccounts() {
  return [
    "0xd84Dd9Cd1048d2D1f592B8Be523136C5cf047477",
    "0xC518bF880508a5e5facd0c1cC28044e74F38Ebbd",
    "0x8809465617E09405a1af06C2d93C2bcE0Ce5Ac80",
    "0xfCab1090e039D4B44c3862F46b7d55bC256AB041"
  ];
}

//todo change these vars:
//default is the first active network
export function getNetworks() {
  return [
    {
      key: "BSC_TESTNET",
      description: "Binance Smart Chain (BSC) - Testnet",
      active: false,
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
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      pagetitle: "Peercoin ↔ Ethereum Bridge",
      viewContractUrl: "",
      accountTotalUrl: "",
      officialTotalUrl: "",
    },
    {
      key: "MATIC_TESTNET",
      description: "Polygon (Matic) - Testnet",
      active: false,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      pagetitle: "Peercoin ↔ Ethereum Bridge",
      viewContractUrl: "",
      accountTotalUrl: "",
      officialTotalUrl: "",
    },
    {
      key: "MATIC_MAINNET",
      description: "Polygon (Matic)",
      active: false,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      pagetitle: "Peercoin ↔ Ethereum Bridge",
      viewContractUrl: "",
      accountTotalUrl: "",
      officialTotalUrl: "",
    },
    {
      key: "ETH_TESTNET",
      description: "Ethereum (ETH) - Testnet",
      active: true,
      contract: "0x21d28F6bf00762857081b2F628227C8d059C6557",
      pagetitle: "Peercoin ↔ Ethereum Bridge",
      viewContractUrl:
        "https://ropsten.etherscan.io/address/0x21d28F6bf00762857081b2F628227C8d059C6557",
      accountTotalUrl:
        "https://api-ropsten.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x21d28F6bf00762857081b2F628227C8d059C6557&apikey=DMB9CZKSZP56AJK2Z7BZPHH61ZVQ58IYHQ",
      officialTotalUrl:
        "https://ropsten.etherscan.io/token/0x21d28F6bf00762857081b2F628227C8d059C6557?a={{{id}}}",
    },
    {
      key: "ETH_MAINNET",
      description: "Ethereum (ETH)",
      active: false,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      pagetitle: "Peercoin ↔ Ethereum Bridge",
      viewContractUrl: "",
      accountTotalUrl: "",
      officialTotalUrl: "",
    },
  ];
}
