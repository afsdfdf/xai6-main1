"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Smile } from "lucide-react"
import { Card } from "@/components/ui/card"
import { TokenRanking } from "@/app/types/token"

interface TokenListItemProps {
  token: TokenRanking
  darkMode: boolean
  onClick: (token: TokenRanking) => void
}

export default function TokenListItem({ token, darkMode, onClick }: TokenListItemProps) {
  // 生成一个唯一的token标识符
  const tokenId = `${token.chain}-${token.token}`
  // 价格变化是正数还是负数
  const isPriceUp = token.price_change_24h > 0
  // 添加图片加载错误状态
  const [imageError, setImageError] = useState(false)
  // 添加图片URL状态，用于处理URL优化
  const [imageUrl, setImageUrl] = useState<string | null>(token.logo_url || null)
  
  // 处理SVG图片URL
  useEffect(() => {
    if (token.logo_url) {
      // 检查URL是否有效
      const img = new window.Image();
      img.onload = () => {
        setImageUrl(token.logo_url);
        setImageError(false);
      };
      img.onerror = () => {
        // 尝试修复URL
        if (token.logo_url.includes('.svg')) {
          // 尝试修改URL，使用静态资源或默认图标
          setImageError(true);
        } else {
          setImageError(true);
        }
      };
      img.src = token.logo_url;
    } else {
      setImageError(true);
    }
  }, [token.logo_url]);
  
  return (
    <Card
      className={`p-1.5 mb-1 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} cursor-pointer hover:opacity-90 transition-opacity rounded-lg border-none`}
      onClick={() => onClick(token)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
            {imageUrl && !imageError ? (
              <div className="w-full h-full">
                <Image
                  src={imageUrl}
                  alt={token.symbol}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  onError={() => setImageError(true)}
                  unoptimized={true}
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-yellow-400">
                <Smile className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{token.symbol || 'Unknown'}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">{token.chain.toUpperCase()}</span>
            </div>
            <div className="text-xs text-gray-400">{formatVolume(token.tx_volume_u_24h)} • {formatHolders(token.holders)}持有</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium text-sm">{formatPrice(token.current_price_usd)}</div>
          <div
            className={`text-xs ${
              isPriceUp 
                ? "text-green-500" 
                : token.price_change_24h < 0 
                ? "text-red-500" 
                : "text-gray-400"
            }`}
          >
            {formatPercentChange(token.price_change_24h)}
          </div>
        </div>
      </div>
    </Card>
  )
}

// 格式化价格
export function formatPrice(price: number) {
  if (!price && price !== 0) return "N/A"
  if (price === 0) return "$0.00"
  if (price < 0.000001) return "<$0.000001"
  if (price < 0.01) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  if (price < 10) return `$${price.toFixed(2)}`
  return `$${price.toFixed(2)}`
}

// 格式化百分比变化
export function formatPercentChange(change: number) {
  if (!change && change !== 0) return "0.00%"
  return change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`
}

// 格式化交易量
export function formatVolume(volume: number) {
  if (!volume && volume !== 0) return "N/A"
  if (volume === 0) return "$0"
  if (volume < 1000) return `$${volume.toFixed(0)}`
  if (volume < 1000000) return `$${(volume / 1000).toFixed(1)}K`
  if (volume < 1000000000) return `$${(volume / 1000000).toFixed(1)}M`
  return `$${(volume / 1000000000).toFixed(1)}B`
}

// 格式化持有者数量
export function formatHolders(holders: number) {
  if (!holders && holders !== 0) return "N/A"
  if (holders === 0) return "0"
  if (holders < 1000) return holders.toString()
  if (holders < 1000000) return `${(holders / 1000).toFixed(1)}K`
  return `${(holders / 1000000).toFixed(1)}M`
} 