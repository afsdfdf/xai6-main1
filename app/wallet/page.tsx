"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Copy, BarChart2, Clock, ChevronRight, Download, Eye, EyeOff, Plus, Send } from "lucide-react"
import BottomNav from "../components/BottomNav"
import Image from "next/image"
import Link from "next/link"

export default function WalletPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const { toast } = useToast()

  // 模拟钱包地址
  const walletAddress = "0x6B75d8AF000000e992299b5D32a6c12C68D5CC7C"
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`

  // 模拟资产数据
  const walletBalance = {
    totalUsd: 12543.28,
    change24h: +2.34,
    assets: [
      { 
        symbol: "BTC", 
        name: "Bitcoin", 
        balance: 0.128, 
        usdValue: 7954.16, 
        change24h: +1.2, 
        logo: "/bitcoin-logo.png"
      },
      { 
        symbol: "ETH", 
        name: "Ethereum", 
        balance: 1.25, 
        usdValue: 4068.75, 
        change24h: -0.8, 
        logo: "/ethereum-logo.png"
      },
      { 
        symbol: "SOL", 
        name: "Solana", 
        balance: 15.3, 
        usdValue: 408.77, 
        change24h: +3.5, 
        logo: "/solana-logo.png"
      },
      { 
        symbol: "AVAX", 
        name: "Avalanche", 
        balance: 3.88, 
        usdValue: 111.60, 
        change24h: +4.2, 
        logo: "/avalanche-logo.png"
      },
    ]
  }

  // 模拟交易历史
  const transactionHistory = [
    { 
      type: "receive", 
      amount: "+0.05 BTC", 
      usdValue: "+3,127.26 USD", 
      from: "0x8df3...e992", 
      date: "今天 15:32", 
      status: "completed"
    },
    { 
      type: "send", 
      amount: "-0.75 ETH", 
      usdValue: "-2,441.25 USD", 
      to: "0x6a21...78cc", 
      date: "昨天 09:14", 
      status: "completed"
    },
    { 
      type: "swap", 
      amount: "2.5 SOL → 0.02 ETH", 
      usdValue: "65.30 USD", 
      date: "2023-05-08 18:45", 
      status: "completed"
    },
    { 
      type: "receive", 
      amount: "+10 SOL", 
      usdValue: "+267.20 USD", 
      from: "0x3af2...ae43", 
      date: "2023-05-05 11:21", 
      status: "completed"
    },
  ]

  // 处理复制地址
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "地址已复制",
      description: "钱包地址已复制到剪贴板",
    })
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0b101a] text-white" : "bg-gray-50 text-gray-900"} pb-16`}>
      <div className="max-w-md mx-auto">
        {/* 头部 */}
        <div className={`p-4 flex items-center justify-between border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          <h1 className="text-xl font-bold">我的钱包</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "🌞" : "🌙"}
            </Button>
          </div>
        </div>

        {/* 钱包地址 */}
        <div className={`p-4 ${darkMode ? "bg-[#11161f]" : "bg-white"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-blue-600">
                <Image 
                  src="/placeholder-token.png" 
                  alt="Wallet" 
                  width={24} 
                  height={24}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm text-gray-400">钱包地址</div>
                <div className="font-mono">{shortAddress}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 资产概览 */}
        <div className={`p-4 ${darkMode ? "bg-[#0f1622]" : "bg-gray-100"}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">总资产</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBalance(!showBalance)}
              className="h-8 w-8 p-0"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <div className="flex items-end space-x-2">
            <div className="text-3xl font-bold">
              {showBalance ? `$${walletBalance.totalUsd.toLocaleString()}` : '******'}
            </div>
            <div className={`text-sm ${walletBalance.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {walletBalance.change24h >= 0 ? '+' : ''}{walletBalance.change24h}%
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className={`grid grid-cols-3 gap-4 p-4 ${darkMode ? "bg-[#11161f]" : "bg-white"}`}>
          <Button variant="outline" className={`flex flex-col items-center justify-center h-20 ${darkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700" : ""}`}>
            <Send className="w-5 h-5 mb-1" />
            <span className="text-xs">发送</span>
          </Button>
          <Button variant="outline" className={`flex flex-col items-center justify-center h-20 ${darkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700" : ""}`}>
            <Download className="w-5 h-5 mb-1" />
            <span className="text-xs">接收</span>
          </Button>
          <Button variant="outline" className={`flex flex-col items-center justify-center h-20 ${darkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700" : ""}`}>
            <Plus className="w-5 h-5 mb-1" />
            <span className="text-xs">购买</span>
          </Button>
        </div>

        {/* 资产列表 */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3">资产列表</h2>
          <div className={`rounded-lg overflow-hidden ${darkMode ? "bg-[#11161f]" : "bg-white"}`}>
            {walletBalance.assets.map((asset, index) => (
              <div 
                key={asset.symbol}
                className={`flex items-center justify-between p-4 ${
                  index !== walletBalance.assets.length - 1 
                    ? `border-b ${darkMode ? "border-gray-800" : "border-gray-200"}` 
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 overflow-hidden rounded-full">
                    <Image 
                      src={asset.logo} 
                      alt={asset.symbol} 
                      width={40} 
                      height={40}
                      className="object-cover"
                      onError={(e) => (e.currentTarget.src = "/placeholder-token.png")}
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{asset.name}</div>
                    <div className="text-sm text-gray-400">{asset.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {showBalance ? asset.balance : '***'} {asset.symbol}
                  </div>
                  <div className="text-sm text-gray-400">
                    {showBalance ? `$${asset.usdValue.toLocaleString()}` : '$****'}
                  </div>
                  <div className={`text-xs ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 交易历史 */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3">最近交易</h2>
          <div className={`rounded-lg overflow-hidden ${darkMode ? "bg-[#11161f]" : "bg-white"}`}>
            {transactionHistory.map((tx, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 ${
                  index !== transactionHistory.length - 1 
                    ? `border-b ${darkMode ? "border-gray-800" : "border-gray-200"}` 
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`relative w-10 h-10 flex items-center justify-center rounded-full ${
                    tx.type === 'receive' 
                      ? 'bg-green-600' 
                      : tx.type === 'send' 
                      ? 'bg-red-600' 
                      : 'bg-blue-600'
                  }`}>
                    {tx.type === 'receive' && <Download className="w-5 h-5" />}
                    {tx.type === 'send' && <Send className="w-5 h-5" />}
                    {tx.type === 'swap' && <BarChart2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {tx.type === 'receive' ? '接收' : tx.type === 'send' ? '发送' : '兑换'}
                    </div>
                    <div className="text-sm text-gray-400">{tx.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    tx.type === 'receive' ? 'text-green-500' : tx.type === 'send' ? 'text-red-500' : ''
                  }`}>
                    {tx.amount}
                  </div>
                  <div className="text-sm text-gray-400">{tx.usdValue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 底部导航栏 */}
      <BottomNav darkMode={darkMode} />
    </div>
  )
} 