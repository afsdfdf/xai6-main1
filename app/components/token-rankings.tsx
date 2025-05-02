"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { useApiData } from "@/app/hooks/use-api-data"
import { useTranslation } from "@/app/i18n/client"
import { TokenRanking, RankTopic } from "@/app/types/token"
import TokenList from "./token-list/TokenList"
import TopicTabs from "./token-list/TopicTabs"

// 测试数据 - 在API失败时使用
const dummyTopics: RankTopic[] = [
  {
    "id": "hot",
    "name_en": "Hot",
    "name_zh": "热门"
  },
  {
    "id": "new",
    "name_en": "New",
    "name_zh": "新币"
  },
  {
    "id": "meme",
    "name_en": "Meme",
    "name_zh": "Meme"
  }
];

// 测试代币数据
const dummyTokens: TokenRanking[] = [
  {
    "token": "0xa5957e0e2565dc93880da7be32abcbdf55788888",
    "chain": "bsc",
    "symbol": "ATM",
    "name": "ATM Token",
    "logo_url": "https://www.logofacade.com/token_icon_request/65ffb2a20a9e59af22dae8a5_1711256226.png",
    "current_price_usd": 0.000010993584854389429,
    "price_change_24h": -76.53,
    "tx_volume_u_24h": 13385053.845136339,
    "holders": 14304
  },
  {
    "token": "0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc",
    "chain": "eth",
    "symbol": "BTC",
    "name": "Bitcoin",
    "logo_url": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    "current_price_usd": 66000.5,
    "price_change_24h": 2.3,
    "tx_volume_u_24h": 25000000,
    "holders": 1000000
  }
];

// 分页配置
const ITEMS_PER_PAGE = 50;

interface TokenRankingsProps {
  darkMode: boolean
}

const TokenRankings = memo(function TokenRankings({ darkMode }: TokenRankingsProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const [activeTopicId, setActiveTopicId] = useState<string>("hot")

  // 获取主题列表
  const { 
    data: topics = dummyTopics,
    isLoading: isTopicsLoading,
    error: topicsError,
    refresh: refreshTopics
  } = useApiData<RankTopic[]>(
    async () => {
        const response = await fetch('/api/tokens?topic=topics');
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.topics) {
        return data.topics;
        } else {
        throw new Error("Invalid API response format");
      }
    },
    {
      cacheKey: 'token-topics',
      cacheTTL: 30 * 60 * 1000, // 30分钟缓存
      initialData: dummyTopics
    }
  );

  // 获取代币列表
  const { 
    data: tokens = [],
    isLoading: isTokensLoading,
    error: tokensError,
    refresh: refreshTokens
  } = useApiData<TokenRanking[]>(
    async () => {
      const response = await fetch(`/api/tokens?topic=${activeTopicId}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
        
      if (!response.ok) {
        throw new Error(`API请求失败，状态码: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.tokens && Array.isArray(data.tokens)) {
        // 确保每个代币对象有所有必要的字段，没有的赋予默认值
        return data.tokens.map((token: any) => ({
          token: token.token || "",
          chain: token.chain || "unknown",
          symbol: token.symbol || "Unknown",
          name: token.name || "Unknown Token",
          logo_url: token.logo_url || "",
          current_price_usd: typeof token.current_price_usd === 'number' ? token.current_price_usd : 0,
          price_change_24h: typeof token.price_change_24h === 'number' ? token.price_change_24h : 0,
          tx_volume_u_24h: typeof token.tx_volume_u_24h === 'number' ? token.tx_volume_u_24h : 0,
          holders: typeof token.holders === 'number' ? token.holders : 0,
          market_cap: token.market_cap,
          fdv: token.fdv,
          risk_score: token.risk_score
        }));
      } else {
        throw new Error("API返回数据格式无效，无法加载代币信息");
      }
    },
    {
      deps: [activeTopicId],
      cacheKey: `tokens-${activeTopicId}`,
      cacheTTL: 5 * 60 * 1000, // 5分钟缓存
      initialData: activeTopicId === "hot" ? dummyTokens : []
    }
  );

  // 处理主题切换
  const handleTopicChange = useCallback((topicId: string) => {
    setActiveTopicId(topicId);
  }, []);

  // 处理刷新
  const handleRefresh = useCallback(() => {
    refreshTokens();
    toast({
      title: "刷新中",
      description: "正在刷新代币数据",
    });
  }, [refreshTokens]);

  // 处理代币点击
  const handleTokenClick = useCallback((token: TokenRanking) => {
    if (token && token.chain && token.token) {
      router.push(`/kline?blockchain=${token.chain}&address=${token.token}`);
    }
  }, [router]);

  // 如果获取主题失败，显示错误消息
  if (topicsError && topics.length === 0) {
      return (
      <div className="py-8 text-center text-red-500">
        加载主题失败
        </div>
      );
    }

  return (
    <div className="mb-6">
      <TopicTabs
        topics={topics}
        activeTopicId={activeTopicId}
        onTopicChange={handleTopicChange}
      />
      
      <TokenList
        tokens={tokens}
        darkMode={darkMode}
        isLoading={isTokensLoading}
        error={tokensError}
        onTokenClick={handleTokenClick}
        onRefresh={handleRefresh}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
});

export default TokenRankings;