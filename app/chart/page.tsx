"use client"

import { useState } from "react"
import { ArrowLeft, Share2, Star, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ChartPage() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">BNB/BUSD</h1>
              <p className="text-xs text-gray-400">PancakeSwap V2</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Star className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full">
          <style
            dangerouslySetInnerHTML={{
              __html: `
            #dexscreener-embed{
              position:relative;
              width:100%;
              padding-bottom:125%;
            }
            @media(min-width:1400px){
              #dexscreener-embed{
                padding-bottom:65%;
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
            <iframe src="https://dexscreener.com/bsc/0x227233A20f999FAD45355FF994bbA259A32f4Fe8?embed=1&loadChartSettings=0&info=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"></iframe>
          </div>
        </div>

        {/* Trading Info */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
              <p className="text-xs text-gray-400">价格</p>
              <p className="text-lg font-bold">$598.47</p>
              <p className="text-xs text-green-500">+0.72%</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
              <p className="text-xs text-gray-400">24h交易量</p>
              <p className="text-lg font-bold">$24.5M</p>
              <p className="text-xs text-gray-400">1,245 交易</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
              <p className="text-xs text-gray-400">流动性</p>
              <p className="text-lg font-bold">$89.7M</p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
              <p className="text-xs text-gray-400">市值</p>
              <p className="text-lg font-bold">$98.2B</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
