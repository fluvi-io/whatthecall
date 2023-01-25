/**
 *
 * @param platformId
 * https://api.coingecko.com/api/v3/asset_platforms
 * @param tx
 * @returns
 */
type PlatformId = "binance-smart-chain" | "polygon-pos" | "klay-token" | "ethereum";
interface ExplainResult {
    title: string;
    description?: string;
    signature: string;
    suspicious?: boolean;
    normalForm?: any;
}
export declare const explain: (tx: {
    data: string;
    to: string;
}, platformId?: PlatformId) => Promise<ExplainResult>;
export {};
