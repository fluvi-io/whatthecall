export type PlatformId = "binance-smart-chain" | "polygon-pos" | "klay-token" | "ethereum";
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
 * @returns ExplainResult
 */
export declare const explain: (tx: {
    data: string;
    to: string;
}, platformId?: string) => Promise<ExplainResult>;
export {};
