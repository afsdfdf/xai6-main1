"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Moon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"
import SplashScreen from './components/splash-screen'
import BottomNav from './components/BottomNav'
import TokenRankings from './components/token-rankings'
import { searchTokens } from "@/app/lib/ave-api-service"

export default function CryptoTracker() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchResultsRef = useRef<HTMLDivElement>(null)
  const [showSplash, setShowSplash] = useState(true)

  // 处理点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResults]);

  // 搜索代币
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast({
        title: "搜索为空",
        description: "请输入代币名称或合约地址",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    setShowResults(true);
    
    try {
      const results = await searchTokens(searchValue);
      setSearchResults(results);
    } catch (error) {
      console.error("搜索错误:", error);
      setSearchResults([]);
      toast({
        title: "搜索失败",
        description: "无法获取搜索结果，请稍后再试",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }

  // 处理选择代币
  const handleTokenSelect = (token: any) => {
    setShowResults(false);
    
    // 导航到K线图页面
    if (token && token.chain && token.token) {
      router.push(`/kline?blockchain=${token.chain}&address=${token.token}`);
    }
  }

  // 处理搜索框键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

        {/* 搜索部分 - 替换为与Kline页面一致的搜索框 */}
        <div className="p-4">
          <div className="relative">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="搜索代币地址或符号..."
                className={`w-full h-10 pl-10 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-gray-100 border-gray-200"}`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowResults(true)}
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Button 
                variant="default" 
                size="sm" 
                className="ml-2 bg-blue-600 hover:bg-blue-700"
                onClick={handleSearch}
              >
                查询
              </Button>
            </div>
            
            {showResults && (
              <div 
                ref={searchResultsRef} 
                className={`absolute left-0 right-0 mt-1 max-h-96 overflow-y-auto rounded-md shadow-lg z-50 ${
                  darkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
                }`}
              >
                {isSearching ? (
                  <div className="p-3 text-center text-sm">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full inline-block mr-2"></div>
                    搜索中...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((token, index) => (
                    <div
                      key={index}
                      className={`p-3 flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-800 border-b ${
                        darkMode ? "border-gray-800" : "border-gray-200"
                      }`}
                      onClick={() => handleTokenSelect(token)}
                    >
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                        {token.logo_url ? (
                          <Image
                            src={token.logo_url}
                            alt={token.symbol}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-900 flex items-center justify-center text-xs">
                            {token.symbol?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-xs text-gray-400">{token.name} • {token.chain.toUpperCase()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs">
                          ${typeof token.current_price_usd === 'string' 
                            ? parseFloat(token.current_price_usd).toFixed(6) 
                            : (token.current_price_usd || 0).toFixed(6)}
                        </div>
                        {token.price_change_24h && (
                          <div className={`text-xs ${parseFloat(String(token.price_change_24h)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {parseFloat(String(token.price_change_24h)) >= 0 ? '+' : ''}
                            {parseFloat(String(token.price_change_24h)).toFixed(2)}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : searchValue.trim() ? (
                  <div className="p-3 text-center text-sm text-gray-500">
                    未找到相关代币
                  </div>
                ) : null}
              </div>
            )}
          </div>
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

          {/* Token Rankings - Ave.ai API integration */}
          <TokenRankings darkMode={darkMode} />
        </div>

        {/* 底部导航 - 使用通用组件 */}
        <BottomNav darkMode={darkMode} />
      </div>
      <Toaster />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
    </div>
  )
}
