import baseX from "base-x";
import { bech32 } from "bech32";
import sha from "sha.js";
import { Buffer } from "buffer";

const base58 = baseX(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);
const sha256 = (payload) =>
  Buffer.from(
    sha("sha256")
      .update(payload)
      .digest()
  );
var Network;

(function(Network) {
  Network["mainnet"] = "mainnet";
  Network["testnet"] = "testnet";
  //Network["regtest"] = "regtest";
})(Network || (Network = {}));
var AddressType;
(function(AddressType) {
  AddressType["p2pkh"] = "p2pkh";
  AddressType["p2sh"] = "p2sh";
  AddressType["p2wpkh"] = "p2wpkh";
  AddressType["p2wsh"] = "p2wsh";
})(AddressType || (AddressType = {}));

const addressTypes = {
  55: {
    type: AddressType.p2pkh,
    network: Network.mainnet,
  },
  111: {
    type: AddressType.p2pkh,
    network: Network.testnet,
  },
  117: {
    type: AddressType.p2sh,
    network: Network.mainnet,
  },
  196: {
    type: AddressType.p2sh,
    network: Network.testnet,
  },
};

const parseBech32 = (address) => {
  let decoded;
  try {
    decoded = bech32.decode(address);
  } catch (error) {
    throw new Error("Invalid address");
  }
  const mapPrefixToNetwork = {
    pc: Network.mainnet,
    tpc: Network.testnet,
    //bcrt: Network.regtest,
  };
  const network = mapPrefixToNetwork[decoded.prefix];
  if (network === undefined) {
    throw new Error("Invalid address");
  }
  const witnessVersion = decoded.words[0];
  if (witnessVersion < 0 || witnessVersion > 16) {
    throw new Error("Invalid address");
  }
  const data = bech32.fromWords(decoded.words.slice(1));
  const type = data.length === 20 ? AddressType.p2wpkh : AddressType.p2wsh;
  return {
    bech32: true,
    network,
    address,
    type,
  };
};

const getAddressInfo = (address) => {
  let decoded;

  const prefix = address.substr(0, 2).toLowerCase();
  if (prefix === "pc" || prefix === "tp") {
    return parseBech32(address);
  }
  try {
    decoded = base58.decode(address);
  } catch (error) {
    throw new Error("Invalid address");
  }
  const { length } = decoded;
  if (length !== 25) {
    throw new Error("Invalid address");
  }
  const version = decoded.readUInt8(0);

  const checksum = decoded.slice(length - 4, length);
  const body = decoded.slice(0, length - 4);
  const expectedChecksum = sha256(sha256(body)).slice(0, 4);
  if (!checksum.equals(expectedChecksum)) {
    throw new Error("Invalid address");
  }
  const validVersions = Object.keys(addressTypes).map(Number);
  if (!validVersions.includes(version)) {
    throw new Error("Invalid address");
  }
  const addressType = addressTypes[version];
  return Object.assign(Object.assign({}, addressType), {
    address,
    bech32: false,
  });
};

const validate = (address, network) => {
  try {
    const addressInfo = getAddressInfo(address);
    if (network) {
      return network === addressInfo.network;
    }
    return true;
  } catch (error) {
    return false;
  }
};
// export { getAddressInfo, Network, validate };
// export default validate;

/*
mainnet p2pkh: PH5i1gxwGe48VVmMrg3dKqgdkymzGyTRKG
mainnet p2sh: p92W3t7YkKfQEPDb7cG9jQ6iMh7cpKLvwK
mainnet segwit: pc1qavd24cqa5ksujqkx795za3n5wshk3j6lgvj6ea

testnet p2pkh: muuaf6eHen5dP2HMjttW7KNFJYjGzWaZYA
testnet p2sh: 2NEuk2hwRsTW2Xj4TkHjnkJRfkwKjE7kg5L
testnet segwit: tpc1qrq9n4dahfk620l8ue8xhkru0hqfhsmpzgyj5u6
*/

export function isValidAddress(address, networkType) {
  if (networkType === "prod") {
    return validate(address, Network["mainnet"]);
  }

  return (
    validate(address, Network["mainnet"]) ||
    validate(address, Network["testnet"])
  );
}
