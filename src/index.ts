import { utils, BigNumber } from "ethers";
import * as fourByte from "4byte";
import * as CoinGecko from "coingecko-api";

const selector = (signature) =>
  utils.keccak256(utf8ToHex(toSignature(signature))).slice(0, 10);

const toSignature = (def: string) =>
  def.replaceAll(/\ +[^ ]+ *(?=[,)])/g, "").replaceAll(/\ +/g, "");

function utf8ToHex(str: string) {
  return (
    "0x" +
    Array.from(str)
      .map((c) =>
        c.charCodeAt(0) < 128
          ? c.charCodeAt(0).toString(16)
          : encodeURIComponent(c).replace(/\%/g, "").toLowerCase()
      )
      .join("")
  );
}

function memoizeAsync(f) {
  const dic = new Map();
  return async function (...args) {
    const val = dic.get(args);
    if (val !== undefined) return val;
    else {
      const ret = await f(...args);
      dic.set(args, ret);
      return ret;
    }
  };
}

const CoinGeckoClient = new CoinGecko();
const contractInfo = memoizeAsync(
  async (p, c) => await CoinGeckoClient.coins.fetchCoinContractInfo(c, p)
);
const nativeInfo = memoizeAsync(
  async (p) => await CoinGeckoClient.coins.fetch(p)
);

const signature = memoizeAsync(async (a) => {
  const r = await fourByte(a);
  return r[r.length - 1];
});

const zip = (x, y) =>
  Array.from(Array(Math.max(x.length, y.length)), (_, i) => [x[i], y[i]]);

const paramNames = (str) => str.match(/(?<=[0-9a-zA-Z]+ )([0-9a-zA-Z]+)/g);

const platform = (platformId) => ({
  ERC20Amount: async (contract, amount: BigNumber) => {
    const { data } = await contractInfo(platformId, contract);

    const decimal = data.detail_platforms[platformId].decimal_place;
    const symbol = data.symbol;

    const a = "".concat("0".repeat(decimal), amount.toString());
    const b = ""
      .concat(a.slice(0, -decimal), ".", a.slice(-decimal))
      .match(
        /^(?:^0*([^0]\d*)\.0*$)|(?:^0*([^0]\d*\.\d{0,2})\d*$)|(?:^0*(0\.0*[^d]\d{0,2})\d*$)|(^00*$)/
      );

    return `${b[1] || b[2] || b[3] || b[4]} ${symbol}`;
  },
  NativeAmount: async (contract, amount: BigNumber) => {
    const { data } = await nativeInfo(platformId);

    const decimal = 18;
    const symbol = data.symbol;

    const a = "".concat("0".repeat(decimal), amount.toString());
    const b = ""
      .concat(a.slice(0, -decimal), ".", a.slice(-decimal))
      .match(
        /^(?:^0*([^0]\d*)\.0*$)|(?:^0*([^0]\d*\.\d{0,2})\d*$)|(?:^0*(0\.0*[^d]\d{0,2})\d*$)|(^00*$)/
      );

    return `${b[1] || b[2] || b[3] || b[4]} ${symbol}`;
  },
  Address: async (a) => a,
});

const functions = {
  "transfer(address to, uint256 amount)": async (
    { ERC20Amount, NativeAmount, Address },
    tx,
    { to, amount }
  ) => ({
    title: `Transfer ${await ERC20Amount(tx.to, amount)}`,
    description: `Transfer ${await ERC20Amount(
      tx.to,
      amount
    )} to ${await Address(to)}`,
    normalForm: {
      type: "transfer",
      token: tx.to,
      amount,
    },
  }),
  // uniswap v2
  "addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { tokenA, tokenB, amountADesired, amountBDesired, to }
    ) => ({
      title: `Add Liquidity ${await ERC20Amount(
        tokenA,
        amountADesired
      )} + ${await ERC20Amount(tokenB, amountBDesired)}`,
      description: `Add Liquidity (${await ERC20Amount(
        tokenA,
        amountADesired
      )} + ${await ERC20Amount(
        tokenB,
        amountBDesired
      )} and send to ${await Address(to)}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "addLiquidity",
              contents: [
                { token: tokenA, amount: amountADesired },
                { token: tokenB, amount: amountBDesired },
              ],
            },
    }),
  "addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { token, amountTokenDesired, to }
    ) => ({
      title: `Add Liquidity ${await ERC20Amount(
        token,
        amountTokenDesired
      )} + ${await NativeAmount(tx.value)}`,
      description: `Add Liquidity (${await ERC20Amount(
        token,
        amountTokenDesired
      )} + ${await NativeAmount(tx.value)} and send to ${await Address(to)}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "addLiquidity",
              contents: [
                { token: token, amount: amountTokenDesired },
                { token: "native", amount: tx.value },
              ],
            },
    }),
  "removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { tokenA, tokenB, liquidity, amountAMin, amountBMin, to }
    ) => ({
      title: `Remove Liquidity ${await ERC20Amount(
        tokenA,
        amountAMin
      )} + ${await ERC20Amount(tokenB, amountBMin)}`,
      description: `Remove Liquidity${await ERC20Amount(
        tokenA,
        amountAMin
      )} + ${await ERC20Amount(tokenB, amountBMin)} and send to ${await Address(
        to
      )}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "removeLiquidity",
              contents: [
                { token: tokenA, amount: amountAMin },
                { token: tokenB, amount: amountBMin },
              ],
            },
    }),
  "removeLiquidityETH(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { token, liquidity, amountTokenMin, amountETHMin, to }
    ) => ({
      title: `Remove Liquidity ${await ERC20Amount(
        token,
        amountTokenMin
      )} + ${await NativeAmount(amountETHMin)}`,
      description: `Remove Liquidity (${await ERC20Amount(
        token,
        amountTokenMin
      )} + ${await NativeAmount(amountETHMin)} and send to ${await Address(
        to
      )}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "removeLiquidity",
              contents: [
                { token: token, amount: amountTokenMin },
                { token: "native", amount: amountETHMin },
              ],
            },
    }),
  "removeLiquidityWithPermit(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { tokenA, tokenB, liquidity, amountAMin, amountBMin, to }
    ) => ({
      title: `Remove Liquidity ${await ERC20Amount(
        tokenA,
        amountAMin
      )} + ${await ERC20Amount(tokenB, amountBMin)}`,
      description: `Remove Liquidity${await ERC20Amount(
        tokenA,
        amountAMin
      )} + ${await ERC20Amount(tokenB, amountBMin)} and send to ${await Address(
        to
      )}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "removeLiquidity",
              contents: [
                { token: tokenA, amount: amountAMin },
                { token: tokenB, amount: amountBMin },
              ],
            },
    }),
  "removeLiquidityETHWithPermit(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { token, liquidity, amountTokenMin, amountETHMin, to }
    ) => ({
      title: `Remove Liquidity ${await ERC20Amount(
        token,
        amountTokenMin
      )} + ${await NativeAmount(amountETHMin)}`,
      description: `Remove Liquidity (${await ERC20Amount(
        token,
        amountTokenMin
      )} + ${await NativeAmount(amountETHMin)} and send to ${await Address(
        to
      )}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "removeLiquidity",
              contents: [
                { token: token, amount: amountTokenMin },
                { token: "native", amount: amountETHMin },
              ],
            },
    }),
  "removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { token, liquidity, amountTokenMin, amountETHMin, to }
    ) => ({
      title: `Remove Liquidity ${await ERC20Amount(
        token,
        amountTokenMin
      )} + ${await NativeAmount(amountETHMin)}`,
      description: `Remove Liquidity (${await ERC20Amount(
        token,
        amountTokenMin
      )} + ${await NativeAmount(amountETHMin)} and send to ${await Address(
        to
      )}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "removeLiquidity",
              contents: [
                { token: token, amount: amountTokenMin },
                { token: "native", amount: amountETHMin },
              ],
            },
    }),
  "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { token, liquidity, amountTokenMin, amountETHMin, to }
    ) => ({
      title: `Remove Liquidity ${await ERC20Amount(
        token,
        amountTokenMin
      )} + ${await NativeAmount(amountETHMin)}`,
      description: `Remove Liquidity (${await ERC20Amount(
        token,
        amountTokenMin
      )} + ${await NativeAmount(amountETHMin)} and send to ${await Address(
        to
      )}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "removeLiquidity",
              contents: [
                { token: token, amount: amountTokenMin },
                { token: "native", amount: amountETHMin },
              ],
            },
    }),
  "swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { amountIn, amountOutMin, path, to }
    ) => ({
      title: `Swap ${await ERC20Amount(
        path[0],
        amountIn
      )} to ${await ERC20Amount(path[path.length - 1], amountOutMin)}`,
      description: `Swap ${await ERC20Amount(
        path[0],
        amountIn
      )} to ${await ERC20Amount(
        path[path.length - 1],
        amountOutMin
      )} and send to ${await Address(to)}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "swap",
              from: { token: path[0], amount: amountIn },
              to: { token: path[path.length - 1], amount: amountOutMin },
              exactness: "input",
            },
    }),
  "swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { amountInMax, amountOut, path, to }
    ) => ({
      title: `Swap ${await ERC20Amount(
        path[0],
        amountInMax
      )} to ${await ERC20Amount(path[path.length - 1], amountOut)}`,
      description: `Swap ${await ERC20Amount(
        path[0],
        amountInMax
      )} to ${await ERC20Amount(
        path[path.length - 1],
        amountOut
      )} and send to ${await Address(to)}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "swap",
              from: { token: path[0], amount: amountInMax },
              to: { token: path[path.length - 1], amount: amountOut },
              exactness: "output",
            },
    }),
  "swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { amountOutMin, path, to }
    ) => ({
      title: `Swap ${await NativeAmount(tx.value)} to ${await ERC20Amount(
        path[path.length - 1],
        amountOutMin
      )}`,
      description: `Swap ${await NativeAmount(tx.value)} to ${await ERC20Amount(
        path[path.length - 1],
        amountOutMin
      )} and send to ${await Address(to)}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "swap",
              from: { token: "native", amount: tx.value },
              to: { token: path[path.length - 1], amount: amountOutMin },
              exactness: "input",
            },
    }),

  "swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { amountOut, path, to }
    ) => ({
      title: `Swap ${await NativeAmount(tx.value)} to ${await ERC20Amount(
        path[path.length - 1],
        amountOut
      )}`,
      description: `Swap ${await NativeAmount(tx.value)} to ${await ERC20Amount(
        path[path.length - 1],
        amountOut
      )} and send to ${await Address(to)}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "swap",
              from: { token: "native", amount: tx.value },
              to: { token: path[path.length - 1], amount: amountOut },
              exactness: "output",
            },
    }),
  "swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { amountIn, amountOutMin, path, to }
    ) => ({
      title: `Swap ${await ERC20Amount(
        path[0],
        amountIn
      )} to ${await ERC20Amount(path[path.length - 1], amountOutMin)}`,
      description: `Swap ${await ERC20Amount(
        path[0],
        amountIn
      )} to ${await ERC20Amount(
        path[path.length - 1],
        amountOutMin
      )} and send to ${await Address(to)}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "swap",
              from: { token: path[0], amount: amountIn },
              to: { token: "native", amount: amountOutMin },
              exactness: "input",
            },
    }),
  "swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { amountInMax, amountOut, path, to }
    ) => ({
      title: `Swap ${await ERC20Amount(
        path[0],
        amountInMax
      )} to ${await ERC20Amount(path[path.length - 1], amountOut)}`,
      description: `Swap ${await ERC20Amount(
        path[0],
        amountInMax
      )} to ${await ERC20Amount(
        path[path.length - 1],
        amountOut
      )} and send to ${await Address(to)}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "swap",
              from: { token: path[0], amount: amountInMax },
              to: { token: path[path.length - 1], amount: amountOut },
              exactness: "output",
            },
    }),
  "swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { amountIn, amountOutMin, path, to }
    ) => ({
      title: `Swap ${await ERC20Amount(
        path[0],
        amountIn
      )} to ${await ERC20Amount(path[path.length - 1], amountOutMin)}`,
      description: `Swap ${await ERC20Amount(
        path[0],
        amountIn
      )} to ${await ERC20Amount(
        path[path.length - 1],
        amountOutMin
      )} and send to ${await Address(to)}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "swap",
              from: { token: path[0], amount: amountIn },
              to: { token: path[path.length - 1], amount: amountOutMin },
              exactness: "input",
            },
    }),
  "swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { amountOutMin, path, to }
    ) => ({
      title: `Swap ${await NativeAmount(tx.value)} to ${await ERC20Amount(
        path[path.length - 1],
        amountOutMin
      )}`,
      description: `Swap ${await NativeAmount(tx.value)} to ${await ERC20Amount(
        path[path.length - 1],
        amountOutMin
      )} and send to ${await Address(to)}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "swap",
              from: { token: "native", amount: tx.value },
              to: { token: path[path.length - 1], amount: amountOutMin },
              exactness: "input",
            },
    }),
  "swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)":
    async (
      { ERC20Amount, NativeAmount, Address },
      tx,
      { amountIn, amountOutMin, path, to }
    ) => ({
      title: `Swap ${await ERC20Amount(
        path[0],
        amountIn
      )} to ${await ERC20Amount(path[path.length - 1], amountOutMin)}`,
      description: `Swap ${await ERC20Amount(
        path[0],
        amountIn
      )} to ${await ERC20Amount(
        path[path.length - 1],
        amountOutMin
      )} and send to ${await Address(to)}`,
      suspicious: to != tx.from,
      normalForm:
        to != tx.from
          ? { type: "suspicious" }
          : {
              type: "swap",
              from: { token: path[0], amount: amountIn },
              to: { token: "native", amount: amountOutMin },
              exactness: "input",
            },
    }),
};

const functionsCompiled = Object.fromEntries(
  Object.entries(functions).map(([k, v]) => [
    toSignature(k),
    (p, tx, args) => v(p, tx, Object.fromEntries(zip(paramNames(k), args))),
  ])
);

export type PlatformId =
  | "binance-smart-chain"
  | "polygon-pos"
  | "klay-token"
  | "ethereum";

export type TxType = "addLiquidity" | "swap" | "suspicious" | "removeLiquidity";
interface ExplainResult {
  title: string;
  description?: string;
  signature: string;
  suspicious?: boolean;
  normalForm?: any;
}

/**
 *
 * @param platformId
 * https://api.coingecko.com/api/v3/asset_platforms
 * @param tx
 * @returns
 */

export const explain = async (
  tx: { data: string; to: string },
  platformId?: PlatformId
): Promise<ExplainResult> => {
  const sig = await signature(tx.data.slice(0, 10));
  const params = utils.defaultAbiCoder.decode(
    [sig.match(/^[^\(]+(\(.*\))/)[1]],
    "0x" + tx.data.slice(10)
  )[0];

  try {
    if (sig in functionsCompiled && !!platformId) {
      const result = await functionsCompiled[sig](
        platform(platformId),
        tx,
        params
      );
      return { ...result, signature: sig };
    }
  } catch (e) {
    console.error(e);
    return { title: sig, signature: sig };
  }

  return { title: sig, signature: sig };
};
