"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowDown, ArrowUp, BarChart2, Clock, RefreshCw, Search, TrendingUp, TrendingDown } from "lucide-react"
import BottomNav from "../components/BottomNav"
import Image from "next/image"
import Link from "next/link"

// xai代币信息
const XAI_CONTRACT = "0x1c864c55f0c5e0014e2740c36a1f2378bfabd487";

// 价格API接口
async function fetchTokenPrice(tokenId: string) {
  try {
    // First try to fetch from API
    const response = await fetch("https://prod.ave-api.com/v2/tokens/price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "demo-key" // 实际使用时需要替换为有效的API密钥
      },
      body: JSON.stringify({
        token_ids: [tokenId],
        tvl_min: 0,
        tx_24h_volume_min: 0
      })
    });
    
    if (!response.ok) {
      // If API returns an error, throw to trigger fallback
      console.warn(`API request failed with status ${response.status}, using fallback data`);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data[tokenId];
  } catch (error) {
    console.info("Using fallback price data due to API error");
    // Return mock data as fallback
    return {
      current_price_usd: "0.0312",
      price_change_24h: "2.45",
      last_updated: new Date().toISOString()
    };
  }
}

export default function TradePage() {
  const [darkMode, setDarkMode] = useState(true)
  const [tradeType, setTradeType] = useState("buy")
  const [selectedToken, setSelectedToken] = useState("XAI")
  const [selectedPair, setSelectedPair] = useState("USDT")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("0.00")
  const [priceChange24h, setPriceChange24h] = useState("0.00")
  const [priceChangeDirection, setPriceChangeDirection] = useState<"up" | "down" | "neutral">("neutral")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrice, setIsLoadingPrice] = useState(true)
  const { toast } = useToast()

  // 获取XAI代币价格
  useEffect(() => {
    const getTokenPrice = async () => {
      setIsLoadingPrice(true);
      try {
        const tokenId = `${XAI_CONTRACT}-ethereum`;
        const priceData = await fetchTokenPrice(tokenId);
        
        if (priceData) {
          setPrice(parseFloat(priceData.current_price_usd).toFixed(4));
          
          const change24h = parseFloat(priceData.price_change_24h);
          setPriceChange24h(change24h.toFixed(2));
          
          if (change24h > 0) {
            setPriceChangeDirection("up");
          } else if (change24h < 0) {
            setPriceChangeDirection("down");
          } else {
            setPriceChangeDirection("neutral");
          }
        }
      } catch (error) {
        console.error("Error in price fetching logic:", error);
        // This shouldn't happen since we handle API errors in fetchTokenPrice
        // But adding as extra safety
        setPrice("0.0312");
        setPriceChange24h("2.45");
        setPriceChangeDirection("up");
      } finally {
        setIsLoadingPrice(false);
      }
    };
    
    getTokenPrice();
    
    // 设置定时器每60秒刷新一次价格 (increased from 30s to reduce potential rate limiting)
    const priceInterval = setInterval(getTokenPrice, 60000);
    
    return () => clearInterval(priceInterval);
  }, []);

  // 模拟交易历史
  const tradeHistory = [
    { time: "22:15", type: "buy", amount: "0.52", price: "26.73", total: "13.89" },
    { time: "21:34", type: "sell", amount: "1.28", price: "26.68", total: "34.15" },
    { time: "20:55", type: "buy", amount: "0.35", price: "26.70", total: "9.34" },
    { time: "19:22", type: "buy", amount: "2.10", price: "26.65", total: "55.96" },
    { time: "18:56", type: "sell", amount: "0.88", price: "26.71", total: "23.50" },
  ]

  // 可用代币列表
  const availableTokens = [
    { symbol: "SOL", name: "Solana", price: 26.72, change: 2.45, logo: "/solana-logo.png" },
    { symbol: "ETH", name: "Ethereum", price: 3254.89, change: -0.78, logo: "/ethereum-logo.png" },
    { symbol: "BTC", name: "Bitcoin", price: 62145.32, change: 1.23, logo: "/bitcoin-logo.png" },
    { symbol: "AVAX", name: "Avalanche", price: 28.75, change: 4.21, logo: "/avalanche-logo.png" },
  ]

  // 处理交易提交
  const handleTrade = () => {
    if (!amount) {
      toast({
        title: "输入错误",
        description: "请输入交易数量",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    // 模拟交易过程
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: `${tradeType === 'buy' ? '买入' : '卖出'}成功`,
        description: `${tradeType === 'buy' ? '买入' : '卖出'} ${amount} ${selectedToken} @ ${price} ${selectedPair}`,
        variant: "default",
      })
      setAmount("")
    }, 1500)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0b101a] text-white" : "bg-gray-50 text-gray-900"} pb-16`}>
      <div className="max-w-md mx-auto">
        {/* 头部 */}
        <div className={`p-4 flex items-center justify-between border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          <h1 className="text-xl font-bold">交易</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/kline">
                <BarChart2 className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "🌞" : "🌙"}
            </Button>
          </div>
        </div>

        {/* 代币信息卡片 */}
        <div className={`p-4 ${darkMode ? "bg-[#11161f]" : "bg-white"} mb-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative w-10 h-10 overflow-hidden rounded-full border border-gray-700">
                  <Image 
                    src="/logo.png" 
                    alt="XAI" 
                    width={40} 
                    height={40}
                    className="object-cover"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                </div>
                <div>
                  <div className="font-bold">{selectedToken}/{selectedPair}</div>
                  <div className="text-xs text-gray-400">XAI Finance Token</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              {isLoadingPrice ? (
                <div className="h-10 flex items-center justify-end">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-4 w-16 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="font-bold text-lg">${price}</div>
                  <div className={`text-xs flex items-center justify-end ${
                    priceChangeDirection === "up" ? "text-green-500" : 
                    priceChangeDirection === "down" ? "text-red-500" : 
                    "text-gray-400"
                  }`}>
                    {priceChangeDirection === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                     priceChangeDirection === "down" ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
                    {priceChange24h}%
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 交易面板 */}
        <Card className={`mx-4 border-0 ${darkMode ? "bg-[#11161f] text-white" : "bg-white"}`}>
          <CardHeader className="px-4 pt-4 pb-0">
            <Tabs defaultValue="buy" onValueChange={value => setTradeType(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy" className={`${tradeType === 'buy' ? 'bg-green-600 text-white' : ''}`}>买入</TabsTrigger>
                <TabsTrigger value="sell" className={`${tradeType === 'sell' ? 'bg-red-600 text-white' : ''}`}>卖出</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="px-4 pt-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">价格</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input 
                    type="text" 
                    value={price}
                    readOnly
                    className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300"}`}
                  />
                  <span className="text-sm">{selectedPair}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">数量</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input 
                    type="text" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300"}`}
                    placeholder="输入交易数量"
                  />
                  <span className="text-sm">{selectedToken}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <button className="text-xs text-blue-500">25%</button>
                  <button className="text-xs text-blue-500">50%</button>
                  <button className="text-xs text-blue-500">75%</button>
                  <button className="text-xs text-blue-500">100%</button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">总额</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input 
                    type="text" 
                    value={amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(4) : ''}
                    readOnly
                    className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300"}`}
                  />
                  <span className="text-sm">{selectedPair}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleTrade}
                className={`w-full ${tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 处理中...</>
                ) : (
                  tradeType === 'buy' ? `买入 ${selectedToken}` : `卖出 ${selectedToken}`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 交易历史 */}
        <div className="mt-4 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">最近交易</h2>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-gray-400">
              <RefreshCw className="h-3 w-3" /> 刷新
            </Button>
          </div>
          <div className={`overflow-hidden rounded-lg ${darkMode ? "bg-[#11161f]" : "bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`text-xs ${darkMode ? "text-gray-400 bg-gray-900" : "text-gray-500 bg-gray-100"}`}>
                  <tr>
                    <th className="px-3 py-2 text-left">时间</th>
                    <th className="px-3 py-2 text-left">类型</th>
                    <th className="px-3 py-2 text-right">价格</th>
                    <th className="px-3 py-2 text-right">数量</th>
                    <th className="px-3 py-2 text-right">总额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {tradeHistory.map((trade, index) => (
                    <tr key={index} className="text-xs">
                      <td className="px-3 py-2 text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {trade.time}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          trade.type === 'buy' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                        }`}>
                          {trade.type === 'buy' ? '买入' : '卖出'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">{trade.price}</td>
                      <td className="px-3 py-2 text-right">{trade.amount}</td>
                      <td className="px-3 py-2 text-right font-medium">{trade.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* 底部导航 */}
        <BottomNav darkMode={darkMode} />
      </div>
    </div>
  )
} 