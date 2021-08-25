//todo change these vars:
const APP_WRAPPERHOST = "http://localhost:3000";
const APP_WRAPPERHOSTWSS = "ws://localhost:3000";

//////////////////////////////////////////////////////////////
const isNullOrEmpty = function (value) {
  return !(typeof value === "string" && value.length > 0);
};

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
    //retrieve: `${_host}/api/v1/peercoin/retrieve`,
    session: `${_host}/api/v1/session/${id}`,
    confirmBurn: `${_host}/api/v1/confirm-burn`,
    websocket: wsshost,
  };
}

export function getContractAddress(network) {
  const ne = getNetworks().find((nw) => nw.key === network);
  return !!ne ? ne.contract : "";
}

//todo change these vars:
export function getNetworks() {
  try {
    return [
      {
        key: "BSC_TESTNET",
        description: "Binance Smart Chain (BSC) - Testnet",
        active: false,
        contract: "0xd11C56F90481062D3e99eA72Df816Dc768BaAeE1",
      },
      {
        key: "BSC_MAINNET",
        description: "Binance Smart Chain (BSC)",
        active: false,
        contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      },
      {
        key: "MATIC_TESTNET",
        description: "Polygon (Matic) - Testnet",
        active: false,
        contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      },
      {
        key: "MATIC_MAINNET",
        description: "Polygon (Matic)",
        active: false,
        contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      },
      {
        key: "ETH_TESTNET",
        description: "Ethereum (ETH) - Testnet",
        active: true,
        contract: "0x5B8eF6EE9ec9Df9f240FEbACa2AE88ce3eb950dc",
      },
      {
        key: "ETH_MAINNET",
        description: "Ethereum (ETH)",
        active: false,
        contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      },
    ];
  } catch {
    return [
      {
        key: "BSC_TESTNET",
        description: "Binance Smart Chain (BSC) - Testnet",
        active: true,
        contract: "0xd11C56F90481062D3e99eA72Df816Dc768BaAeE1",
      },
    ];
  }
}
