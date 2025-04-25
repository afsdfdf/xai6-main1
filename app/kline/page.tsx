"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Maximize2, Minimize2, Search, ChevronDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import ChartWrapper from "../components/ChartWrapper"
import ChartTabs from "../components/ChartTabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import BottomNav from "../components/BottomNav"

export default function KLinePage() {
  const searchParams = useSearchParams()
  const [darkMode, setDarkMode] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D") 
  const [selectedPair, setSelectedPair] = useState("XAI/WBNB")
  const [pairAddress, setPairAddress] = useState("")
  const [blockchain, setBlockchain] = useState("bsc")
  const [isFullscreen, setIsFullscreen] = useState(true)
  const [chartTab, setChartTab] = useState("chart")

  // 解析URL参数
  useEffect(() => {
    const blockchainParam = searchParams.get("blockchain")
    const addressParam = searchParams.get("address")
    
    if (blockchainParam) {
      setBlockchain(blockchainParam)
    }
    
    if (addressParam) {
      setPairAddress(addressParam)
      setSelectedPair(`${blockchainParam?.toUpperCase() || 'TOKEN'}/PAIR`)
    }
  }, [searchParams])

  // 图表源选项 - 优化参数以更好地显示数据
  const getChartSource = () => {
    if (pairAddress && blockchain) {
      // 如果有地址和区块链参数，使用它们
      return `https://dexscreener.com/${blockchain}/${pairAddress}?embed=1&chartLeftToolbar=1&chartTradesTable=1&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=2&chartType=usd&interval=1`
    } else {
      // 否则使用默认的XAI图表
      const defaultSources = {
        "XAI/WBNB": "https://dexscreener.com/bsc/0x1c864c55f0c5e0014e2740c36a1f2378bfabd487?embed=1&chartLeftToolbar=1&chartTradesTable=1&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=2&chartType=usd&interval=1",
        "XAI/USDC": "https://dexscreener.com/solana/0xdexscreener?embed=1&chartLeftToolbar=1&chartTradesTable=1&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=2&chartType=usd&interval=1"
      }
      return defaultSources[selectedPair as keyof typeof defaultSources] || defaultSources["XAI/WBNB"]
    }
  }

  // 时间周期选项
  const timeframes = ["15m", "1H", "4H", "1D", "1W"]

  // 格式化区块链名称
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

  // 获取标题
  const getChartTitle = () => {
    if (pairAddress) {
      return `${selectedPair} • ${formatBlockchainName(blockchain)}`
    }
    return selectedPair
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className={`mx-auto ${isFullscreen ? 'pb-0 max-w-full' : 'pb-16 max-w-md'}`}>
        {/* Header */}
        {!isFullscreen && (
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Link href="/market">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold">K线分析</h1>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Fullscreen Header (only visible in fullscreen mode) */}
        {isFullscreen && (
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Link href={pairAddress ? `/token/${blockchain}/${pairAddress}` : "/market"}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold">{getChartTitle()} • K线图</h1>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setIsFullscreen(false)}
            >
              <Minimize2 className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Trading Pair & Timeframe Selector */}
        <div className={`px-4 ${isFullscreen ? 'py-2' : 'py-4'}`}>
          <div className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
            <div className="flex gap-2 items-center">
              <span className="text-lg font-bold">{selectedPair}</span>
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

        {/* Main Chart Area - Fullscreen or Regular */}
        <div className={`${isFullscreen ? 'px-2' : 'px-4'}`}>
          <div className={`relative rounded-xl overflow-hidden ${darkMode ? "border border-gray-800" : "border border-gray-200"}`}>
            <div style={{ height: isFullscreen ? "calc(100vh - 120px)" : "750px" }}>
              <iframe 
                src={getChartSource()}
                title={`${selectedPair} Chart`}
                className="w-full h-full border-0"
              />
            </div>
            
            {/* Custom Tabs */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <ChartTabs 
                activeTab={chartTab}
                setActiveTab={setChartTab}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>

        {/* Chart Information (only visible in non-fullscreen mode) */}
        {!isFullscreen && (
          <>
            {/* Price Stats */}
            <div className="px-4 py-3">
              <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">当前价格</span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 实时更新
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">$0.0001867</span>
                  <span className="text-green-500">+12.45%</span>
                </div>
              </div>
            </div>
            
            {/* Trading Data */}
            <div className="px-4 py-2">
              <div className={`grid grid-cols-2 gap-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                  <p className="text-gray-400 text-xs mb-1">24h 交易量</p>
                  <p className="text-lg font-semibold">$1,234,567</p>
                </div>
                <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                  <p className="text-gray-400 text-xs mb-1">总市值</p>
                  <p className="text-lg font-semibold">$45,678,901</p>
                </div>
                <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                  <p className="text-gray-400 text-xs mb-1">24h 高</p>
                  <p className="text-lg font-semibold text-green-500">$0.0001989</p>
                </div>
                <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                  <p className="text-gray-400 text-xs mb-1">24h 低</p>
                  <p className="text-lg font-semibold text-red-500">$0.0001645</p>
                </div>
              </div>
            </div>
            
            {/* Footer Info */}
            <div className="p-4 text-center text-gray-400 text-xs">
              <p>行情数据由 DexScreener 提供</p>
              <p>实时更新 · 数据仅供参考，不构成投资建议</p>
            </div>
          </>
        )}
      </div>
      
      {/* 添加底部导航栏 */}
      {!isFullscreen && <BottomNav darkMode={darkMode} />}
    </div>
  )
} 