"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Moon, Home, BarChart2, Grid, User, Bitcoin, TrendingUp, Clock, BarChart } from "lucide-react"
import { fetchTrendingTokens, setupRealtimeUpdates } from "./lib/trending-service"
import type { TrendingToken } from "./api/trending/route"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingTokenCard } from "./components/trending-token-card"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"
import TrendingList from './components/trending-list'
import SplashScreen from './components/splash-screen'
import BottomNav from './components/BottomNav'

export default function CryptoTracker() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState("home")
  const [trendingTab, setTrendingTab] = useState("trending")
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([])
  const [newListings, setNewListings] = useState<TrendingToken[]>([])
  const [highVolumeTokens, setHighVolumeTokens] = useState<TrendingToken[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBlockchain, setSelectedBlockchain] = useState("solana")
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showSplash, setShowSplash] = useState(true)

  // 定义区块链选项
  const blockchainOptions = [
    { id: "solana", name: "Solana" },
    { id: "bsc", name: "BNB Chain" },
    { id: "ethereum", name: "Ethereum" },
    { id: "polygon", name: "Polygon" },
    { id: "avalanche", name: "Avalanche" },
  ]

  // 加载热门代币数据
  useEffect(() => {
    let cleanupFunction: () => void = () => {}

    const loadTrendingTokens = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)

        const data = await fetchTrendingTokens()

        if (data.trending.length > 0) {
          setTrendingTokens(data.trending)
          setNewListings(data.newListings)
          setHighVolumeTokens(data.highVolume)
          setLastUpdated(data.lastUpdated)

          // 设置实时更新
          cleanupFunction = setupRealtimeUpdates((updatedTokens) => {
            setTrendingTokens(updatedTokens)
            setLastUpdated(new Date().toISOString())
          })
        }

        setIsLoading(false)
      } catch (error) {
        console.error("加载热门代币数据错误:", error)
        setIsLoading(false)
        setLoadError(error instanceof Error ? error.message : "未知错误")

        toast({
          title: "加载失败",
          description: "获取热门代币数据失败，请稍后再试",
          variant: "destructive",
        })
      }
    }

    loadTrendingTokens()

    // 组件卸载时清理
    return () => {
      cleanupFunction()
    }
  }, [])

  // 处理搜索表单提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      toast({
        title: "搜索为空",
        description: "请输入合约地址进行搜索",
        variant: "destructive",
      })
      return
    }

    // 基本验证合约地址格式
    if (searchQuery.length < 10) {
      toast({
        title: "无效地址",
        description: "请输入有效的合约地址",
        variant: "destructive",
      })
      return
    }

    // 导航到代币详情页
    router.push(`/token/${selectedBlockchain}/${searchQuery}`)
  }

  // 处理点击代币查看详情
  const handleTokenClick = (token: TrendingToken) => {
    router.push(`/token/${token.chain}/${token.address}`)
  }

  // 重试加载数据
  const handleRetry = () => {
    const loadTrendingTokens = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)

        const data = await fetchTrendingTokens()

        if (data.trending.length > 0) {
          setTrendingTokens(data.trending)
          setNewListings(data.newListings)
          setHighVolumeTokens(data.highVolume)
          setLastUpdated(data.lastUpdated)
        }

        setIsLoading(false)

        toast({
          title: "加载成功",
          description: "热门代币数据已更新",
        })
      } catch (error) {
        console.error("重试加载热门代币数据错误:", error)
        setIsLoading(false)
        setLoadError(error instanceof Error ? error.message : "未知错误")

        toast({
          title: "重试失败",
          description: "获取热门代币数据失败，请稍后再试",
          variant: "destructive",
        })
      }
    }

    loadTrendingTokens()
  }

  // 格式化上次更新时间
  const formatLastUpdated = (dateString: string): string => {
    if (!dateString) return "未知"

    const date = new Date(dateString)
    const now = new Date()
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSeconds < 60) {
      return `${diffSeconds}秒前`
    } else if (diffSeconds < 3600) {
      return `${Math.floor(diffSeconds / 60)}分钟前`
    } else {
      return date.toLocaleTimeString()
    }
  }

  // 渲染骨架屏
  const renderSkeletons = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <Card
          key={index}
          className={`p-3 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} animate-pulse`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700"></div>
              <div>
                <div className="h-4 w-16 bg-gray-700 rounded"></div>
                <div className="h-3 w-24 bg-gray-700 rounded mt-1"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-4 w-20 bg-gray-700 rounded"></div>
              <div className="h-3 w-12 bg-gray-700 rounded mt-1 ml-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div>
              <div className="h-3 w-16 bg-gray-700 rounded"></div>
              <div className="h-3 w-12 bg-gray-700 rounded mt-1"></div>
            </div>
            <div>
              <div className="h-3 w-16 bg-gray-700 rounded"></div>
              <div className="h-3 w-12 bg-gray-700 rounded mt-1"></div>
            </div>
            <div className="flex justify-end">
              <div className="h-3 w-16 bg-gray-700 rounded"></div>
            </div>
          </div>
        </Card>
      ))
  }

  // 渲染错误状态
  const renderError = () => {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className={`p-4 rounded-full ${darkMode ? "bg-red-900/20" : "bg-red-100"} mb-4`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">加载失败</h3>
        <p className="text-gray-400 mb-4">{loadError || "获取热门代币数据失败，请稍后再试"}</p>
        <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
          重新加载
        </Button>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="max-w-md mx-auto pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image 
                src="/LOGO.JPG" 
                alt="XAI FINANCE" 
                fill 
                className="object-cover" 
                priority
              />
            </div>
            <h1 className="text-xl font-bold">XAI FINANCE</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="rounded-full">
              <Moon className="w-5 h-5" />
            </Button>
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image 
                src="/LOGO.JPG" 
                alt="Logo" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* 搜索部分 */}
        <div className="p-4">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <select
                value={selectedBlockchain}
                onChange={(e) => setSelectedBlockchain(e.target.value)}
                className={`rounded-md text-sm ${
                  darkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-gray-100 border-gray-200 text-black"
                }`}
              >
                {blockchainOptions.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="输入代币名称或合约地址..."
                  className={`pl-10 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-gray-100 border-gray-200"}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                查询
              </Button>
            </div>
          </form>
        </div>

        {/* 探索部分 */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Explore</h2>
            <Button variant="outline" size="sm" className="text-xs h-7 rounded-full bg-blue-600 text-white border-none">
              热门推荐
            </Button>
          </div>

          <Card className={`mb-4 overflow-hidden rounded-xl ${darkMode ? "bg-transparent border-none" : "bg-transparent border-none"}`}>
            <div className="relative w-full h-[120px]">
              <Image
                src="/hf.png"
                alt="XAI Banner"
                fill
                className="object-cover rounded-xl"
                priority
              />
            </div>
          </Card>

          {/* 热门代币部分 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">热门代币</h2>
                {lastUpdated && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 更新于 {formatLastUpdated(lastUpdated)}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-500 p-0 h-auto"
                onClick={() => router.push("/market")}
              >
                查看所有
              </Button>
            </div>

            <Tabs value={trendingTab} onValueChange={setTrendingTab} className="mb-4">
              <TabsList className={`grid grid-cols-3 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
                <TabsTrigger value="trending" className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 热门
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 新上线
                </TabsTrigger>
                <TabsTrigger value="volume" className="flex items-center gap-1">
                  <BarChart className="w-3 h-3" /> 高交易量
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="space-y-3 mt-3">
                {isLoading ? (
                  renderSkeletons(5)
                ) : loadError ? (
                  renderError()
                ) : trendingTokens.length > 0 ? (
                  trendingTokens.map((token) => (
                    <TrendingTokenCard
                      key={token.id}
                      token={token}
                      darkMode={darkMode}
                      onClick={() => handleTokenClick(token)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">暂无热门代币数据</div>
                )}
              </TabsContent>

              <TabsContent value="new" className="space-y-3 mt-3">
                {isLoading ? (
                  renderSkeletons(3)
                ) : loadError ? (
                  renderError()
                ) : newListings.length > 0 ? (
                  newListings.map((token) => (
                    <TrendingTokenCard
                      key={token.id}
                      token={token}
                      darkMode={darkMode}
                      onClick={() => handleTokenClick(token)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">暂无新上线代币数据</div>
                )}
              </TabsContent>

              <TabsContent value="volume" className="space-y-3 mt-3">
                {isLoading ? (
                  renderSkeletons(3)
                ) : loadError ? (
                  renderError()
                ) : highVolumeTokens.length > 0 ? (
                  highVolumeTokens.map((token) => (
                    <TrendingTokenCard
                      key={token.id}
                      token={token}
                      darkMode={darkMode}
                      onClick={() => handleTokenClick(token)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">暂无高交易量代币数据</div>
                )}
              </TabsContent>

              <TabsContent value="home" className="mt-0">
                <div className="flex flex-col gap-4">
                  <TrendingList />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* 底部导航 - 使用通用组件 */}
        <BottomNav darkMode={darkMode} />
      </div>
      <Toaster />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
    </div>
  )
}
