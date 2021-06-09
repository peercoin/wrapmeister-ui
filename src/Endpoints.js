export function wrapEndpoints(id, hash) {
  //todo change
  let _host = "http://localhost:3000";
  return {
    wrap: `${_host}/peercoin/wrap`,
    unwrap: `${_host}/peercoin/unwrap`,
    retrieve: `${_host}/peercoin/retrieve?id=${id}&transactionHash=${hash}`,
    session: `${_host}/transaction/${id}`,
  };
}
