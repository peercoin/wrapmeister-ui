export function wrapEndpoints(id) {
  //todo change
  let _host = process.env.VUE_APP_WRAPPERHOST; //"http://localhost:3000";
  let wsshost = process.env.VUE_APP_WRAPPERHOSTWSS; //"ws://localhost:3000";

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

export function getNetworks() {
  try {
    console.log("config networks: ", process.env.VUE_APP_NETWORKS);
    return JSON.parse(process.env.VUE_APP_NETWORKS);
  } catch {
    return JSON.parse([
      {
        key: "BSC_TESTNET",
        description: "Binance Smart Chain (BSC) - Testnet",
        active: true,
        contract: "0xd11C56F90481062D3e99eA72Df816Dc768BaAeE1",
      },
    ]);
  }

  /*
  return [
    {
      key: "BSC_TESTNET",
      description: "Binance Smart Chain (BSC) - Testnet",
      active: true,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
    {
      key: "BSC_MAINNET",
      description: "Binance Smart Chain (BSC)",
      active: true,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
    {
      key: "MATIC_TESTNET",
      description: "Polygon (Matic) - Testnet",
      active: true
      ,contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
    {
      key: "MATIC_MAINNET",
      description: "Polygon (Matic)",
      active: true,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
    {
      key: "ETH_TESTNET",
      description: "Ethereum (ETH) - Testnet",
      active: true,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
    {
      key: "ETH_MAINNET",
      description: "Ethereum (ETH)",
      active: true,
      contract: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
  ];*/
}
