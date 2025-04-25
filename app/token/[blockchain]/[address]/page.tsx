"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Share2, Star, Copy, ExternalLink, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import ChartWrapper from "@/app/components/ChartWrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BottomNav from "@/app/components/BottomNav"

export default function TokenDetailPage() {
  const params = useParams()
  const [darkMode, setDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D")
  const [tokenInfo, setTokenInfo] = useState<{
    name: string
    symbol: string
    price: string
    change24h: string
    volume24h: string
    liquidity: string
    marketCap: string
  }>({
    name: "Unknown Token",
    symbol: "???",
    price: "$0.00",
    change24h: "+0.00%",
    volume24h: "$0",
    liquidity: "$0",
    marketCap: "$0",
  })

  const blockchain = params.blockchain as string
  const address = params.address as string

  // 图表源URL
  const chartUrl = `https://dexscreener.com/${blockchain}/${address}?embed=1&chartLeftToolbar=1&chartTradesTable=1&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=2&chartType=usd&interval=1`

  // 时间周期选项
  const timeframes = ["15m", "1H", "4H", "1D", "1W"]

  // Format blockchain name for display
  const formatBlockchainName = (chain: string) => {
    const chainMap: Record<string, string> = {
      solana: "Solana",
      bsc: "BNB Chain",
      ethereum: "Ethereum",
      polygon: "Polygon",
      avalanche: "Avalanche",
      arbitrum: "Arbitrum",
      optimism: "Optimism",
      base: "Base",
    }
    return chainMap[chain.toLowerCase()] || chain
  }

  // Shortened address for display
  const shortenAddress = (addr: string) => {
    if (addr.length <= 13) return addr
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(address)
    toast({
      title: "Address copied",
      description: "Contract address copied to clipboard",
    })
  }

  // Open in DexScreener
  const openInDexScreener = () => {
    window.open(`https://dexscreener.com/${blockchain}/${address}`, "_blank")
  }

  // View in K-Line detail page
  const viewKLineDetail = () => {
    window.open(`/kline?blockchain=${blockchain}&address=${address}`, "_blank")
  }

  useEffect(() => {
    // Simulate loading token data
    setIsLoading(true)

    // In a real app, you would fetch actual token data here
    const fetchTokenData = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data - in a real app, this would come from an API
        setTokenInfo({
          name: blockchain === "solana" ? "Solana Token" : "Unknown Token",
          symbol: blockchain === "solana" ? "SOL" : "???",
          price: "$29.45",
          change24h: "+2.34%",
          volume24h: "$1,245,678",
          liquidity: "$5,678,901",
          marketCap: "$12,345,678",
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching token data:", error)
        setIsLoading(false)

        toast({
          variant: "destructive",
          title: "Error loading token data",
          description: "Failed to load token information. Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    }

    fetchTokenData()
  }, [blockchain, address])

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="max-w-md mx-auto pb-16">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </>
              ) : (
                <>
                  <h1 className="text-lg font-bold">
                    {tokenInfo.name} ({tokenInfo.symbol})
                  </h1>
                  <div className="flex items-center text-xs text-gray-400">
                    <span>{formatBlockchainName(blockchain)}</span>
                    <span className="mx-1">•</span>
                    <span className="flex items-center gap-1">
                      {shortenAddress(address)}
                      <button onClick={copyAddressToClipboard} className="hover:text-gray-300">
                        <Copy className="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Star className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={openInDexScreener}>
              <ExternalLink className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Trading Pair Selector */}
        <div className="px-4 mb-2 mt-4">
          <div className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
            <div className="flex gap-2 items-center">
              <span className="text-lg font-bold">{isLoading ? "Loading..." : `${tokenInfo.symbol}/USD`}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex gap-1">
              {timeframes.map(time => (
                <Button 
                  key={time}
                  variant={selectedTimeframe === time ? "default" : "outline"}
                  size="sm"
                  className={`px-2 py-1 h-7 text-xs ${
                    selectedTimeframe === time 
                      ? "bg-blue-600" 
                      : darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
                  }`}
                  onClick={() => setSelectedTimeframe(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">价格走势</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className={`text-xs h-7 rounded-full ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white border-none`}
              onClick={viewKLineDetail}
            >
              查看详细K线
            </Button>
          </div>
          
          <ChartWrapper 
            src={chartUrl} 
            title={`${isLoading ? "Loading..." : tokenInfo.name} 价格走势`} 
            darkMode={darkMode} 
          />
        </div>

        {/* Trading Info */}
        <div className="px-4 py-2">
          <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">24h 价格变化</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <p className={`font-semibold ${tokenInfo.change24h.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                    {tokenInfo.change24h}
                  </p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">24h 交易量</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <p className="font-semibold">{tokenInfo.volume24h}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">市值</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <p className="font-semibold">{tokenInfo.marketCap}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">流动性</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <p className="font-semibold">{tokenInfo.liquidity}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="px-4 py-4">
          <h2 className="font-semibold mb-3">最近交易</h2>
          <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} rounded-xl overflow-hidden`}>
            <div className="grid grid-cols-4 text-xs text-gray-400 p-3 border-b border-gray-800">
              <div>价格</div>
              <div>数量</div>
              <div>总额</div>
              <div className="text-right">时间</div>
            </div>
            
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className={`grid grid-cols-4 text-sm p-3 ${i !== 4 ? "border-b border-gray-800" : ""}`}>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-14" />
                  <div className="text-right">
                    <Skeleton className="h-4 w-10 ml-auto" />
                  </div>
                </div>
              ))
            ) : (
              [...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`grid grid-cols-4 text-sm p-3 ${i !== 4 ? "border-b border-gray-800" : ""}`}
                >
                  <div className={i % 2 === 0 ? "text-green-500" : "text-red-500"}>
                    $0.0001867
                  </div>
                  <div>12,345</div>
                  <div>$2.31</div>
                  <div className="text-right text-gray-400 text-xs">
                    {new Date(Date.now() - i * 300000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 text-center text-gray-400 text-xs">
          <p>行情数据由 DexScreener 提供</p>
          <p>实时更新 · 数据仅供参考，不构成投资建议</p>
        </div>
      </div>
      
      {/* 底部导航栏 */}
      <BottomNav darkMode={darkMode} />
    </div>
  )
}
