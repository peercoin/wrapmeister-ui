export function wrapEndpoints(id) {
  //todo change
  let _host = process.env.VUE_APP_WRAPPERHOST; //"http://localhost:9000";
  return {
    wrap: `${_host}/api/v1/peercoin/wrap`,
    unwrap: `${_host}/api/v1/peercoin/unwrap`,
    //retrieve: `${_host}/api/v1/peercoin/retrieve`,
    session: `${_host}/api/v1/session/${id}`,
  };
}

export function getContractAddress(network) {
  const ne = getNetworks().find((nw) => nw.key === network);
  return !!ne ? ne.contract : "";
}

export function getNetworks() {
  return JSON.parse(process.env.VUE_APP_NETWORKS);
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
