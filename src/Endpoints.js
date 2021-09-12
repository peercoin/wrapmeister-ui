//todo change these vars:
const APP_WRAPPERHOST = "https://wrapmeister.peercoin.net";
const APP_WRAPPERHOSTWSS = "ws://localhost:3000"; 

const isNullOrEmpty = function(value) {
  return !(typeof value === "string" && value.length > 0);
};

export function getMinAmount() {
  return 10.0
}

export function getContractAddress(network) {
  const ne = getNetworks().find((nw) => nw.key === network);
  return !!ne ? ne.contract : "";
}

export function wrapEndpoints(id, token) {
  let _host = isNullOrEmpty(APP_WRAPPERHOST)
    ? "http://localhost:3000"
    : APP_WRAPPERHOST;
  let wsshost = isNullOrEmpty(APP_WRAPPERHOSTWSS)
    ? "ws://localhost:3000"
    : APP_WRAPPERHOSTWSS;
 
  return {
    wrap: `${_host}/api/v1/wrap`,
    unwrap: `${_host}/api/v1/unwrap`,
    officialTotalUrl: `https://ropsten.etherscan.io/token/${token}?a=${id}`,
    accountTotalUrl: `https://api-ropsten.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${id}&apikey=DMB9CZKSZP56AJK2Z7BZPHH61ZVQ58IYHQ`,
    storageAddress: `${_host}/api/v1/storage-address`,
    session: `${_host}/api/v1/session/${id}`,
    addressPeercoinExplorerTest: `https://tblockbook.peercoin.net/address/${id}`, //id is address
    addressPeercoinExplorer: `https://blockbook.peercoin.net/address/${id}`, //id is address
    APIaddressPeercoinExplorerTest: `https://tblockbook.peercoin.net/api/address/${id}`, //id is address
    APIaddressPeercoinExplorer: `https://blockbook.peercoin.net/api/address/${id}`, //id is address
    openwrapsessions: `${_host}/api/v1/sessions?address[]=${id}`, // id is metamask account here
    websocket: wsshost,
  };
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
      pagetitle: "Peercoin ↔ Ethereum Bridge"
    },
    {
      key: "BSC_MAINNET",
      description: "Binance Smart Chain (BSC)",
      active: false,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      pagetitle: "Peercoin ↔ Ethereum Bridge"
    },
    {
      key: "MATIC_TESTNET",
      description: "Polygon (Matic) - Testnet",
      active: false,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      pagetitle: "Peercoin ↔ Ethereum Bridge"
    },
    {
      key: "MATIC_MAINNET",
      description: "Polygon (Matic)",
      active: false,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      pagetitle: "Peercoin ↔ Ethereum Bridge"
    },
    {
      key: "ETH_TESTNET",
      description: "Ethereum (ETH) - Testnet",
      active: true,
      contract: "0x5B8eF6EE9ec9Df9f240FEbACa2AE88ce3eb950dc",
      pagetitle: "Peercoin ↔ Ethereum Bridge"
    },
    {
      key: "ETH_MAINNET",
      description: "Ethereum (ETH)",
      active: false,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      pagetitle: "Peercoin ↔ Ethereum Bridge"
    },
  ];
}
