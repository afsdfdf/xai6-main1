"use client"

import { useState } from "react"
import { ArrowLeft, Search, ExternalLink, TrendingUp, Zap, Info, Star, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BottomNav from "../components/BottomNav"

// Web3 应用数据
const web3Apps: Record<string, WebApp[]> = {
  dex: [
    {
      id: "uniswap",
      name: "Uniswap",
      description: "去中心化交易协议",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/uni.png",
      banner: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=1024",
      url: "https://app.uniswap.org",
      chain: ["ethereum", "polygon", "arbitrum", "optimism"],
      color: "#FF007A",
      heat: 98,
      downloads: "1200万+"
    },
    {
      id: "pancakeswap",
      name: "PancakeSwap",
      description: "BSC上领先的DEX",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/cake.png",
      banner: "https://images.unsplash.com/photo-1655635949212-1d8f4f103ea1?q=80&w=1024",
      url: "https://pancakeswap.finance",
      chain: ["bsc", "ethereum", "polygon"],
      color: "#1FC7D4",
      heat: 92,
      downloads: "850万+"
    },
    {
      id: "curve",
      name: "Curve",
      description: "稳定币交易平台",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/crv.png",
      banner: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1024",
      url: "https://curve.fi",
      chain: ["ethereum", "polygon", "arbitrum", "optimism"],
      color: "#A5A4CE",
      heat: 85,
      downloads: "420万+"
    },
    {
      id: "sushiswap",
      name: "SushiSwap",
      description: "多链去中心化交易所",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/sushi.png",
      banner: "https://images.unsplash.com/photo-1617870952348-7524edfb61b7?q=80&w=1024",
      url: "https://www.sushi.com",
      chain: ["ethereum", "polygon", "arbitrum", "optimism", "bsc"],
      color: "#FA52A0",
      heat: 82,
      downloads: "380万+"
    },
    {
      id: "raydium",
      name: "Raydium",
      description: "Solana自动做市商",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/ray.png",
      banner: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1024",
      url: "https://raydium.io",
      chain: ["solana"],
      color: "#2D46B9",
      heat: 79,
      downloads: "280万+"
    },
    {
      id: "traderjoe",
      name: "Trader Joe",
      description: "Avalanche上的DEX",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/joe.png",
      banner: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1024",
      url: "https://traderjoexyz.com",
      chain: ["avalanche", "ethereum", "arbitrum"],
      color: "#FF6B4A",
      heat: 74,
      downloads: "240万+"
    },
    {
      id: "dydx",
      name: "dYdX",
      description: "去中心化衍生品交易",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/dydx.png",
      banner: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1024",
      url: "https://dydx.exchange",
      chain: ["ethereum"],
      color: "#6966FF",
      heat: 81,
      downloads: "320万+"
    },
    {
      id: "gmx",
      name: "GMX",
      description: "永续交易平台",
      logo: "https://assets.coingecko.com/coins/images/18323/large/arbit.png?1631532468",
      banner: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1024",
      url: "https://gmx.io",
      chain: ["arbitrum", "avalanche"],
      color: "#1E99A0",
      heat: 77,
      downloads: "260万+"
    }
  ],
  lending: [
    {
      id: "aave",
      name: "Aave",
      description: "去中心化借贷协议",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/aave.png",
      banner: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=1024",
      url: "https://app.aave.com",
      chain: ["ethereum", "polygon", "arbitrum", "optimism"],
      color: "#B6509E",
      heat: 90,
      downloads: "720万+"
    },
    {
      id: "compound",
      name: "Compound",
      description: "算法货币市场",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/comp.png",
      banner: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1024",
      url: "https://app.compound.finance",
      chain: ["ethereum"],
      color: "#00D395",
      heat: 86,
      downloads: "450万+"
    },
    {
      id: "makerdao",
      name: "MakerDAO",
      description: "DAI稳定币发行平台",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/mkr.png",
      banner: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1024",
      url: "https://oasis.app",
      chain: ["ethereum"],
      color: "#1AAB9B",
      heat: 84,
      downloads: "410万+"
    },
    {
      id: "lido",
      name: "Lido",
      description: "流动性质押服务",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/ldo.png",
      banner: "https://images.unsplash.com/photo-1640340434725-6371f65d4816?q=80&w=1024",
      url: "https://lido.fi",
      chain: ["ethereum", "solana", "polygon"],
      color: "#00A3FF",
      heat: 89,
      downloads: "680万+"
    },
    {
      id: "alchemix",
      name: "Alchemix",
      description: "自偿还贷款",
      logo: "https://assets.coingecko.com/coins/images/14113/large/Alchemix.png?1614410406",
      banner: "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=1024",
      url: "https://alchemix.fi",
      chain: ["ethereum"],
      color: "#2C6ACE",
      heat: 71,
      downloads: "180万+"
    },
    {
      id: "euler",
      name: "Euler",
      description: "可定制货币市场",
      logo: "https://assets.coingecko.com/coins/images/26149/large/Euler_logo_icon_191121_-_Color.png?1656052749",
      banner: "https://images.unsplash.com/photo-1607893378714-007fd47c8719?q=80&w=1024",
      url: "https://euler.finance",
      chain: ["ethereum"],
      color: "#1A4DE3",
      heat: 69,
      downloads: "160万+"
    },
    {
      id: "venus",
      name: "Venus",
      description: "BSC货币市场",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/xvs.png",
      banner: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1024",
      url: "https://venus.io",
      chain: ["bsc"],
      color: "#FFC670",
      heat: 76,
      downloads: "250万+"
    }
  ],
  nft: [
    {
      id: "opensea",
      name: "OpenSea",
      description: "最大的NFT交易市场",
      logo: "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
      banner: "https://images.unsplash.com/photo-1646483236171-8f793d4a9c1a?q=80&w=1024",
      url: "https://opensea.io",
      chain: ["ethereum", "polygon", "solana"],
      color: "#2081E2",
      heat: 94,
      downloads: "950万+"
    },
    {
      id: "blur",
      name: "Blur",
      description: "专业NFT交易平台",
      logo: "https://pbs.twimg.com/profile_images/1618321556259602433/AiYLhk7Q_400x400.jpg",
      banner: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1024",
      url: "https://blur.io",
      chain: ["ethereum"],
      color: "#FF5E00",
      heat: 85,
      downloads: "420万+"
    },
    {
      id: "magiceden",
      name: "Magic Eden",
      description: "多链NFT市场",
      logo: "https://cryptomode.com/wp-content/uploads/2022/01/Magic-Eden-Logo.png",
      banner: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1024",
      url: "https://magiceden.io",
      chain: ["solana", "ethereum", "polygon"],
      color: "#E42575",
      heat: 83,
      downloads: "380万+"
    },
    {
      id: "foundation",
      name: "Foundation",
      description: "创意型NFT平台",
      logo: "https://foundation.app/images/f-icon-touch.png",
      banner: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1024",
      url: "https://foundation.app",
      chain: ["ethereum"],
      color: "#000000",
      heat: 72,
      downloads: "180万+"
    },
    {
      id: "sudoswap",
      name: "Sudoswap",
      description: "NFT流动性协议",
      logo: "https://pbs.twimg.com/profile_images/1543321679656730625/nkUihkUi_400x400.jpg",
      banner: "https://images.unsplash.com/photo-1635321593217-40050ad13c74?q=80&w=1024",
      url: "https://sudoswap.xyz",
      chain: ["ethereum"],
      color: "#4A4A4A",
      heat: 68,
      downloads: "150万+"
    },
    {
      id: "element",
      name: "Element",
      description: "NFT抵押市场",
      logo: "https://pbs.twimg.com/profile_images/1415579955005927428/qnbS37z8_400x400.jpg",
      banner: "https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=1024",
      url: "https://element.market",
      chain: ["ethereum", "bsc"],
      color: "#4775E7",
      heat: 70,
      downloads: "170万+"
    }
  ],
  gaming: [
    {
      id: "axieinfinity",
      name: "Axie Infinity",
      description: "NFT游戏平台",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/axs.png",
      banner: "https://images.unsplash.com/photo-1640340434808-13793754921e?q=80&w=1024",
      url: "https://axieinfinity.com",
      chain: ["ronin"],
      color: "#29B6AF",
      heat: 87,
      downloads: "580万+"
    },
    {
      id: "sandbox",
      name: "The Sandbox",
      description: "元宇宙游戏平台",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/sand.png",
      banner: "https://images.unsplash.com/photo-1635321593243-e725415fd876?q=80&w=1024",
      url: "https://www.sandbox.game",
      chain: ["ethereum"],
      color: "#3065DE",
      heat: 82,
      downloads: "340万+"
    },
    {
      id: "stepn",
      name: "STEPN",
      description: "移动健身赚钱应用",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/gmt.png",
      banner: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1024",
      url: "https://stepn.com",
      chain: ["solana", "bsc"],
      color: "#82E8BB",
      heat: 78,
      downloads: "280万+"
    },
    {
      id: "illuvium",
      name: "Illuvium",
      description: "开放世界RPG游戏",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/ilv.png",
      banner: "https://images.unsplash.com/photo-1616031037011-83814d0944da?q=80&w=1024",
      url: "https://illuvium.io",
      chain: ["ethereum"],
      color: "#FF2D55",
      heat: 75,
      downloads: "230万+"
    },
    {
      id: "gala",
      name: "Gala Games",
      description: "区块链游戏平台",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/gala.png",
      banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1024",
      url: "https://gala.games",
      chain: ["ethereum", "bsc"],
      color: "#FFD633",
      heat: 73,
      downloads: "220万+"
    },
    {
      id: "splinterlands",
      name: "Splinterlands",
      description: "NFT卡牌游戏",
      logo: "https://pbs.twimg.com/profile_images/1455566093146222594/pRpjP--9_400x400.jpg",
      banner: "https://images.unsplash.com/photo-1642405748084-5d7c2c06f59d?q=80&w=1024",
      url: "https://splinterlands.com",
      chain: ["hive", "wax"],
      color: "#FA8728",
      heat: 71,
      downloads: "180万+"
    },
    {
      id: "bigtime",
      name: "Big Time",
      description: "多人动作RPG",
      logo: "https://pbs.twimg.com/profile_images/1633952368969162752/bZl879cf_400x400.jpg",
      banner: "https://images.unsplash.com/photo-1629117175039-a0a0aea19231?q=80&w=1024",
      url: "https://bigtime.gg",
      chain: ["ethereum"],
      color: "#6037FF",
      heat: 76,
      downloads: "240万+"
    }
  ],
  infra: [
    {
      id: "metamask",
      name: "MetaMask",
      description: "以太坊钱包与浏览器",
      logo: "https://github.com/MetaMask/brand-resources/raw/master/SVG/metamask-fox.svg",
      banner: "https://images.unsplash.com/photo-1620559790086-b92643c2f2e9?q=80&w=1024",
      url: "https://metamask.io",
      chain: ["ethereum", "polygon", "arbitrum", "optimism"],
      color: "#F6851B",
      heat: 99,
      downloads: "3000万+"
    },
    {
      id: "phantom",
      name: "Phantom",
      description: "Solana钱包",
      logo: "https://pbs.twimg.com/profile_images/1394116783831109635/xdMzd-Z1_400x400.jpg",
      banner: "https://images.unsplash.com/photo-1640340434742-8ab5553be9c9?q=80&w=1024",
      url: "https://phantom.app",
      chain: ["solana", "ethereum"],
      color: "#AB9FF2",
      heat: 93,
      downloads: "800万+"
    },
    {
      id: "wallet_connect",
      name: "WalletConnect",
      description: "钱包连接协议",
      logo: "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.svg",
      banner: "https://images.unsplash.com/photo-1642190672018-de09bdf4026b?q=80&w=1024",
      url: "https://walletconnect.com",
      chain: ["ethereum", "polygon", "arbitrum", "optimism", "solana"],
      color: "#3B99FC",
      heat: 91,
      downloads: "750万+"
    },
    {
      id: "chainlink",
      name: "Chainlink",
      description: "区块链预言机网络",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/link.png",
      banner: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1024",
      url: "https://chain.link",
      chain: ["ethereum", "polygon", "arbitrum", "optimism", "bsc"],
      color: "#375BD2",
      heat: 88,
      downloads: "600万+"
    },
    {
      id: "the_graph",
      name: "The Graph",
      description: "区块链索引协议",
      logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/grt.png",
      banner: "https://images.unsplash.com/photo-1642190671868-c14ba7e35156?q=80&w=1024",
      url: "https://thegraph.com",
      chain: ["ethereum", "polygon", "arbitrum", "optimism"],
      color: "#6747ED",
      heat: 81,
      downloads: "320万+"
    }
  ]
}

// 前30个热门应用
const getTopApps = (count = 30): WebApp[] => {
  // 合并所有分类的应用并按热度排序
  const allApps = Object.values(web3Apps).flat();
  return allApps.sort((a, b) => b.heat - a.heat).slice(0, count);
};

// 获取正确的图片ID
const getCorrectImageId = (id: string) => {
  // 特殊处理一些ID
  const idMap: Record<string, string> = {
    'wallet_connect': 'walletconnect',
    'axieinfinity': 'axs',
    'the_graph': 'thegraph',
    'makerdao': 'maker'
  };
  
  return idMap[id] || id;
}

// 安全获取图片链接，确保图片存在
const getSafeImageUrl = (url: string, type: 'logo' | 'banner', id: string) => {
  // 获取正确的图片ID
  const correctId = getCorrectImageId(id);
  
  // 替换ID中的特殊字符，确保文件名是有效的
  const safeId = correctId.replace('_', '').toLowerCase();
  
  try {
    if (type === 'logo') {
      const imagePath = `/web3/images/logos/${safeId}.png`;
      // 返回相对路径的图片URL
      return imagePath;
    } else {
      const imagePath = `/web3/images/banners/${safeId}.jpg`;
      // 返回相对路径的图片URL
      return imagePath;
    }
  } catch (error) {
    console.error(`Error getting image for ${id}:`, error);
    // 出错时返回默认图片
    return type === 'logo' 
      ? '/web3/images/logos/generic.png' 
      : '/web3/images/banners/default.jpg';
  }
}

interface ChainBadgeProps {
  chain: string
}

// Update the type definition to include the banner property
interface WebApp {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner?: string;
  url: string;
  chain: string[];
  color: string;
  heat: number;
  downloads: string;
}

// 链标识组件
function ChainBadge({ chain }: ChainBadgeProps) {
  const chainColors: Record<string, string> = {
    ethereum: "#627EEA",
    polygon: "#8247E5",
    arbitrum: "#28A0F0",
    optimism: "#FF0420",
    bsc: "#F0B90B",
    solana: "#14F195",
    ronin: "#1A1E25",
    avalanche: "#E84142",
    hive: "#E31337",
    wax: "#F89022"
  }

  const chainName: Record<string, string> = {
    ethereum: "ETH",
    polygon: "MATIC",
    arbitrum: "ARB",
    optimism: "OP",
    bsc: "BSC",
    solana: "SOL",
    ronin: "RON",
    avalanche: "AVAX",
    hive: "HIVE",
    wax: "WAX"
  }

  return (
    <span 
      className="inline-flex items-center px-2 py-1 text-xs rounded-full"
      style={{ backgroundColor: `${chainColors[chain]}40`, color: chainColors[chain] }}
    >
      {chainName[chain]}
    </span>
  )
}

export default function DiscoverPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [category, setCategory] = useState("hot")
  const [searchQuery, setSearchQuery] = useState("")
  const topApps = getTopApps(30);

  // 处理应用点击
  const handleAppClick = (url: string) => {
    // 将URL加入会话存储，以便可以在web3/app页面中访问
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('appUrl', url);
      // 导航到内部app页面而不是新窗口
      window.location.href = '/web3/app';
    }
  }
  
  // 筛选应用
  const getFilteredApps = () => {
    if (category === "hot") {
      return topApps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return web3Apps[category as keyof typeof web3Apps]?.filter(app => 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }

  // 处理图片加载错误
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; // 防止循环触发错误
    
    // 根据图片类型选择不同的占位图
    const imgEl = e.currentTarget;
    const isLogo = imgEl.width === imgEl.height || imgEl.width < 100; // 通常logo是正方形的或较小的
    
    if (isLogo) {
      // Logo占位图
      imgEl.src = "/web3/images/logos/generic.png";
    } else {
      // Banner占位图
      imgEl.src = "/web3/images/banners/default.jpg";
    }
  }

  const filteredApps = getFilteredApps();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <h1 className="text-xl font-bold">发现</h1>
          </Link>
          
          {/* 搜索框 */}
          <div className="relative flex-grow mx-4">
            <Input
              type="text"
              placeholder="搜索应用..."
              className="bg-gray-900 border-gray-800 pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>

        {/* 内容部分 */}
        <div className="p-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="dex">交易所</TabsTrigger>
              <TabsTrigger value="lending">借贷</TabsTrigger>
              <TabsTrigger value="nft">NFT</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {/* 热门推荐卡片 - 移除标题 */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  {getTopApps(4).map(app => (
                    <div 
                      key={app.id}
                      className="bg-gray-900 rounded-xl p-3 cursor-pointer transition hover:bg-gray-800"
                      onClick={() => handleAppClick(app.url)}
                    >
                      <div className="flex flex-col space-y-3">
                        <div className="w-full h-32 relative rounded-lg overflow-hidden">
                          <Image 
                            src={getSafeImageUrl(app.banner || `/web3/placeholder.png`, 'banner', app.id)}
                            alt={app.name}
                            fill
                            className="object-cover"
                            onError={handleImageError}
                          />
                          {/* 热度标签 */}
                          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
                            热度 {app.heat}
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-lg overflow-hidden mr-2 flex-shrink-0">
                            <Image 
                              src={getSafeImageUrl(app.logo, 'logo', app.id)}
                              alt={app.name} 
                              width={40} 
                              height={40}
                              className="object-cover"
                              onError={handleImageError}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{app.name}</h3>
                            <div className="flex flex-wrap mt-1">
                              {app.chain.slice(0, 2).map(chain => (
                                <ChainBadge key={chain} chain={chain} />
                              ))}
                              {app.chain.length > 2 && <span className="text-xs ml-1 text-gray-400">+{app.chain.length - 2}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 应用列表 */}
              <div>
                <h2 className="font-semibold mb-3">全部应用</h2>
                <div className="space-y-3">
                  {filteredApps.map(app => (
                    <div 
                      key={app.id}
                      className="flex items-center p-3 bg-gray-900 rounded-xl cursor-pointer transition hover:bg-gray-800"
                      onClick={() => handleAppClick(app.url)}
                    >
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden mr-3 flex-shrink-0 border border-gray-800">
                        <Image 
                          src={getSafeImageUrl(app.logo, 'logo', app.id)}
                          alt={app.name} 
                          fill
                          className="object-cover"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{app.name}</h3>
                          <div className="flex items-center text-gray-400">
                            <ExternalLink className="h-4 w-4" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">{app.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap">
                            {app.chain.slice(0, 3).map(chain => (
                              <ChainBadge key={chain} chain={chain} />
                            ))}
                            {app.chain.length > 3 && <span className="text-xs ml-1 text-gray-400">+{app.chain.length - 3}</span>}
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Download className="h-3 w-3 mr-1" />
                            {app.downloads}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* 剩余的标签内容 - 类别特定视图 */}
            {Object.keys(web3Apps).map(category => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="space-y-3">
                  {web3Apps[category as keyof typeof web3Apps].map(app => (
                    <div 
                      key={app.id}
                      className="flex items-center p-3 bg-gray-900 rounded-xl cursor-pointer transition hover:bg-gray-800"
                      onClick={() => handleAppClick(app.url)}
                    >
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden mr-3 flex-shrink-0 border border-gray-800">
                        <Image 
                          src={getSafeImageUrl(app.logo, 'logo', app.id)}
                          alt={app.name} 
                          fill
                          className="object-cover"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{app.name}</h3>
                          <div className="flex items-center text-gray-400">
                            <ExternalLink className="h-4 w-4" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">{app.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap">
                            {app.chain.slice(0, 3).map(chain => (
                              <ChainBadge key={chain} chain={chain} />
                            ))}
                            {app.chain.length > 3 && <span className="text-xs ml-1 text-gray-400">+{app.chain.length - 3}</span>}
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Download className="h-3 w-3 mr-1" />
                            {app.downloads}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* 底部导航 */}
        <BottomNav darkMode={true} />
      </div>
    </div>
  )
} 