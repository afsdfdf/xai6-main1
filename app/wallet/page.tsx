"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { 
  Copy, 
  BarChart2, 
  Clock, 
  ChevronRight, 
  Download, 
  Eye, 
  EyeOff, 
  Plus, 
  Send, 
  TrendingUp, 
  TrendingDown,
  Search,
  ExternalLink,
  Image as ImageIcon,
  RefreshCw
} from "lucide-react"
import BottomNav from "../components/BottomNav"
import Image from "next/image"
import Link from "next/link"

export default function WalletPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState("tokens")
  const [isConnected, setIsConnected] = useState(true) // 钱包连接状态
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
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
      { 
        symbol: "XAI", 
        name: "XAI Finance", 
        balance: 1250, 
        usdValue: 39, 
        change24h: +2.45, 
        logo: "/xai-logo.png"
      },
      { 
        symbol: "UNI", 
        name: "Uniswap", 
        balance: 12.5, 
        usdValue: 96.25, 
        change24h: -1.3, 
        logo: "/web3/uniswap.png"
      },
      { 
        symbol: "LINK", 
        name: "Chainlink", 
        balance: 25, 
        usdValue: 347.5, 
        change24h: +0.8, 
        logo: "/web3/chainlink.png"
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
    { 
      type: "receive", 
      amount: "+1000 XAI", 
      usdValue: "+31.20 USD", 
      from: "0x1c86...d487", 
      date: "2023-05-03 13:45", 
      status: "completed"
    },
  ]

  // 模拟 NFT 资产
  const nftAssets = [
    {
      name: "PVP Gameplay #1",
      collection: "XAI Gaming Collection",
      image: "/nft-images/pvp-gameplay.jpg",
      floorPrice: 0.15,
      currency: "ETH"
    },
    {
      name: "Lucky Hero #42",
      collection: "XAI Heroes",
      image: "/nft-images/lucky-hero.jpg",
      floorPrice: 0.25,
      currency: "ETH"
    },
    {
      name: "Casual Gameplay #78",
      collection: "XAI Gaming Collection",
      image: "/nft-images/casual-gameplay.jpg",
      floorPrice: 0.18,
      currency: "ETH"
    }
  ]

  // 模拟连接钱包方法
  const connectWallet = () => {
    // 模拟连接钱包的过程
    toast({
      title: "钱包连接成功",
      description: "您的钱包已成功连接",
    })
    setIsConnected(true)
  }

  // 模拟断开钱包连接
  const disconnectWallet = () => {
    toast({
      title: "钱包已断开连接",
      description: "您的钱包连接已断开",
    })
    setIsConnected(false)
  }

  // 处理复制地址
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "地址已复制",
      description: "钱包地址已复制到剪贴板",
    })
  }

  // 模拟刷新资产数据
  const refreshAssets = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "资产已更新",
        description: "您的资产数据已成功更新",
      })
    }, 1500)
  }

  // 根据搜索条件筛选资产
  const filteredAssets = walletBalance.assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0b101a] text-white" : "bg-gray-50 text-gray-900"} pb-16`}>
      <div className="max-w-md mx-auto">
        {/* 头部 */}
        <div className={`p-4 flex items-center justify-between border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          <h1 className="text-xl font-bold">我的钱包</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshAssets}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "🌞" : "🌙"}
            </Button>
          </div>
        </div>

        {!isConnected ? (
          // 未连接钱包时显示的内容
          <div className={`flex flex-col items-center justify-center p-8 mt-10 mx-4 rounded-lg ${darkMode ? "bg-[#11161f]" : "bg-white"}`}>
            <Image 
              src="/web3/images/logos/wallet_connect.png"
              alt="Connect Wallet"
              width={80}
              height={80}
              className="mb-6"
            />
            <h2 className="text-xl font-bold mb-2">连接您的钱包</h2>
            <p className="text-gray-400 text-center mb-6">连接您的钱包以查看您的资产和交易历史</p>
            <Button 
              onClick={connectWallet} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              连接钱包
            </Button>
            <div className="grid grid-cols-3 gap-4 mt-8 w-full">
              <div className="flex flex-col items-center p-3 rounded-lg border border-gray-700">
                <Image 
                  src="/web3/images/logos/metamask.png"
                  alt="MetaMask"
                  width={40}
                  height={40}
                  className="mb-2"
                />
                <span className="text-xs">MetaMask</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg border border-gray-700">
                <Image 
                  src="/web3/images/logos/walletconnect.png"
                  alt="WalletConnect"
                  width={40}
                  height={40}
                  className="mb-2"
                />
                <span className="text-xs">WalletConnect</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg border border-gray-700">
                <Image 
                  src="/web3/images/logos/phantom.png"
                  alt="Phantom"
                  width={40}
                  height={40}
                  className="mb-2"
                />
                <span className="text-xs">Phantom</span>
              </div>
            </div>
          </div>
        ) : (
          // 连接钱包后显示的内容
          <>
            {/* 钱包地址 */}
            <div className={`p-4 ${darkMode ? "bg-[#11161f]" : "bg-white"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-blue-600">
                    <Image 
                      src="/web3/default-logo.png" 
                      alt="Wallet" 
                      width={24} 
                      height={24}
                      className="object-cover"
                      onError={(e) => (e.currentTarget.src = "/placeholder-token.png")}
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">钱包地址</div>
                    <div className="font-mono">{shortAddress}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="h-8 w-8 p-0">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={disconnectWallet}
                    className="h-8 text-xs text-red-500 hover:text-red-400"
                  >
                    断开
                  </Button>
                </div>
              </div>
            </div>

            {/* 资产概览 */}
            <div className={`p-5 ${darkMode ? "bg-[#0f1622]" : "bg-gray-100"}`}>
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
                <div className={`text-sm flex items-center ${walletBalance.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {walletBalance.change24h >= 0 ? 
                    <TrendingUp className="w-3 h-3 mr-1" /> : 
                    <TrendingDown className="w-3 h-3 mr-1" />
                  }
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

            {/* 资产选项卡 */}
            <div className="p-4">
              <Tabs defaultValue="tokens" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="tokens">代币</TabsTrigger>
                  <TabsTrigger value="nfts">NFT</TabsTrigger>
                </TabsList>

                <TabsContent value="tokens">
                  {/* 搜索框 */}
                  <div className={`relative mb-4 flex items-center ${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-md`}>
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="搜索资产..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`border-none pl-10 ${darkMode ? "bg-gray-800 placeholder:text-gray-500" : "bg-gray-100"}`}
                    />
                  </div>

                  {/* 资产列表 - 最终方案 */}
                  <div className="space-y-0 mt-2">
                    {filteredAssets.map((asset) => (
                      <div key={asset.symbol} className="border-b border-gray-800 py-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-base font-medium">{asset.name}</div>
                            <div className="text-xs text-gray-500">{asset.symbol}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-medium">{asset.balance} {asset.symbol}</div>
                            <div className="text-xs text-gray-500">${asset.usdValue}</div>
                            <div className={`text-xs ${asset.change24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="nfts">
                  <div className="grid grid-cols-2 gap-4">
                    {nftAssets.map((nft, index) => (
                      <div 
                        key={index}
                        className={`rounded-lg overflow-hidden ${darkMode ? "bg-[#11161f]" : "bg-white"}`}
                      >
                        <div className="aspect-square relative">
                          <Image 
                            src={nft.image} 
                            alt={nft.name} 
                            fill
                            className="object-cover"
                            onError={(e) => {e.currentTarget.src = "/placeholder-token.png"}}
                          />
                        </div>
                        <div className="p-3">
                          <div className="font-semibold text-sm truncate">{nft.name}</div>
                          <div className="text-xs text-gray-400 mb-2">{nft.collection}</div>
                          <div className="text-xs">
                            Floor: {nft.floorPrice} {nft.currency}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
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
                      <Button variant="link" size="sm" className="h-5 p-0 text-xs text-blue-500">
                        查看详情 <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-center">
                <Button variant="link" size="sm" className="text-blue-500">
                  查看所有交易
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* 底部导航栏 */}
      <BottomNav darkMode={darkMode} />
    </div>
  )
} 