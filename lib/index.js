"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.explain = void 0;
const ethers_1 = require("ethers");
const fourByte = require("4byte");
const CoinGecko = require("coingecko-api");
const selector = (signature) => ethers_1.utils.keccak256(utf8ToHex(toSignature(signature))).slice(0, 10);
const toSignature = (def) => def.replaceAll(/\ +[^ ]+ *(?=[,)])/g, "").replaceAll(/\ +/g, "");
const extractMethod = (signature) => signature.split("(")[0];
function utf8ToHex(str) {
    return ("0x" +
        Array.from(str)
            .map((c) => c.charCodeAt(0) < 128
            ? c.charCodeAt(0).toString(16)
            : encodeURIComponent(c).replace(/\%/g, "").toLowerCase())
            .join(""));
}
function memoizeAsync(f) {
    const dic = new Map();
    return function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = dic.get(args);
            if (val !== undefined)
                return val;
            else {
                const ret = yield f(...args);
                dic.set(args, ret);
                return ret;
            }
        });
    };
}
const CoinGeckoClient = new CoinGecko();
const contractInfo = memoizeAsync((p, c) => __awaiter(void 0, void 0, void 0, function* () { return yield CoinGeckoClient.coins.fetchCoinContractInfo(c, p); }));
const nativeInfo = memoizeAsync((p) => __awaiter(void 0, void 0, void 0, function* () { return yield CoinGeckoClient.coins.fetch(p); }));
const signature = memoizeAsync((a) => __awaiter(void 0, void 0, void 0, function* () {
    const r = yield fourByte(a);
    return r[r.length - 1];
}));
const zip = (x, y) => Array.from(Array(Math.max(x.length, y.length)), (_, i) => [x[i], y[i]]);
const paramNames = (str) => str.match(/(?<=[0-9a-zA-Z]+ )([0-9a-zA-Z]+)/g);
const platform = (platformId) => ({
    ERC20Amount: (contract, amount) => __awaiter(void 0, void 0, void 0, function* () {
        const { data } = yield contractInfo(platformId, contract);
        const decimal = data.detail_platforms[platformId].decimal_place;
        const symbol = data.symbol;
        const a = "".concat("0".repeat(decimal), amount.toString());
        const b = ""
            .concat(a.slice(0, -decimal), ".", a.slice(-decimal))
            .match(/^(?:^0*([^0]\d*)\.0*$)|(?:^0*([^0]\d*\.\d{0,2})\d*$)|(?:^0*(0\.0*[^d]\d{0,2})\d*$)|(^00*$)/);
        return `${b[1] || b[2] || b[3] || b[4]} ${symbol}`;
    }),
    NativeAmount: (contract, amount) => __awaiter(void 0, void 0, void 0, function* () {
        const { data } = yield nativeInfo(platformId);
        const decimal = 18;
        const symbol = data.symbol;
        const a = "".concat("0".repeat(decimal), amount.toString());
        const b = ""
            .concat(a.slice(0, -decimal), ".", a.slice(-decimal))
            .match(/^(?:^0*([^0]\d*)\.0*$)|(?:^0*([^0]\d*\.\d{0,2})\d*$)|(?:^0*(0\.0*[^d]\d{0,2})\d*$)|(^00*$)/);
        return `${b[1] || b[2] || b[3] || b[4]} ${symbol}`;
    }),
    Address: (a) => __awaiter(void 0, void 0, void 0, function* () { return a; }),
});
const functions = {
    "transfer(address to, uint256 amount)": ({ ERC20Amount, NativeAmount, Address }, tx, { to, amount }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Transfer ${yield ERC20Amount(tx.to, amount)}`,
            description: `Transfer ${yield ERC20Amount(tx.to, amount)} to ${yield Address(to)}`,
            normalForm: {
                type: "transfer",
                token: tx.to,
                amount,
            },
        });
    }),
    // uniswap v2
    "addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { tokenA, tokenB, amountADesired, amountBDesired, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Add Liquidity ${yield ERC20Amount(tokenA, amountADesired)} + ${yield ERC20Amount(tokenB, amountBDesired)}`,
            description: `Add Liquidity (${yield ERC20Amount(tokenA, amountADesired)} + ${yield ERC20Amount(tokenB, amountBDesired)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "addLiquidity",
                    contents: [
                        { token: tokenA, amount: amountADesired },
                        { token: tokenB, amount: amountBDesired },
                    ],
                },
        });
    }),
    "addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { token, amountTokenDesired, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Add Liquidity ${yield ERC20Amount(token, amountTokenDesired)} + ${yield NativeAmount(tx.value)}`,
            description: `Add Liquidity (${yield ERC20Amount(token, amountTokenDesired)} + ${yield NativeAmount(tx.value)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "addLiquidity",
                    contents: [
                        { token: token, amount: amountTokenDesired },
                        { token: "native", amount: tx.value },
                    ],
                },
        });
    }),
    "removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { tokenA, tokenB, liquidity, amountAMin, amountBMin, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Remove Liquidity ${yield ERC20Amount(tokenA, amountAMin)} + ${yield ERC20Amount(tokenB, amountBMin)}`,
            description: `Remove Liquidity${yield ERC20Amount(tokenA, amountAMin)} + ${yield ERC20Amount(tokenB, amountBMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "removeLiquidity",
                    contents: [
                        { token: tokenA, amount: amountAMin },
                        { token: tokenB, amount: amountBMin },
                    ],
                },
        });
    }),
    "removeLiquidityETH(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { token, liquidity, amountTokenMin, amountETHMin, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Remove Liquidity ${yield ERC20Amount(token, amountTokenMin)} + ${yield NativeAmount(amountETHMin)}`,
            description: `Remove Liquidity (${yield ERC20Amount(token, amountTokenMin)} + ${yield NativeAmount(amountETHMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "removeLiquidity",
                    contents: [
                        { token: token, amount: amountTokenMin },
                        { token: "native", amount: amountETHMin },
                    ],
                },
        });
    }),
    "removeLiquidityWithPermit(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s)": ({ ERC20Amount, NativeAmount, Address }, tx, { tokenA, tokenB, liquidity, amountAMin, amountBMin, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Remove Liquidity ${yield ERC20Amount(tokenA, amountAMin)} + ${yield ERC20Amount(tokenB, amountBMin)}`,
            description: `Remove Liquidity${yield ERC20Amount(tokenA, amountAMin)} + ${yield ERC20Amount(tokenB, amountBMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "removeLiquidity",
                    contents: [
                        { token: tokenA, amount: amountAMin },
                        { token: tokenB, amount: amountBMin },
                    ],
                },
        });
    }),
    "removeLiquidityETHWithPermit(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s)": ({ ERC20Amount, NativeAmount, Address }, tx, { token, liquidity, amountTokenMin, amountETHMin, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Remove Liquidity ${yield ERC20Amount(token, amountTokenMin)} + ${yield NativeAmount(amountETHMin)}`,
            description: `Remove Liquidity (${yield ERC20Amount(token, amountTokenMin)} + ${yield NativeAmount(amountETHMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "removeLiquidity",
                    contents: [
                        { token: token, amount: amountTokenMin },
                        { token: "native", amount: amountETHMin },
                    ],
                },
        });
    }),
    "removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { token, liquidity, amountTokenMin, amountETHMin, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Remove Liquidity ${yield ERC20Amount(token, amountTokenMin)} + ${yield NativeAmount(amountETHMin)}`,
            description: `Remove Liquidity (${yield ERC20Amount(token, amountTokenMin)} + ${yield NativeAmount(amountETHMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "removeLiquidity",
                    contents: [
                        { token: token, amount: amountTokenMin },
                        { token: "native", amount: amountETHMin },
                    ],
                },
        });
    }),
    "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s)": ({ ERC20Amount, NativeAmount, Address }, tx, { token, liquidity, amountTokenMin, amountETHMin, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Remove Liquidity ${yield ERC20Amount(token, amountTokenMin)} + ${yield NativeAmount(amountETHMin)}`,
            description: `Remove Liquidity (${yield ERC20Amount(token, amountTokenMin)} + ${yield NativeAmount(amountETHMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "removeLiquidity",
                    contents: [
                        { token: token, amount: amountTokenMin },
                        { token: "native", amount: amountETHMin },
                    ],
                },
        });
    }),
    "swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { amountIn, amountOutMin, path, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Swap ${yield ERC20Amount(path[0], amountIn)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)}`,
            description: `Swap ${yield ERC20Amount(path[0], amountIn)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "swap",
                    from: { token: path[0], amount: amountIn },
                    to: { token: path[path.length - 1], amount: amountOutMin },
                    exactness: "input",
                },
        });
    }),
    "swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { amountInMax, amountOut, path, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Swap ${yield ERC20Amount(path[0], amountInMax)} to ${yield ERC20Amount(path[path.length - 1], amountOut)}`,
            description: `Swap ${yield ERC20Amount(path[0], amountInMax)} to ${yield ERC20Amount(path[path.length - 1], amountOut)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "swap",
                    from: { token: path[0], amount: amountInMax },
                    to: { token: path[path.length - 1], amount: amountOut },
                    exactness: "output",
                },
        });
    }),
    "swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { amountOutMin, path, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Swap ${yield NativeAmount(tx.value)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)}`,
            description: `Swap ${yield NativeAmount(tx.value)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "swap",
                    from: { token: "native", amount: tx.value },
                    to: { token: path[path.length - 1], amount: amountOutMin },
                    exactness: "input",
                },
        });
    }),
    "swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { amountOut, path, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Swap ${yield NativeAmount(tx.value)} to ${yield ERC20Amount(path[path.length - 1], amountOut)}`,
            description: `Swap ${yield NativeAmount(tx.value)} to ${yield ERC20Amount(path[path.length - 1], amountOut)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "swap",
                    from: { token: "native", amount: tx.value },
                    to: { token: path[path.length - 1], amount: amountOut },
                    exactness: "output",
                },
        });
    }),
    "swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { amountIn, amountOutMin, path, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Swap ${yield ERC20Amount(path[0], amountIn)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)}`,
            description: `Swap ${yield ERC20Amount(path[0], amountIn)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "swap",
                    from: { token: path[0], amount: amountIn },
                    to: { token: "native", amount: amountOutMin },
                    exactness: "input",
                },
        });
    }),
    "swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { amountInMax, amountOut, path, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Swap ${yield ERC20Amount(path[0], amountInMax)} to ${yield ERC20Amount(path[path.length - 1], amountOut)}`,
            description: `Swap ${yield ERC20Amount(path[0], amountInMax)} to ${yield ERC20Amount(path[path.length - 1], amountOut)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "swap",
                    from: { token: path[0], amount: amountInMax },
                    to: { token: path[path.length - 1], amount: amountOut },
                    exactness: "output",
                },
        });
    }),
    "swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { amountIn, amountOutMin, path, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Swap ${yield ERC20Amount(path[0], amountIn)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)}`,
            description: `Swap ${yield ERC20Amount(path[0], amountIn)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "swap",
                    from: { token: path[0], amount: amountIn },
                    to: { token: path[path.length - 1], amount: amountOutMin },
                    exactness: "input",
                },
        });
    }),
    "swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { amountOutMin, path, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Swap ${yield NativeAmount(tx.value)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)}`,
            description: `Swap ${yield NativeAmount(tx.value)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "swap",
                    from: { token: "native", amount: tx.value },
                    to: { token: path[path.length - 1], amount: amountOutMin },
                    exactness: "input",
                },
        });
    }),
    "swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)": ({ ERC20Amount, NativeAmount, Address }, tx, { amountIn, amountOutMin, path, to }) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            title: `Swap ${yield ERC20Amount(path[0], amountIn)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)}`,
            description: `Swap ${yield ERC20Amount(path[0], amountIn)} to ${yield ERC20Amount(path[path.length - 1], amountOutMin)} and send to ${yield Address(to)}`,
            suspicious: to != tx.from,
            normalForm: to != tx.from
                ? { type: "suspicious" }
                : {
                    type: "swap",
                    from: { token: path[0], amount: amountIn },
                    to: { token: "native", amount: amountOutMin },
                    exactness: "input",
                },
        });
    }),
};
const functionsCompiled = Object.fromEntries(Object.entries(functions).map(([k, v]) => [
    toSignature(k),
    (p, tx, args) => v(p, tx, Object.fromEntries(zip(paramNames(k), args))),
]));
/**
 *
 * @param platformId
 * https://api.coingecko.com/api/v3/asset_platforms
 * @param tx
 * @returns ExplainResult
 */
const explain = (tx, platformId) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = yield signature(tx.data.slice(0, 10));
    const params = ethers_1.utils.defaultAbiCoder.decode([sig.match(/^[^\(]+(\(.*\))/)[1]], "0x" + tx.data.slice(10))[0];
    try {
        if (sig in functionsCompiled && !!platformId) {
            const result = yield functionsCompiled[sig](platform(platformId), tx, params);
            return Object.assign(Object.assign({}, result), { signature: sig });
        }
    }
    catch (e) {
        console.error(e);
        return { title: extractMethod(sig), signature: sig };
    }
    return { title: extractMethod(sig), signature: sig };
});
exports.explain = explain;
