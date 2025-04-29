"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { TokenRanking } from "@/app/types/token"
import TokenListItem from "./TokenListItem"
import { useTranslation } from "@/app/i18n/client"

interface TokenListProps {
  tokens: TokenRanking[]
  darkMode: boolean
  isLoading: boolean
  error: string | null
  onTokenClick: (token: TokenRanking) => void
  onRefresh: () => void
  itemsPerPage?: number
}

export default function TokenList({
  tokens,
  darkMode,
  isLoading,
  error,
  onTokenClick,
  onRefresh,
  itemsPerPage = 50
}: TokenListProps) {
  const { t } = useTranslation()
  const displayTokens = tokens.slice(0, itemsPerPage)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(itemsPerPage).fill(0).map((_, index) => (
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
          </Card>
        ))}
      </div>
    )
  }

  if (error && tokens.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-yellow-900/50 p-3 mb-3">
              <RefreshCw className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">数据加载失败</h3>
            <p className="text-red-400 mb-3 text-sm">{error}</p>
            <p className="text-gray-400 text-xs mb-4">
              无法从服务器获取最新代币数据，可能由于网络问题或API服务暂时不可用
            </p>
            <Button onClick={onRefresh} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" /> 重新加载
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (tokens.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        该类别下暂无代币数据
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {displayTokens.map((token) => (
        <TokenListItem 
          key={`${token.chain}-${token.token}`}
          token={token}
          darkMode={darkMode}
          onClick={onTokenClick}
        />
      ))}
    </div>
  )
} 