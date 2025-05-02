"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 模拟加载进度
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // 设置 2.5 秒后开始淡出
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 2500)

    // 设置 3 秒后完成过场动画
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3000)

    // 清理定时器
    return () => {
      clearInterval(progressInterval)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div 
      className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* 背景图片，自动匹配浏览器尺寸 */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/kp.png"
          alt="Background"
          fill
          priority
          className="object-cover w-full h-full"
          sizes="100vw"
        />
      </div>
      
      {/* 暗色叠加层，使内容更易读 */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* 内容容器 */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* XAI FINANCE 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2 animate-pulse">XAI FINANCE</h1>
          <p className="text-xl text-gray-200">加密货币交易的未来</p>
        </div>
        
        {/* 底部加载区域 - LOGO放在进度条左边 */}
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <div className="max-w-md mx-auto flex items-center space-x-4">
            {/* LOGO - 增大尺寸 */}
            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-blue-600 shadow-lg">
              <div className="relative w-full h-full">
                <Image
                  src="/logo.png"
                  alt="XAI Logo"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* 进度条 - 缩短宽度 */}
            <div className="w-48 md:w-64">
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-1">
                <div 
                  className="h-full bg-blue-500 transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-white text-sm">{progress}% 加载中...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 