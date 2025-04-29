// Ave.ai API服务

const AVE_API_KEY = "NMUuJmYHJB6d91bIpgLqpuLLKYVws82lj0PeDP3UEb19FoyWFJUVGLsgE95XTEmA" // 示例API密钥

export interface TokenPrice {
  symbol: string;
  name: string;
  address: string;
  logo_url?: string;
  price?: number;
  current_price_usd?: number;
  priceChange24h?: number;
  price_change_24h?: number;
  volume24h?: number;
  tx_volume_u_24h?: number;
  marketCap?: number;
  market_cap?: string;
  holders?: number;
  chain: string;
  token: string;
}

export interface TokenDetails {
  tokenInfo: TokenPrice;
  price: number;
  priceChange: number;
  volume24h: number;
  marketCap: number;
  totalSupply: number;
  holders: number;
  lpAmount: number;
  lockPercent: number;
}

export interface KLineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * 搜索代币
 * @param keyword 搜索关键词
 * @param chain 可选的链名称
 */
export async function searchTokens(keyword: string, chain?: string): Promise<any[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

  try {
    const url = new URL('https://prod.ave-api.com/v2/tokens');
    url.searchParams.append('keyword', keyword);
    if (chain) url.searchParams.append('chain', chain);

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': '*/*',
        'X-API-KEY': AVE_API_KEY
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`API请求失败: ${response.status} - ${response.statusText}`);
      throw new Error(`API请求失败，状态码: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 1 || !data.data) {
      console.error('无效的API响应格式:', data);
      throw new Error('无效的API响应格式');
    }

    // Return the raw token data to maintain all original fields
    return data.data;
  } catch (error: any) { // 明确指定error类型为any
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('搜索请求超时');
        return [];
      }
      console.error('搜索代币错误:', error.message);
    } else {
      console.error('搜索代币发生未知错误', error);
    }
    return [];
  }
}

/**
 * 获取代币详情
 * @param address 代币地址
 * @param chain 区块链名称
 */
export async function getTokenDetails(address: string, chain: string): Promise<TokenDetails | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时

  try {
    // 使用API路由转发请求，确保可以在Vercel上正常工作
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const url = `${apiUrl}/api/token-details?address=${encodeURIComponent(address)}&chain=${encodeURIComponent(chain)}`;
    
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 60 } // 缓存一分钟
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`获取代币详情请求失败: ${response.status} - ${response.statusText}`);
      throw new Error(`API请求失败，状态码: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('获取代币详情失败:', data.error || '未知错误');
      throw new Error(data.error || '获取代币详情失败');
    }
    
    return {
      tokenInfo: {
        symbol: data.symbol || '',
        name: data.name || '',
        address: data.address || '',
        logo_url: data.logo || '',
        price: data.price || 0,
        priceChange24h: data.priceChange24h || 0,
        volume24h: data.volume24h || 0,
        marketCap: data.marketCap || 0,
        holders: data.holders || 0,
        chain: data.chain || '',
        token: data.address || '',
      },
      price: data.price || 0,
      priceChange: data.priceChange || 0,
      volume24h: data.volume24h || 0,
      marketCap: data.marketCap || 0,
      totalSupply: data.totalSupply || 0,
      holders: data.holders || 0,
      lpAmount: data.lpAmount || 0,
      lockPercent: data.lockPercent || 0,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('获取代币详情请求超时');
      } else {
        console.error('获取代币详情错误:', error.message);
      }
    } else {
      console.error('获取代币详情发生未知错误', error);
    }
    return null;
  }
}

/**
 * 获取代币K线数据
 * @param address 代币地址
 * @param chain 区块链名称
 * @param interval 时间间隔 (1m, 5m, 15m, 30m, 1h, 4h, 1d, etc.)
 * @param limit 获取的数据点数量
 */
export async function getTokenKlineData(
  address: string, 
  chain: string, 
  interval: string = '1d',
  limit: number = 100
): Promise<KLineData[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时

  try {
    // 使用API路由转发请求，确保可以在Vercel上正常工作
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const url = `${apiUrl}/api/token-kline?address=${encodeURIComponent(address)}&chain=${encodeURIComponent(chain)}&interval=${encodeURIComponent(interval)}&limit=${limit}`;
    
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 60 } // 缓存一分钟
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`获取K线数据请求失败: ${response.status} - ${response.statusText}`);
      throw new Error(`API请求失败，状态码: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('获取K线数据失败:', data.error || '未知错误');
      throw new Error(data.error || '获取K线数据失败');
    }
    
    return data.klineData.map((item: any) => ({
      time: item.time,
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
      volume: parseFloat(item.volume),
    }));
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('获取K线数据请求超时');
      } else {
        console.error('获取K线数据错误:', error.message);
      }
    } else {
      console.error('获取K线数据发生未知错误', error);
    }
    return [];
  }
}

/**
 * 获取代币交易历史
 * @param address 代币地址
 * @param chain 区块链名称
 * @param limit 限制返回的交易数量
 */
export async function getTokenTransactions(
  address: string, 
  chain: string, 
  limit: number = 20
): Promise<any[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时

  try {
    // 使用API路由转发请求，确保可以在Vercel上正常工作
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const url = `${apiUrl}/api/token-transactions?address=${encodeURIComponent(address)}&chain=${encodeURIComponent(chain)}&limit=${limit}`;
    
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 300 } // 缓存5分钟
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`获取交易历史请求失败: ${response.status} - ${response.statusText}`);
      throw new Error(`API请求失败，状态码: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('获取交易历史失败:', data.error || '未知错误');
      throw new Error(data.error || '获取交易历史失败');
    }
    
    return data.transactions;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('获取交易历史请求超时');
      } else {
        console.error('获取交易历史错误:', error.message);
      }
    } else {
      console.error('获取交易历史发生未知错误', error);
    }
    return [];
  }
} 