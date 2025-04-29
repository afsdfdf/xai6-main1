"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowDown, ArrowUp, BarChart2, Clock, RefreshCw, Search } from "lucide-react"
import BottomNav from "../components/BottomNav"
import Image from "next/image"
import Link from "next/link"

export default function TradePage() {
  const [darkMode, setDarkMode] = useState(true)
  const [tradeType, setTradeType] = useState("buy")
  const [selectedToken, setSelectedToken] = useState("SOL")
  const [selectedPair, setSelectedPair] = useState("USDT")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("26.72")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 模拟价格变化
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.1
      const newPrice = (parseFloat(price) + change).toFixed(2)
      setPrice(newPrice)
    }, 5000)

    return () => clearInterval(interval)
  }, [price])

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

        {/* 币对选择 */}
        <div className={`p-4 ${darkMode ? "bg-[#11161f]" : "bg-white"} mb-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 overflow-hidden rounded-full">
                  <Image 
                    src="/solana-logo.png" 
                    alt="SOL" 
                    width={32} 
                    height={32}
                    className="object-cover"
                    onError={(e) => (e.currentTarget.src = "/placeholder-token.png")}
                  />
                </div>
                <div>
                  <div className="font-bold">{selectedToken}/{selectedPair}</div>
                  <div className="text-xs text-gray-400">Solana/USDT</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">${price}</div>
              <div className="text-xs text-green-500">+2.45%</div>
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
                    onChange={(e) => setPrice(e.target.value)}
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
                    value={amount ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : ''}
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
                  tradeType === 'buy' ? '买入 SOL' : '卖出 SOL'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 交易历史 */}
        <div className="mt-4 p-4">
          <h2 className="text-lg font-semibold mb-3">最近交易</h2>
          <div className={`overflow-hidden rounded-lg ${darkMode ? "bg-[#11161f]" : "bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`text-left ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <tr>
                    <th className="px-4 py-2">时间</th>
                    <th className="px-4 py-2">类型</th>
                    <th className="px-4 py-2">价格</th>
                    <th className="px-4 py-2">数量</th>
                    <th className="px-4 py-2">总额</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeHistory.map((item, index) => (
                    <tr key={index} className={`${darkMode ? "border-gray-800" : "border-gray-200"} border-t`}>
                      <td className="px-4 py-3">{item.time}</td>
                      <td className={`px-4 py-3 ${item.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                        {item.type === 'buy' ? <ArrowUp className="inline w-4 h-4 mr-1" /> : <ArrowDown className="inline w-4 h-4 mr-1" />}
                        {item.type === 'buy' ? '买入' : '卖出'}
                      </td>
                      <td className="px-4 py-3">{item.price}</td>
                      <td className="px-4 py-3">{item.amount}</td>
                      <td className="px-4 py-3">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* 底部导航栏 */}
      <BottomNav darkMode={darkMode} />
    </div>
  )
} 