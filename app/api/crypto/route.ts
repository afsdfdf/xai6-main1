import { NextResponse } from "next/server"

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"
const COINGECKO_API_URL_BACKUP = "https://pro-api.coingecko.com/api/v3"

// 内存缓存
let cache = {
  popularTokens: null as any,
  trendingTokens: null as any,
  lastFetch: 0,
  apiStatus: "unknown" as "up" | "down" | "unknown",
}

// 缓存过期时间（1分钟）
const CACHE_EXPIRY = 60 * 1000

// 重试配置
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1秒

// 检查 API 状态
async function checkApiStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/ping`)
    if (!response.ok) {
      throw new Error(`API status check failed: ${response.status}`)
    }
    const data = await response.json()
    return data.gecko_says === "(V3) To the Moon!"
  } catch (error) {
    console.error("API status check error:", error)
    return false
  }
}

// 带重试的 fetch 函数
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<Response> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response
  } catch (error: any) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      // 如果是主 API 失败，尝试使用备用 API
      if (url.startsWith(COINGECKO_API_URL) && retries === MAX_RETRIES - 1) {
        console.log("Switching to backup API...")
        const backupUrl = url.replace(COINGECKO_API_URL, COINGECKO_API_URL_BACKUP)
        return fetchWithRetry(backupUrl, {
          ...options,
          headers: {
            ...options.headers,
            'x-cg-pro-api-key': 'CG-P9eAeiqMjGEMBxnVuWcSLAnA',
          }
        }, retries - 1)
      }
      return fetchWithRetry(url, options, retries - 1)
    }
    throw error
  }
}

// 模拟数据，用于 API 完全不可用时
const fallbackData = {
  popularTokens: [
    { id: "bitcoin", name: "BTC", symbol: "Bitcoin", price: 65000, change: 0, icon: "btc", color: "#F7931A" },
    { id: "ethereum", name: "ETH", symbol: "Ethereum", price: 3500, change: 0, icon: "eth", color: "#627EEA" },
    { id: "binancecoin", name: "BNB", symbol: "BNB", price: 600, change: 0, icon: "bnb", color: "#F3BA2F" },
    { id: "solana", name: "SOL", symbol: "Solana", price: 140, change: 0, icon: "sol", color: "#00FFA3" },
    { id: "cardano", name: "ADA", symbol: "Cardano", price: 1.2, change: 0, icon: "ada", color: "#0033AD" },
  ],
  trendingTokens: [
    { id: "pepe", name: "PEPE", symbol: "Pepe", price: 0.000001, change: 0, icon: "pepe", color: "#00B300" },
    { id: "worldcoin", name: "WLD", symbol: "Worldcoin", price: 5, change: 0, icon: "wld", color: "#2B6CB0" },
    { id: "sui", name: "SUI", symbol: "Sui", price: 1.5, change: 0, icon: "sui", color: "#6B46C1" },
    { id: "bonk", name: "BONK", symbol: "Bonk", price: 0.00001, change: 0, icon: "bonk", color: "#DD6B20" },
    { id: "blast", name: "BLAST", symbol: "Blast", price: 0.5, change: 0, icon: "blast", color: "#805AD5" },
  ],
}

// This is a server-side API route that will fetch data from DexScreener
// In a real app, you would use the actual DexScreener API
export async function GET() {
  try {
    // 检查 API 状态
    const isApiUp = await checkApiStatus()
    cache.apiStatus = isApiUp ? "up" : "down"
    console.log(`API Status: ${cache.apiStatus}`)

    // 如果 API 不可用且没有缓存数据，直接返回模拟数据
    if (!isApiUp && !cache.lastFetch) {
      console.log("API is down and no cache available, returning fallback data")
      return NextResponse.json({
        success: true,
        data: fallbackData,
        apiStatus: "down",
      })
    }

    // 检查缓存是否有效
    if (cache.lastFetch && Date.now() - cache.lastFetch < CACHE_EXPIRY) {
      console.log("Returning cached data")
      return NextResponse.json({
        success: true,
        data: {
          popularTokens: cache.popularTokens,
          trendingTokens: cache.trendingTokens,
        },
        apiStatus: cache.apiStatus,
      })
    }

    console.log("Fetching popular tokens...")
    // 获取热门代币
    const popularResponse = await fetchWithRetry(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false&locale=en`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      }
    )

    if (!popularResponse.ok) {
      // 如果是速率限制错误，返回缓存的数据（如果有）
      if (popularResponse.status === 429 && cache.popularTokens) {
        console.log("Rate limited, returning cached popular tokens")
        return NextResponse.json({
          success: true,
          data: {
            popularTokens: cache.popularTokens,
            trendingTokens: cache.trendingTokens,
          },
          apiStatus: cache.apiStatus,
        })
      }
      const errorText = await popularResponse.text()
      throw new Error(`Failed to fetch popular tokens: ${popularResponse.status} ${popularResponse.statusText}\n${errorText}`)
    }

    const popularTokens = await popularResponse.json()
    console.log("Popular tokens fetched successfully")

    console.log("Fetching trending tokens...")
    // 获取趋势代币
    const trendingResponse = await fetchWithRetry(`${COINGECKO_API_URL}/search/trending`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    })

    if (!trendingResponse.ok) {
      // 如果是速率限制错误，返回缓存的数据（如果有）
      if (trendingResponse.status === 429 && cache.trendingTokens) {
        console.log("Rate limited, returning cached trending tokens")
        return NextResponse.json({
          success: true,
          data: {
            popularTokens: cache.popularTokens,
            trendingTokens: cache.trendingTokens,
          },
          apiStatus: cache.apiStatus,
        })
      }
      const errorText = await trendingResponse.text()
      throw new Error(`Failed to fetch trending tokens: ${trendingResponse.status} ${trendingResponse.statusText}\n${errorText}`)
    }

    const trendingData = await trendingResponse.json()
    console.log("Trending tokens fetched successfully")

    // 格式化数据
    const formattedPopularTokens = popularTokens.map((token: any) => ({
      id: token.id,
      name: token.symbol.toUpperCase(),
      symbol: token.name,
      price: token.current_price,
      change: token.price_change_percentage_24h || 0,
      icon: token.symbol.toLowerCase(),
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
    }))

    const trendingTokens = trendingData.coins.map((coin: any) => ({
      id: coin.item.id,
      name: coin.item.symbol.toUpperCase(),
      symbol: coin.item.name,
      price: coin.item.price_btc,
      change: coin.item.data?.price_change_percentage_24h?.usd || 0,
      icon: coin.item.symbol.toLowerCase(),
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
    }))

    // 更新缓存
    cache = {
      popularTokens: formattedPopularTokens,
      trendingTokens,
      lastFetch: Date.now(),
      apiStatus: "up",
    }

    return NextResponse.json({
      success: true,
      data: {
        popularTokens: formattedPopularTokens,
        trendingTokens,
      },
      apiStatus: "up",
    })
  } catch (error: any) {
    console.error("Error fetching cryptocurrency data:", error.message)
    // 如果发生错误且有缓存数据，返回缓存的数据
    if (cache.lastFetch) {
      console.log("Error occurred, returning cached data")
      return NextResponse.json({
        success: true,
        data: {
          popularTokens: cache.popularTokens,
          trendingTokens: cache.trendingTokens,
        },
        apiStatus: cache.apiStatus,
      })
    }
    // 如果没有缓存数据，返回模拟数据
    console.log("No cache available, returning fallback data")
    return NextResponse.json({
      success: true,
      data: fallbackData,
      apiStatus: "down",
    })
  }
}
