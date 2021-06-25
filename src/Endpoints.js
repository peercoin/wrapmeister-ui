export function wrapEndpoints(id, hash) {
  //todo change
  let _host = "http://localhost:3000";
  return {
    wrap: `${_host}/api/v1/peercoin/wrap`,
    unwrap: `${_host}/api/v1/peercoin/unwrap`,
    retrieve: `${_host}/api/v1/peercoin/retrieve?id=${id}&transactionHash=${hash}`,
    session: `${_host}/api/v1/transaction/${id}`,
  };
}

export function getNetworks() {
  return [
    {
      key: "BSC_TESTNET",
      description: "Binance Smart Chain (BSC) - Testnet",
      active: true,
    },
    {
      key: "BSC_MAINNET",
      description: "Binance Smart Chain (BSC)",
      active: true,
    },
    {
      key: "MATIC_TESTNET",
      description: "Polygon (Matic) - Testnet",
      active: true,
    },
    {
      key: "MATIC_MAINNET",
      description: "Polygon (Matic)",
      active: true,
    },
    {
      key: "ETH_TESTNET",
      description: "Ethereum (ETH) - Testnet",
      active: true,
    },
    {
      key: "ETH_MAINNET",
      description: "Ethereum (ETH)",
      active: true,
    },
  ];
}
