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
