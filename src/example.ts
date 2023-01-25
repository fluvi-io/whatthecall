import { explain } from ".";

const main = async () => {
  console.log(
    await explain(
      {
        to: "0x754288077d0ff82af7a5317c7cb8c444d421d103",
        data: "0xa9059cbb000000000000000000000000f1adb4a5b8ed1621eccf97bfac10491c97f79c9400000000000000000000000000000000000000000000000000000000dea7ecd6",
      },
      "klay-token"
    )
  );
};

main();

// [
//   {
//     "id": "factom",
//     "chain_identifier": null,
//     "name": "Factom",
//     "shortname": ""
//   },
//   {
//     "id": "openledger",
//     "chain_identifier": null,
//     "name": "OpenLedger",
//     "shortname": ""
//   },
//   {
//     "id": "cosmos",
//     "chain_identifier": null,
//     "name": "Cosmos",
//     "shortname": ""
//   },
//   {
//     "id": "tezos",
//     "chain_identifier": null,
//     "name": "Tezos",
//     "shortname": ""
//   },
//   {
//     "id": "metaverse-etp",
//     "chain_identifier": null,
//     "name": "Metaverse ETP",
//     "shortname": ""
//   },
//   {
//     "id": "nem",
//     "chain_identifier": null,
//     "name": "NEM",
//     "shortname": ""
//   },
//   {
//     "id": "findora",
//     "chain_identifier": null,
//     "name": "Findora",
//     "shortname": ""
//   },
//   {
//     "id": "icon",
//     "chain_identifier": null,
//     "name": "ICON",
//     "shortname": ""
//   },
//   {
//     "id": "waves",
//     "chain_identifier": null,
//     "name": "Waves",
//     "shortname": ""
//   },
//   {
//     "id": "stratis",
//     "chain_identifier": null,
//     "name": "Stratis",
//     "shortname": ""
//   },
//   {
//     "id": "theta",
//     "chain_identifier": 361,
//     "name": "Theta",
//     "shortname": ""
//   },
//   {
//     "id": "nuls",
//     "chain_identifier": null,
//     "name": "Nuls",
//     "shortname": ""
//   },
//   {
//     "id": "qtum",
//     "chain_identifier": null,
//     "name": "Qtum",
//     "shortname": ""
//   },
//   {
//     "id": "stellar",
//     "chain_identifier": null,
//     "name": "Stellar",
//     "shortname": ""
//   },
//   {
//     "id": "nxt",
//     "chain_identifier": null,
//     "name": "NXT",
//     "shortname": ""
//   },
//   {
//     "id": "ardor",
//     "chain_identifier": null,
//     "name": "Ardor",
//     "shortname": ""
//   },
//   {
//     "id": "ontology",
//     "chain_identifier": null,
//     "name": "Ontology",
//     "shortname": ""
//   },
//   {
//     "id": "eos",
//     "chain_identifier": null,
//     "name": "EOS",
//     "shortname": ""
//   },
//   {
//     "id": "godwoken",
//     "chain_identifier": null,
//     "name": "Godwoken",
//     "shortname": ""
//   },
//   {
//     "id": "vechain",
//     "chain_identifier": null,
//     "name": "VeChain",
//     "shortname": ""
//   },
//   {
//     "id": "omni",
//     "chain_identifier": null,
//     "name": "Omni",
//     "shortname": ""
//   },
//   {
//     "id": "counterparty",
//     "chain_identifier": null,
//     "name": "Counterparty",
//     "shortname": ""
//   },
//   {
//     "id": "chiliz",
//     "chain_identifier": null,
//     "name": "Chiliz",
//     "shortname": ""
//   },
//   {
//     "id": "bitshares",
//     "chain_identifier": null,
//     "name": "BitShares",
//     "shortname": ""
//   },
//   {
//     "id": "neo",
//     "chain_identifier": null,
//     "name": "NEO",
//     "shortname": ""
//   },
//   {
//     "id": "super-zero",
//     "chain_identifier": null,
//     "name": "Sero",
//     "shortname": ""
//   },
//   {
//     "id": "tron",
//     "chain_identifier": null,
//     "name": "TRON",
//     "shortname": ""
//   },
//   {
//     "id": "",
//     "chain_identifier": null,
//     "name": "Radix",
//     "shortname": ""
//   },
//   {
//     "id": "komodo",
//     "chain_identifier": null,
//     "name": "Komodo",
//     "shortname": ""
//   },
//   {
//     "id": "rootstock",
//     "chain_identifier": null,
//     "name": "Rootstock RSK",
//     "shortname": ""
//   },
//   {
//     "id": "achain",
//     "chain_identifier": null,
//     "name": "Achain",
//     "shortname": ""
//   },
//   {
//     "id": "vite",
//     "chain_identifier": null,
//     "name": "Vite",
//     "shortname": ""
//   },
//   {
//     "id": "gochain",
//     "chain_identifier": null,
//     "name": "GoChain",
//     "shortname": ""
//   },
//   {
//     "id": "bittorrent",
//     "chain_identifier": 199,
//     "name": "BitTorrent",
//     "shortname": ""
//   },
//   {
//     "id": "enq-enecuum",
//     "chain_identifier": null,
//     "name": "Enecuum",
//     "shortname": ""
//   },
//   {
//     "id": "mdex",
//     "chain_identifier": null,
//     "name": "Mdex",
//     "shortname": ""
//   },
//   {
//     "id": "ethereum-classic",
//     "chain_identifier": null,
//     "name": "Ethereum Classic",
//     "shortname": ""
//   },
//   {
//     "id": "kusama",
//     "chain_identifier": null,
//     "name": "Kusama",
//     "shortname": ""
//   },
//   {
//     "id": "binancecoin",
//     "chain_identifier": null,
//     "name": "BNB Beacon Chain",
//     "shortname": "BEP2"
//   },
//   {
//     "id": "bitcoin-cash",
//     "chain_identifier": null,
//     "name": "Simple Ledger Protocol (Bitcoin Cash)",
//     "shortname": "SLP"
//   },
//   {
//     "id": "velas",
//     "chain_identifier": 106,
//     "name": "Velas",
//     "shortname": "velas"
//   },
//   {
//     "id": "huobi-token",
//     "chain_identifier": 128,
//     "name": "Huobi ECO Chain Mainnet",
//     "shortname": "HECO"
//   },
//   {
//     "id": "bitkub-chain",
//     "chain_identifier": 96,
//     "name": "Bitkub Chain",
//     "shortname": ""
//   },
//   {
//     "id": "zilliqa",
//     "chain_identifier": null,
//     "name": "Zilliqa",
//     "shortname": ""
//   },
//   {
//     "id": "terra",
//     "chain_identifier": null,
//     "name": "Terra",
//     "shortname": ""
//   },
//   {
//     "id": "polis-chain",
//     "chain_identifier": 333999,
//     "name": "Polis Chain",
//     "shortname": ""
//   },
//   {
//     "id": "defichain",
//     "chain_identifier": null,
//     "name": "DeFiChain",
//     "shortname": ""
//   },
//   {
//     "id": "fusion-network",
//     "chain_identifier": null,
//     "name": "Fusion Network",
//     "shortname": "fusion-network"
//   },
//   {
//     "id": "celer-network",
//     "chain_identifier": null,
//     "name": "Celer Network",
//     "shortname": "Celer"
//   },
//   {
//     "id": "proof-of-memes",
//     "chain_identifier": null,
//     "name": "Proof of Memes",
//     "shortname": ""
//   },
//   {
//     "id": "telos",
//     "chain_identifier": null,
//     "name": "Telos",
//     "shortname": ""
//   },
//   {
//     "id": "kucoin-community-chain",
//     "chain_identifier": 321,
//     "name": "Kucoin Community Chain",
//     "shortname": "KCC"
//   },
//   {
//     "id": "hoo",
//     "chain_identifier": null,
//     "name": "Hoo",
//     "shortname": "Hoo"
//   },
//   {
//     "id": "Bitcichain",
//     "chain_identifier": null,
//     "name": "Bitcichain",
//     "shortname": "Bitcichain"
//   },
//   {
//     "id": "kava",
//     "chain_identifier": null,
//     "name": "Kava",
//     "shortname": ""
//   },
//   {
//     "id": "algorand",
//     "chain_identifier": null,
//     "name": "Algorand",
//     "shortname": ""
//   },
//   {
//     "id": "yocoin",
//     "chain_identifier": null,
//     "name": "Yocoin",
//     "shortname": "yocoin"
//   },
//   {
//     "id": "near-protocol",
//     "chain_identifier": null,
//     "name": "Near Protocol",
//     "shortname": "near-protocol"
//   },
//   {
//     "id": "mixin-network",
//     "chain_identifier": null,
//     "name": "Mixin Network",
//     "shortname": ""
//   },
//   {
//     "id": "klay-token",
//     "chain_identifier": null,
//     "name": "Klaytn",
//     "shortname": ""
//   },
//   {
//     "id": "wanchain",
//     "chain_identifier": null,
//     "name": "Wanchain",
//     "shortname": ""
//   },
//   {
//     "id": "iotex",
//     "chain_identifier": null,
//     "name": "IoTeX",
//     "shortname": "iotex"
//   },
//   {
//     "id": "xrp",
//     "chain_identifier": null,
//     "name": "XRP Ledger",
//     "shortname": "xrp"
//   },
//   {
//     "id": "fuse",
//     "chain_identifier": 122,
//     "name": "Fuse",
//     "shortname": ""
//   },
//   {
//     "id": "polkadot",
//     "chain_identifier": null,
//     "name": "Polkadot",
//     "shortname": ""
//   },
//   {
//     "id": "cardano",
//     "chain_identifier": null,
//     "name": "Cardano",
//     "shortname": ""
//   },
//   {
//     "id": "arbitrum-one",
//     "chain_identifier": 42161,
//     "name": "Arbitrum One",
//     "shortname": "Arbitrum"
//   },
//   {
//     "id": "binance-smart-chain",
//     "chain_identifier": 56,
//     "name": "BNB Smart Chain",
//     "shortname": "BSC"
//   },
//   {
//     "id": "ronin",
//     "chain_identifier": null,
//     "name": "Ronin",
//     "shortname": "ron"
//   },
//   {
//     "id": "solana",
//     "chain_identifier": null,
//     "name": "Solana",
//     "shortname": ""
//   },
//   {
//     "id": "fantom",
//     "chain_identifier": 250,
//     "name": "Fantom",
//     "shortname": ""
//   },
//   {
//     "id": "exosama",
//     "chain_identifier": null,
//     "name": "Exosama",
//     "shortname": ""
//   },
//   {
//     "id": "osmosis",
//     "chain_identifier": null,
//     "name": "Osmosis",
//     "shortname": "Osmo"
//   },
//   {
//     "id": "optimistic-ethereum",
//     "chain_identifier": 10,
//     "name": "Optimism",
//     "shortname": "Optimism"
//   },
//   {
//     "id": "sora",
//     "chain_identifier": null,
//     "name": "Sora",
//     "shortname": ""
//   },
//   {
//     "id": "secret",
//     "chain_identifier": null,
//     "name": "Secret",
//     "shortname": ""
//   },
//   {
//     "id": "polygon-pos",
//     "chain_identifier": 137,
//     "name": "Polygon POS",
//     "shortname": "MATIC"
//   },
//   {
//     "id": "bitgert",
//     "chain_identifier": null,
//     "name": "Bitgert Chain",
//     "shortname": "Bitgert Brise"
//   },
//   {
//     "id": "thorchain",
//     "chain_identifier": null,
//     "name": "Thorchain",
//     "shortname": ""
//   },
//   {
//     "id": "elrond",
//     "chain_identifier": null,
//     "name": "Elrond",
//     "shortname": "elrond"
//   },
//   {
//     "id": "wemix-network",
//     "chain_identifier": null,
//     "name": "Wemix Network",
//     "shortname": ""
//   },
//   {
//     "id": "moonriver",
//     "chain_identifier": 1285,
//     "name": "Moonriver",
//     "shortname": "moonriver"
//   },
//   {
//     "id": "cronos",
//     "chain_identifier": 25,
//     "name": "Cronos",
//     "shortname": "CRO"
//   },
//   {
//     "id": "smartbch",
//     "chain_identifier": 10000,
//     "name": "SmartBCH",
//     "shortname": ""
//   },
//   {
//     "id": "aurora",
//     "chain_identifier": 1313161554,
//     "name": "Aurora",
//     "shortname": "aurora"
//   },
//   {
//     "id": "tomochain",
//     "chain_identifier": 88,
//     "name": "TomoChain",
//     "shortname": ""
//   },
//   {
//     "id": "avalanche",
//     "chain_identifier": 43114,
//     "name": "Avalanche",
//     "shortname": "AVAX"
//   },
//   {
//     "id": "metis-andromeda",
//     "chain_identifier": 1088,
//     "name": "Metis Andromeda",
//     "shortname": ""
//   },
//   {
//     "id": "ethereum",
//     "chain_identifier": 1,
//     "name": "Ethereum",
//     "shortname": ""
//   },
//   {
//     "id": "milkomeda-cardano",
//     "chain_identifier": 2001,
//     "name": "Milkomeda (Cardano)",
//     "shortname": ""
//   },
//   {
//     "id": "acala",
//     "chain_identifier": null,
//     "name": "Acala",
//     "shortname": ""
//   },
//   {
//     "id": "harmony-shard-0",
//     "chain_identifier": 1666600000,
//     "name": "Harmony Shard 0",
//     "shortname": "Harmony Shard 0"
//   },
//   {
//     "id": "defi-kingdoms-blockchain",
//     "chain_identifier": null,
//     "name": "DFK Chain",
//     "shortname": "DFK Chain"
//   },
//   {
//     "id": "evmos",
//     "chain_identifier": 9001,
//     "name": "Evmos",
//     "shortname": "evmos"
//   },
//   {
//     "id": "karura",
//     "chain_identifier": null,
//     "name": "Karura",
//     "shortname": ""
//   },
//   {
//     "id": "everscale",
//     "chain_identifier": null,
//     "name": "Everscale",
//     "shortname": ""
//   },
//   {
//     "id": "boba",
//     "chain_identifier": 288,
//     "name": "Boba Network",
//     "shortname": ""
//   },
//   {
//     "id": "sx-network",
//     "chain_identifier": null,
//     "name": "SX Network",
//     "shortname": "sxn"
//   },
//   {
//     "id": "cube",
//     "chain_identifier": null,
//     "name": "Cube",
//     "shortname": ""
//   },
//   {
//     "id": "",
//     "chain_identifier": null,
//     "name": "Matrix",
//     "shortname": ""
//   },
//   {
//     "id": "conflux",
//     "chain_identifier": null,
//     "name": "Conflux",
//     "shortname": "conflux"
//   },
//   {
//     "id": "elastos",
//     "chain_identifier": null,
//     "name": "Elastos Smart Contract Chain",
//     "shortname": "Elastos"
//   },
//   {
//     "id": "celo",
//     "chain_identifier": 42220,
//     "name": "Celo",
//     "shortname": "celo"
//   },
//   {
//     "id": "echelon",
//     "chain_identifier": null,
//     "name": "Echelon",
//     "shortname": ""
//   },
//   {
//     "id": "hydra",
//     "chain_identifier": null,
//     "name": "Hydra",
//     "shortname": ""
//   },
//   {
//     "id": "coinex-smart-chain",
//     "chain_identifier": 52,
//     "name": "CoinEx Smart Chain",
//     "shortname": "CSC"
//   },
//   {
//     "id": "hedera-hashgraph",
//     "chain_identifier": null,
//     "name": "Hedera Hashgraph",
//     "shortname": "hashgraph"
//   },
//   {
//     "id": "kardiachain",
//     "chain_identifier": null,
//     "name": "KardiaChain",
//     "shortname": "kardiachain"
//   },
//   {
//     "id": "ethereumpow",
//     "chain_identifier": null,
//     "name": "EthereumPoW",
//     "shortname": ""
//   },
//   {
//     "id": "astar",
//     "chain_identifier": null,
//     "name": "Astar",
//     "shortname": ""
//   },
//   {
//     "id": "moonbeam",
//     "chain_identifier": 1284,
//     "name": "Moonbeam",
//     "shortname": ""
//   },
//   {
//     "id": "hoo-smart-chain",
//     "chain_identifier": 70,
//     "name": "Hoo Smart Chain",
//     "shortname": ""
//   },
//   {
//     "id": "dogechain",
//     "chain_identifier": null,
//     "name": "Dogechain",
//     "shortname": ""
//   },
//   {
//     "id": "oasis",
//     "chain_identifier": 42262,
//     "name": "Oasis",
//     "shortname": "oasis"
//   },
//   {
//     "id": "skale",
//     "chain_identifier": null,
//     "name": "Skale",
//     "shortname": ""
//   },
//   {
//     "id": "flare-network",
//     "chain_identifier": null,
//     "name": "Flare Network",
//     "shortname": ""
//   },
//   {
//     "id": "stacks",
//     "chain_identifier": null,
//     "name": "Stacks",
//     "shortname": ""
//   },
//   {
//     "id": "step-network",
//     "chain_identifier": null,
//     "name": "Step Network",
//     "shortname": ""
//   },
//   {
//     "id": "ShibChain",
//     "chain_identifier": null,
//     "name": "ShibChain",
//     "shortname": ""
//   },
//   {
//     "id": "xdc-network",
//     "chain_identifier": 50,
//     "name": "XDC Network",
//     "shortname": "xdc xinfin"
//   },
//   {
//     "id": "songbird",
//     "chain_identifier": null,
//     "name": "Songbird",
//     "shortname": ""
//   },
//   {
//     "id": "kadena",
//     "chain_identifier": null,
//     "name": "Kadena",
//     "shortname": ""
//   },
//   {
//     "id": "canto",
//     "chain_identifier": 7700,
//     "name": "Canto",
//     "shortname": ""
//   },
//   {
//     "id": "xdai",
//     "chain_identifier": 100,
//     "name": "xDAI",
//     "shortname": ""
//   },
//   {
//     "id": "function-x",
//     "chain_identifier": 530,
//     "name": "Function X",
//     "shortname": ""
//   },
//   {
//     "id": "redlight-chain",
//     "chain_identifier": 2611,
//     "name": "Redlight Chain",
//     "shortname": ""
//   },
//   {
//     "id": "thundercore",
//     "chain_identifier": 108,
//     "name": "ThunderCore",
//     "shortname": ""
//   },
//   {
//     "id": "shiden network",
//     "chain_identifier": 8545,
//     "name": "Shiden Network",
//     "shortname": ""
//   },
//   {
//     "id": "arbitrum-nova",
//     "chain_identifier": 42170,
//     "name": "Arbitrum Nova",
//     "shortname": ""
//   },
//   {
//     "id": "oasys",
//     "chain_identifier": null,
//     "name": "Oasys",
//     "shortname": ""
//   },
//   {
//     "id": "energi",
//     "chain_identifier": null,
//     "name": "Energi",
//     "shortname": ""
//   },
//   {
//     "id": "meter",
//     "chain_identifier": 82,
//     "name": "Meter",
//     "shortname": ""
//   },
//   {
//     "id": "syscoin",
//     "chain_identifier": 57,
//     "name": "Syscoin NEVM",
//     "shortname": "syscoin"
//   },
//   {
//     "id": "tombchain",
//     "chain_identifier": null,
//     "name": "Tombchain",
//     "shortname": ""
//   },
//   {
//     "id": "okex-chain",
//     "chain_identifier": 66,
//     "name": "OKExChain",
//     "shortname": "OKEx"
//   },
//   {
//     "id": "onus",
//     "chain_identifier": null,
//     "name": "ONUS",
//     "shortname": ""
//   },
//   {
//     "id": "aptos",
//     "chain_identifier": null,
//     "name": "Aptos",
//     "shortname": ""
//   }
// ]
