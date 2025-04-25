"use client"

import { useState } from "react"
import { ArrowLeft, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import ChartWrapper from "../components/ChartWrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BottomNav from "../components/BottomNav"

export default function MarketPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D")
  const [selectedPair, setSelectedPair] = useState("XAI/WBNB")

  // 图表源选项 - 优化参数以显示更多信息
  const chartSources = {
    "XAI/WBNB": "https://dexscreener.com/bsc/0x1c864c55f0c5e0014e2740c36a1f2378bfabd487?embed=1&chartLeftToolbar=1&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=2&chartType=usd&interval=1",
    "XAI/USDC": "https://dexscreener.com/solana/0xdexscreener?embed=1&chartLeftToolbar=1&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=2&chartType=usd&interval=1"
  }

  // 时间周期选项
  const timeframes = ["15m", "1H", "4H", "1D", "1W"]

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
              <h1 className="text-lg font-bold">行情</h1>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="搜索代币..."
              className={`pl-10 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
            />
          </div>
        </div>

        {/* Trading Pair Selector */}
        <div className="px-4 mb-2">
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

        {/* Chart Tabs */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">价格走势</h2>
            <Link href="/kline">
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs h-7 rounded-full ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white border-none`}
              >
                查看详细K线
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="XAI/WBNB" className="w-full">
            <TabsList className={`grid grid-cols-2 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
              <TabsTrigger 
                value="XAI/WBNB" 
                onClick={() => setSelectedPair("XAI/WBNB")}
              >
                XAI/WBNB
              </TabsTrigger>
              <TabsTrigger 
                value="XAI/USDC" 
                onClick={() => setSelectedPair("XAI/USDC")}
              >
                XAI/USDC
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="XAI/WBNB">
              <ChartWrapper 
                src={chartSources["XAI/WBNB"]} 
                title="XAI/WBNB 价格走势" 
                darkMode={darkMode} 
              />
            </TabsContent>
            
            <TabsContent value="XAI/USDC">
              <ChartWrapper 
                src={chartSources["XAI/USDC"]} 
                title="XAI/USDC 价格走势" 
                darkMode={darkMode} 
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Market Info */}
        <div className="px-4 py-2">
          <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">24h 价格变化</p>
                <p className="text-green-500 font-semibold">+12.45%</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">24h 交易量</p>
                <p className="font-semibold">$1,234,567</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">市值</p>
                <p className="font-semibold">$45,678,901</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">流动性</p>
                <p className="font-semibold">$7,890,123</p>
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
            
            {[...Array(5)].map((_, i) => (
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
            ))}
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