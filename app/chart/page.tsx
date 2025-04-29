"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Share2, Star, MoreHorizontal, Search, Fullscreen, Calendar, Clock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { searchTokens } from "@/app/lib/ave-api-service"
import { Input } from "@/components/ui/input"

export default function ChartPage() {
  const searchParams = useSearchParams()
  const [darkMode, setDarkMode] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [tokenSymbol, setTokenSymbol] = useState("SOLANA/PAIR")
  const [tokenName, setTokenName] = useState("Solana • K线图")
  const [tokenLogo, setTokenLogo] = useState("/placeholder-token.png")
  const [tokenPrice, setTokenPrice] = useState("$14.647")
  const [tokenChange, setTokenChange] = useState("-0.21%")
  const [tokenVolume, setTokenVolume] = useState("943.67K")
  const [timeFrame, setTimeFrame] = useState("1D") // Default timeframe
  const router = useRouter()
  const searchResultsRef = useRef<HTMLDivElement>(null);
  
  // Available timeframes
  const timeFrames = ["15m", "1H", "4H", "1D", "1W"]

  // Get blockchain and token address from URL query parameters
  const blockchain = searchParams.get('blockchain') || 'solana'
  const address = searchParams.get('address') || '0x227233A20f999FAD45355FF994bbA259A32f4Fe8'
  
  useEffect(() => {
    // Function to close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    // Attach event listener when dropdown is shown
    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResults]);

  // Update the iframe URL when the timeframe changes
  const getChartUrl = () => {
    // Convert timeframe format to DexScreener format
    const intervalMap: Record<string, string> = {
      "15m": "15",
      "1H": "60",
      "4H": "240", 
      "1D": "1440",
      "1W": "10080"
    };
    
    const interval = intervalMap[timeFrame] || "15";
    
    return `https://dexscreener.com/${blockchain}/${address}?embed=1&loadChartSettings=0&info=0&chartLeftToolbar=1&charttradesTable=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=1&chartType=candles&interval=${interval}`;
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    
    setIsSearching(true);
    setShowResults(true);
    
    try {
      const results = await searchTokens(searchValue);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  const handleTokenSelect = (token: any) => {
    setShowResults(false);
    
    // Update token information in the current view
    setTokenSymbol(token.symbol);
    setTokenName(`${token.chain.toUpperCase()} • ${token.name}`);
    if (token.logo_url) {
      setTokenLogo(token.logo_url);
    } else {
      setTokenLogo("/placeholder-token.png");
    }
    
    if (token.current_price_usd) {
      setTokenPrice(`$${parseFloat(token.current_price_usd).toFixed(4)}`);
    }
    
    if (token.price_change_24h) {
      const change = parseFloat(token.price_change_24h);
      setTokenChange(`${change >= 0 ? '+' : ''}${change.toFixed(2)}%`);
    }
    
    if (token.tx_volume_u_24h) {
      const volume = parseFloat(token.tx_volume_u_24h);
      setTokenVolume(formatVolume(volume));
    }
    
    // Navigate to token detail page with K-line chart
    router.push(`/chart?blockchain=${token.chain}&address=${token.token}`);
  }

  const formatVolume = (volume: number): string => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    } else {
      return volume.toFixed(2);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }
  
  const handleTimeFrameClick = (time: string) => {
    setTimeFrame(time);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0b101a]" : "bg-white"} text-white`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-[#11161f] border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                <Image 
                  src={tokenLogo} 
                  alt="Token Logo" 
                  width={28} 
                  height={28} 
                  className="object-cover"
                  onError={() => setTokenLogo("/placeholder-token.png")}
                />
              </div>
            <div>
                <h1 className="text-sm font-bold">{tokenSymbol}</h1>
                <p className="text-xs text-gray-400">{tokenName}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="搜索代币地址..."
                  className="w-48 h-8 text-xs rounded-md bg-gray-800 border-gray-700 text-white"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowResults(true)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 ml-1 text-gray-400 hover:text-white" 
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              
              {showResults && (
                <div 
                  ref={searchResultsRef} 
                  className="absolute right-0 mt-1 w-80 max-h-60 overflow-y-auto rounded-md shadow-lg z-10 bg-gray-900 border border-gray-800"
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
                        className="p-2 flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-800"
                        onClick={() => handleTokenSelect(token)}
                      >
                        <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
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
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-xs text-gray-400">{token.chain.toUpperCase()}</div>
                        </div>
                        <div className="ml-auto text-xs">
                          ${token.current_price_usd?.toFixed(6)}
                        </div>
                        {token.price_change_24h && (
                          <div className={`text-xs ${token.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {token.price_change_24h >= 0 ? '+' : ''}{token.price_change_24h.toFixed(2)}%
                          </div>
                        )}
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
            
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Star className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Fullscreen className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Time Frame Selector */}
        <div className="flex items-center justify-between p-2 bg-[#11161f] border-b border-gray-800">
          <div className="flex items-center">
            <Button variant="ghost" className="text-sm text-white font-bold flex items-center gap-1 px-3 py-1 rounded">
              <span>SOLANA/PAIR</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex">
            {timeFrames.map(time => (
              <Button 
                key={time}
                variant="ghost"
                size="sm"
                className={`px-2 py-1 h-7 rounded-md text-xs ${
                  timeFrame === time 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => handleTimeFrameClick(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        {/* Trading View Elements */}
        <div className="flex items-center p-2 bg-[#11161f] gap-3 border-b border-gray-800">
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 px-2 bg-transparent border-gray-700 text-gray-400 text-xs">
              1s
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2 bg-transparent border-gray-700 text-gray-400 text-xs">
              1m
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2 bg-transparent border-gray-700 text-blue-500 border-blue-500 text-xs">
              5m
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2 bg-transparent border-gray-700 text-gray-400 text-xs">
              15m
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2 bg-transparent border-gray-700 text-gray-400 text-xs">
              1h
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2 bg-transparent border-gray-700 text-gray-400 text-xs">
              4h
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2 bg-transparent border-gray-700 text-gray-400 text-xs">
              D
            </Button>
          </div>
          <div className="flex gap-1 ml-2">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none"><path d="M3.5 11h15m-7.5-7.5v15" stroke="currentColor"></path></svg>
            </Button>
          </div>
        </div>

        {/* Token Price Display */}
        <div className="flex items-start p-3 bg-[#11161f] border-b border-gray-800">
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <span className="text-yellow-500 text-sm">🇺🇸 TRUMP/USDC on Magic Eden</span>
              <div className="bg-blue-900 text-xs px-1 rounded flex items-center">
                <span className="mr-1">1</span>
                <Image src="/placeholder-token.png" alt="DEX" width={12} height={12} />
              </div>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-400 text-xs">dexscreener.com</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-[#00b1ff] font-bold text-lg mr-2">{tokenPrice}</span>
              <span className="text-red-500 text-sm">{tokenChange}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-gray-400 text-xs">Volume: </span>
              <span className="text-white text-xs ml-1">{tokenVolume}</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full bg-[#11161f]">
          <style
            dangerouslySetInnerHTML={{
              __html: `
            #dexscreener-embed{
              position:relative;
              width:100%;
              padding-bottom:60%;
            }
            @media(max-width:768px){
              #dexscreener-embed{
                padding-bottom:100%;
              }
            }
            #dexscreener-embed iframe{
              position:absolute;
              width:100%;
              height:100%;
              top:0;
              left:0;
              border:0;
            }
          `,
            }}
          />
          <div id="dexscreener-embed">
            <iframe src={getChartUrl()} />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="p-2 bg-[#11161f] border-t border-gray-800 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-6 px-2 flex items-center gap-1 text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>Date Range</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
            <span className="text-gray-400">05:23:05 (UTC+8)</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>%</span>
            <span>log</span>
            <span className="text-blue-500">auto</span>
          </div>
        </div>

        {/* Top Traders Tab Navigation */}
        <div className="flex bg-[#11161f] border-t border-gray-800 text-xs">
          <Button className="flex-1 flex items-center justify-center py-2 border-b-2 border-transparent text-gray-400">
            <span className="mr-1">₮</span> Txns
          </Button>
          <Button className="flex-1 flex items-center justify-center py-2 border-b-2 border-blue-500 text-blue-500 bg-blue-900/20">
            <span className="mr-1">📊</span> Chart+Txns
          </Button>
          <Button className="flex-1 flex items-center justify-center py-2 border-b-2 border-transparent text-gray-400">
            <span className="mr-1">📈</span> Chart
          </Button>
          <Button className="flex-1 flex items-center justify-center py-2 border-b-2 border-transparent text-gray-400">
            <span className="mr-1">≡</span> Txns
          </Button>
        </div>

        {/* Indicators */}
        <div className="flex bg-[#11161f] overflow-x-auto px-2 pt-1 pb-2 border-t border-gray-800">
          <Button variant="ghost" className="text-xs px-3 rounded-none border-b-2 border-blue-500 text-blue-500">MA</Button>
          <Button variant="ghost" className="text-xs px-3 rounded-none border-b-2 border-transparent text-gray-400">EMA</Button>
          <Button variant="ghost" className="text-xs px-3 rounded-none border-b-2 border-transparent text-gray-400">BOLL</Button>
          <Button variant="ghost" className="text-xs px-3 rounded-none border-b-2 border-transparent text-gray-400">VOL</Button>
          <Button variant="ghost" className="text-xs px-3 rounded-none border-b-2 border-transparent text-gray-400">MACD</Button>
          <Button variant="ghost" className="text-xs px-3 rounded-none border-b-2 border-transparent text-gray-400">KDJ</Button>
          <Button variant="ghost" className="text-xs px-3 rounded-none border-b-2 border-transparent text-gray-400">RSI</Button>
        </div>
      </div>
    </div>
  )
}
