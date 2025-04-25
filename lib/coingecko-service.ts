import { cache } from 'react'
import fs from 'fs'
import path from 'path'

const COINGECKO_API_KEY = 'CG-P9eAeiqMjGEMBxnVuWcSLAnA'
const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'coingecko-cache.json')
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'))
}

interface TrendingCoin {
  item: {
    id: string
    coin_id: number
    name: string
    symbol: string
    market_cap_rank: number
    thumb: string
    small: string
    large: string
    slug: string
    price_btc: number
    score: number
  }
}

export interface CoinGeckoToken {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  total_volume: number
  platforms: Record<string, string>
}

interface CacheData {
  tokens: CoinGeckoToken[]
  lastUpdated: string
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
      return fetchWithRetry(url, options, retries - 1)
    }
    throw error
  }
}

async function fetchTokenDetails(coinId: string): Promise<CoinGeckoToken> {
  const response = await fetchWithRetry(
    `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
    {
      headers: {
        'accept': 'application/json',
        'x-cg-pro-api-key': COINGECKO_API_KEY,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    }
  )
  
  if (!response.ok) {
    throw new Error(`Failed to fetch details for ${coinId}: ${response.status} ${response.statusText}`)
  }
  
  const data = await response.json()
  return {
    id: data.id,
    symbol: data.symbol,
    name: data.name,
    image: data.image.large,
    current_price: data.market_data.current_price.usd,
    market_cap: data.market_data.market_cap.usd,
    market_cap_rank: data.market_cap_rank,
    price_change_percentage_24h: data.market_data.price_change_percentage_24h,
    total_volume: data.market_data.total_volume.usd,
    platforms: data.platforms || {}
  }
}

export const fetchCoinGeckoTokens = cache(async () => {
  try {
    // Try to read from cache file
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf-8')
      const cachedData: CacheData = JSON.parse(fileContent)
      
      // Check if cache is still valid
      const now = new Date().getTime()
      const lastUpdate = new Date(cachedData.lastUpdated).getTime()
      
      if (now - lastUpdate < CACHE_DURATION && cachedData.tokens.length > 0) {
        return {
          trending: cachedData.tokens.slice(0, 10),
          newListings: cachedData.tokens.slice(10, 15),
          highVolume: cachedData.tokens.filter(t => t.total_volume > 1000000).slice(0, 5),
          lastUpdated: cachedData.lastUpdated
        }
      }
    }

    // Fetch trending tokens
    const trendingResponse = await fetchWithRetry('https://api.coingecko.com/api/v3/search/trending', {
      headers: {
        'accept': 'application/json',
        'x-cg-pro-api-key': COINGECKO_API_KEY,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    })

    if (!trendingResponse.ok) {
      throw new Error(`Failed to fetch trending tokens: ${trendingResponse.status} ${trendingResponse.statusText}`)
    }

    const trendingData = await trendingResponse.json()
    const trendingCoins = trendingData.coins as TrendingCoin[]

    // Fetch details for each trending coin
    const tokens = await Promise.all(
      trendingCoins.map(coin => fetchTokenDetails(coin.item.id))
    )

    // Update cache
    const cacheData: CacheData = {
      tokens,
      lastUpdated: new Date().toISOString()
    }

    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2))

    return {
      trending: tokens.slice(0, 10),
      newListings: tokens.slice(10, 15),
      highVolume: tokens.filter(t => t.total_volume > 1000000).slice(0, 5),
      lastUpdated: cacheData.lastUpdated
    }
  } catch (error) {
    console.error('Error fetching CoinGecko tokens:', error)
    
    // 如果发生错误，尝试返回缓存数据
    if (fs.existsSync(CACHE_FILE_PATH)) {
      try {
        const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf-8')
        const cachedData: CacheData = JSON.parse(fileContent)
        
        if (cachedData.tokens.length > 0) {
          console.log('Returning cached data due to error')
          return {
            trending: cachedData.tokens.slice(0, 10),
            newListings: cachedData.tokens.slice(10, 15),
            highVolume: cachedData.tokens.filter(t => t.total_volume > 1000000).slice(0, 5),
            lastUpdated: cachedData.lastUpdated
          }
        }
      } catch (cacheError) {
        console.error('Error reading cache file:', cacheError)
      }
    }

    // 如果缓存也不可用，返回模拟数据
    console.log('Returning fallback data')
    return {
      trending: [
        {
          id: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          current_price: 65000,
          market_cap: 1250000000000,
          market_cap_rank: 1,
          price_change_percentage_24h: 0.5,
          total_volume: 25000000000,
          platforms: { ethereum: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' }
        }
      ],
      newListings: [],
      highVolume: [],
      lastUpdated: new Date().toISOString()
    }
  }
}) 