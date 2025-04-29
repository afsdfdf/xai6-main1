/**
 * 代币排名项目
 */
export interface TokenRanking {
  token: string;
  chain: string;
  symbol: string;
  name: string;
  logo_url: string;
  current_price_usd: number;
  price_change_24h: number;
  tx_volume_u_24h: number;
  holders: number;
  market_cap?: string;
  fdv?: string;
  risk_score?: string;
}

/**
 * 排名主题
 */
export interface RankTopic {
  id: string;
  name_en: string;
  name_zh: string;
}

/**
 * 代币详情
 */
export interface TokenDetails {
  tokenInfo: {
    symbol: string;
    name: string;
    address: string;
    logo_url?: string;
    price?: number;
    priceChange24h?: number;
    volume24h?: number;
    marketCap?: number;
    holders?: number;
    chain: string;
    token: string;
  };
  price: number;
  priceChange: number;
  volume24h: number;
  marketCap: number;
  totalSupply: number;
  holders: number;
  lpAmount: number;
  lockPercent: number;
}

/**
 * K线数据
 */
export interface KLineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
} 