"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import BottomNav from "../../components/BottomNav"

export default function Web3AppPage() {
  const [appUrl, setAppUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 从会话存储中获取应用URL
    if (typeof window !== 'undefined') {
      const url = sessionStorage.getItem('appUrl')
      if (url) {
        setAppUrl(url)
      } else {
        setError('未找到应用URL，请从发现页面选择应用')
      }
    }
  }, [])

  // 处理iframe加载事件
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // 处理刷新iframe
  const handleRefresh = () => {
    setIsLoading(true)
    const iframe = document.getElementById('appFrame') as HTMLIFrameElement
    if (iframe) {
      iframe.src = appUrl
    }
  }

  // 处理在新窗口打开
  const handleOpenExternal = () => {
    window.open(appUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link href="/discover" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <h1 className="text-xl font-bold">返回</h1>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleOpenExternal}
            >
              <ExternalLink className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 内容部分 */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                <p>正在加载应用...</p>
              </div>
            </div>
          )}
          
          {error ? (
            <div className="p-8 text-center">
              <p className="text-red-400">{error}</p>
              <Button asChild className="mt-4">
                <Link href="/discover">返回发现页面</Link>
              </Button>
            </div>
          ) : (
            <iframe 
              id="appFrame"
              src={appUrl}
              className="w-full min-h-screen"
              onLoad={handleIframeLoad}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation"
              referrerPolicy="no-referrer"
              allow="clipboard-read; clipboard-write; encrypted-media; accelerometer; camera; geolocation; gyroscope; microphone; payment"
            />
          )}
        </div>

        {/* 底部导航 */}
        <BottomNav darkMode={true} />
      </div>
    </div>
  )
} 