import { NextResponse } from 'next/server';

// API key for Ave.ai
const AVE_API_KEY = "NMUuJmYHJB6d91bIpgLqpuLLKYVws82lj0PeDP3UEb19FoyWFJUVGLsgE95XTEmA";

// 临时测试数据，在API调用失败时使用
const dummyTopics = [
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

const dummyTokens = Array(50).fill(0).map((_, index) => ({
  "token": `0xtoken${index}`,
  "chain": index % 2 === 0 ? "bsc" : "eth",
  "symbol": `TKN${index}`,
  "name": `Token ${index}`,
  "logo_url": `https://example.com/token${index}.png`,
  "current_price_usd": Math.random() * 1000,
  "price_change_24h": (Math.random() * 20) - 10,
  "tx_volume_u_24h": Math.random() * 10000000,
  "holders": Math.floor(Math.random() * 100000)
}));

// 缓存数据结构
interface CacheItem {
  data: any;
  timestamp: number;
}

// 缓存对象，用于存储不同主题的数据
const cache: Record<string, CacheItem> = {};

// 缓存有效期（1小时，单位为毫秒）
const CACHE_TTL = 60 * 60 * 1000;

// 检查缓存是否有效
function isCacheValid(cacheKey: string): boolean {
  if (!cache[cacheKey]) return false;
  const now = Date.now();
  return now - cache[cacheKey].timestamp < CACHE_TTL;
}

// 获取真实API数据
async function fetchAveApiData(endpoint: string) {
  console.log(`Fetching data from: ${endpoint}`);
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Accept": "*/*",
        "X-API-KEY": AVE_API_KEY
      },
      cache: 'no-store',
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API response received:", JSON.stringify(data).substring(0, 100) + "...");
    return data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

// 将API返回的代币数据转换为我们需要的格式
function transformTokenData(apiData: any[]): any[] {
  return apiData.map(token => {
    // 尝试从appendix解析额外信息
    let tokenName = token.symbol || "";
    try {
      if (token.appendix) {
        const appendixData = JSON.parse(token.appendix);
        if (appendixData.tokenName) {
          tokenName = appendixData.tokenName;
        }
      }
    } catch (e) {
      console.error('Error parsing appendix data:', e);
    }

    return {
      token: token.token || "",
      chain: token.chain || "",
      symbol: token.symbol || "",
      name: tokenName || token.symbol || "Unknown Token",
      logo_url: token.logo_url || "",
      current_price_usd: parseFloat(token.current_price_usd) || 0,
      price_change_24h: parseFloat(token.price_change_24h) || 0,
      tx_volume_u_24h: parseFloat(token.tx_volume_u_24h) || 0,
      holders: parseInt(token.holders) || 0,
      market_cap: token.market_cap || "0",
      fdv: token.fdv || "0",
      risk_score: token.risk_score || "0"
    };
  });
}

// Get token rank topics
export async function GET(request: Request) {
  console.log("API route called:", request.url);
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic') || 'hot';
  console.log("Topic requested:", topic);
  
  try {
    // 如果请求的是话题列表
    if (topic === 'topics') {
      const cacheKey = 'topics';
      
      // 检查缓存是否有效
      if (isCacheValid(cacheKey)) {
        console.log("Returning cached topics data");
        return NextResponse.json({ topics: cache[cacheKey].data }, { status: 200 });
      }
      
      console.log("Fetching fresh topics data from Ave.ai API");
      
      // 尝试获取真实数据
      try {
        const data = await fetchAveApiData("https://prod.ave-api.com/v2/ranks/topics");
        
        if (data.status !== 1 || !data.data) {
          console.error("Invalid API response format:", data);
          throw new Error('Invalid response format or unsuccessful request');
        }
        
        // 更新缓存
        cache[cacheKey] = {
          data: data.data,
          timestamp: Date.now()
        };
        
        console.log("Returning fresh topics data and updating cache");
        return NextResponse.json({ topics: data.data }, { status: 200 });
      } catch (apiError) {
        console.error("Error fetching from Ave.ai, using dummy data:", apiError);
        
        // 如果API调用失败，使用测试数据
        cache[cacheKey] = {
          data: dummyTopics,
          timestamp: Date.now()
        };
        
        return NextResponse.json({ topics: dummyTopics }, { status: 200 });
      }
    } 
    // 否则返回特定主题的代币列表
    else {
      const cacheKey = `tokens_${topic}`;
      
      // 检查缓存是否有效
      if (isCacheValid(cacheKey)) {
        console.log(`Returning cached tokens data for topic: ${topic}`);
        return NextResponse.json({ 
          topic: topic,
          tokens: cache[cacheKey].data 
        }, { status: 200 });
      }
      
      console.log(`Fetching fresh tokens data for topic: ${topic} from Ave.ai API`);
      
      // 尝试获取真实数据
      try {
        // 使用正确的API端点
        const data = await fetchAveApiData(`https://prod.ave-api.com/v2/ranks?topic=${topic}`);
        
        if (data.status !== 1 || !data.data) {
          console.error("Invalid API response format:", data);
          throw new Error('Invalid response format or unsuccessful request');
        }
        
        // 转换数据格式
        const transformedData = transformTokenData(data.data);
        
        // 更新缓存
        cache[cacheKey] = {
          data: transformedData,
          timestamp: Date.now()
        };
        
        console.log(`Returning fresh tokens data for topic: ${topic} and updating cache`);
        return NextResponse.json({ 
          topic: topic,
          tokens: transformedData 
        }, { status: 200 });
      } catch (apiError) {
        console.error(`Error fetching from Ave.ai for topic ${topic}, using dummy data:`, apiError);
        
        // 如果API调用失败，使用测试数据
        cache[cacheKey] = {
          data: dummyTokens,
          timestamp: Date.now()
        };
        
        return NextResponse.json({ 
          topic: topic,
          tokens: dummyTokens 
        }, { status: 200 });
      }
    }
  } catch (error) {
    console.error("Error in API route handler:", error);
    
    // 如果有缓存但已过期，仍然可以在API失败时返回过期的缓存数据
    const cacheKey = topic === 'topics' ? 'topics' : `tokens_${topic}`;
    if (cache[cacheKey]) {
      console.log(`API request failed, returning stale cache for ${cacheKey}`);
      if (topic === 'topics') {
        return NextResponse.json({ topics: cache[cacheKey].data }, { status: 200 });
      } else {
        return NextResponse.json({ 
          topic: topic,
          tokens: cache[cacheKey].data 
        }, { status: 200 });
      }
    }
    
    // 如果连缓存都没有，返回测试数据
    console.log("No cache available, returning dummy data");
    if (topic === 'topics') {
      return NextResponse.json({ topics: dummyTopics }, { status: 200 });
    } else {
      return NextResponse.json({ 
        topic: topic,
        tokens: dummyTokens 
      }, { status: 200 });
    }
  }
} 