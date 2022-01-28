//todo change these vars:
const isDeveloping = false; // <---------------!!!!!!!!!!!!!!!!!!!!
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

export function getPeercoinExplorerUrl(network) {
  return network.includes("TEST") ? 'https://tblockbook.peercoin.net/tx/' : 'https://blockbook.peercoin.net/tx/';
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
    // Peerchemist
    "0xD208Aefea9bA9c29F2E290Bfae2bB2e4687BB11b",
    // SeverinDK
    "0x8809465617E09405a1af06C2d93C2bcE0Ce5Ac80",
    // Witness B
    "0xfCab1090e039D4B44c3862F46b7d55bC256AB041",
    // Witness C
    "0x2313D59CbEfd6c6eB5A72Ad439c0e3D0CB03d536",
    // Mihai
    "0x2A4727fA1b6B13F670093a8bF91631cf0c7F46E1",
    // learnmore
    "0xf6882FB86c017d708BADFBE816442411B2ad2dd7",
    // RdedR
    "0x7b79850b6d3aB66edaffF2a21860972a1dD2e407",
    // Sentinelrv
    "0x51B7B6EDe967da479b8A51C9554CD5008CcCCc58"
  ];
}

export function getOwnerAccounts() {
  return [
    // SeverinDK
    "0x8809465617E09405a1af06C2d93C2bcE0Ce5Ac80",
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
      key: "ETH_MAINNET",
      description: "Ethereum (ETH)",
      active: true,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      pagetitle: "Peercoin ↔ Ethereum Bridge",
      viewContractUrl:
        "https://etherscan.io/address/0x39FE3A4c85109e5BC8d461D1961fdBFa9Ec67b70",
      accountTotalUrl:
        "https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x39FE3A4c85109e5BC8d461D1961fdBFa9Ec67b70&apikey=DMB9CZKSZP56AJK2Z7BZPHH61ZVQ58IYHQ",
      officialTotalUrl:
        "https://etherscan.io/token/0x39FE3A4c85109e5BC8d461D1961fdBFa9Ec67b70?a={{{id}}}",
    },
    {
      key: "ETH_TESTNET",
      description: "Ethereum (ETH) - Testnet",
      active: true,
      contract: "0x39FE3A4c85109e5BC8d461D1961fdBFa9Ec67b70",
      pagetitle: "Peercoin ↔ Ethereum Bridge",
      viewContractUrl:
        "https://ropsten.etherscan.io/address/0x39FE3A4c85109e5BC8d461D1961fdBFa9Ec67b70",
      accountTotalUrl:
        "https://api-ropsten.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x39FE3A4c85109e5BC8d461D1961fdBFa9Ec67b70&apikey=DMB9CZKSZP56AJK2Z7BZPHH61ZVQ58IYHQ",
      officialTotalUrl:
        "https://ropsten.etherscan.io/token/0x39FE3A4c85109e5BC8d461D1961fdBFa9Ec67b70?a={{{id}}}",
    },
  ];
}
