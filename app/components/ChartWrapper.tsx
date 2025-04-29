"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Settings2 } from "lucide-react"
import ChartTabs from "./ChartTabs"
import { getTokenKlineData } from "@/app/lib/ave-api-service"

interface ChartWrapperProps {
  darkMode: boolean
  tokenAddress?: string
  tokenChain?: string
  interval?: string
}

interface KLineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function ChartWrapper({ 
  darkMode, 
  tokenAddress = "0xtoken", 
  tokenChain = "eth",
  interval = "1h"
}: ChartWrapperProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [klineData, setKlineData] = useState<KLineData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取K线数据
  const fetchKlineData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getTokenKlineData(tokenAddress, tokenChain, interval, 30)
      if (data && data.length > 0) {
        setKlineData(data)
      } else {
        throw new Error("未获得K线数据")
      }
    } catch (err) {
      console.error("获取K线数据失败:", err)
      setError(err instanceof Error ? err.message : "未获得K线数据")
      // 使用模拟数据
      setKlineData(generateMockKlineData())
    } finally {
      setIsLoading(false)
    }
  }

  // 生成模拟K线数据
  const generateMockKlineData = (): KLineData[] => {
    const now = Math.floor(Date.now() / 1000)
    const basePrice = 0.007354
    const volatility = 0.005
    
    return Array(14).fill(0).map((_, index) => {
      const timeOffset = (14 - index) * (interval === '1h' ? 3600 : 86400)
      const time = now - timeOffset
      
      const randomFactor = 0.5 - Math.random()
      const priceChange = basePrice * volatility * randomFactor
      
      const open = basePrice + priceChange * (index - 1) / 14
      const close = basePrice + priceChange * index / 14
      const high = Math.max(open, close) * (1 + Math.random() * 0.02)
      const low = Math.min(open, close) * (1 - Math.random() * 0.02)
      const volume = 100 + Math.random() * 2000
      
      return { time, open, high, low, close, volume }
    })
  }

  useEffect(() => {
    fetchKlineData()
  }, [tokenAddress, tokenChain, interval])

  useEffect(() => {
    // 绘制K线图
    const drawKLineChart = () => {
      if (!chartRef.current || klineData.length === 0) return
      
      const ctx = document.createElement('canvas')
      ctx.width = chartRef.current.clientWidth
      ctx.height = chartRef.current.clientHeight
      chartRef.current.innerHTML = ''
      chartRef.current.appendChild(ctx)
      
      const context = ctx.getContext('2d')
      if (!context) return
      
      // 绘制背景
      context.fillStyle = '#1a202c'
      context.fillRect(0, 0, ctx.width, ctx.height)
      
      // 绘制坐标轴
      context.strokeStyle = '#2d3748'
      context.lineWidth = 1
      
      // 绘制水平线
      for (let i = 0; i < 5; i++) {
        const y = ctx.height / 5 * i
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(ctx.width, y)
        context.stroke()
      }
      
      // 绘制垂直线
      for (let i = 0; i < 10; i++) {
        const x = ctx.width / 10 * i
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, ctx.height)
        context.stroke()
      }
      
      // 找出最高和最低价格
      const highestPrice = Math.max(...klineData.map(k => k.high))
      const lowestPrice = Math.min(...klineData.map(k => k.low))
      const priceRange = highestPrice - lowestPrice
      
      // 绘制K线
      const kLineWidth = ctx.width / (klineData.length + 2)
      
      klineData.forEach((kLine, index) => {
        const x = kLineWidth * (index + 1)
        const candleHeight = ((kLine.open - kLine.close) / priceRange) * ctx.height * 0.7
        const bodyY = ((highestPrice - kLine.open) / priceRange) * ctx.height * 0.7 + ctx.height * 0.1
        
        // 绘制K线实体
        context.fillStyle = kLine.open > kLine.close ? '#e53e3e' : '#38a169'
        context.fillRect(
          x - kLineWidth / 4, 
          bodyY,
          kLineWidth / 2,
          candleHeight
        )
        
        // 绘制上影线
        context.beginPath()
        context.strokeStyle = kLine.open > kLine.close ? '#e53e3e' : '#38a169'
        context.moveTo(x, ((highestPrice - kLine.high) / priceRange) * ctx.height * 0.7 + ctx.height * 0.1)
        context.lineTo(x, bodyY)
        context.stroke()
  
        // 绘制下影线
        context.beginPath()
        context.moveTo(x, bodyY + candleHeight)
        context.lineTo(x, ((highestPrice - kLine.low) / priceRange) * ctx.height * 0.7 + ctx.height * 0.1)
        context.stroke()
      })
      
      // 绘制MA5线
      context.beginPath()
      context.strokeStyle = '#ecc94b'
      context.lineWidth = 1.5
      
      const maData = []
      for (let i = 0; i < klineData.length; i++) {
        if (i < 4) {
          maData.push(null)
          continue
        }
        
        let sum = 0
        for (let j = i - 4; j <= i; j++) {
          sum += klineData[j].close
        }
        maData.push(sum / 5)
      }
      
      maData.forEach((ma, index) => {
        if (ma === null) return
        
        const x = kLineWidth * (index + 1)
        const y = ((highestPrice - ma) / priceRange) * ctx.height * 0.7 + ctx.height * 0.1
        
        if (index === 4 || maData[index - 1] === null) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      })
      context.stroke()
      
      // 添加当前价格标签
      context.fillStyle = '#f7fafc'
      context.font = '12px Arial'
      context.fillText(`$${klineData[klineData.length - 1].close.toFixed(6)}`, ctx.width - 75, 20)
      
      // 添加时间标签
      const lastTime = new Date(klineData[klineData.length - 1].time * 1000)
      const timeStr = lastTime.toLocaleTimeString() + ' ' + lastTime.toLocaleDateString()
      context.fillText(timeStr, ctx.width - 180, ctx.height - 10)
      
      // 如果是模拟数据，添加标记
      if (error) {
        context.fillStyle = 'rgba(255, 165, 0, 0.7)'
        context.fillRect(10, 10, 90, 20)
        context.fillStyle = '#000'
        context.fillText('模拟数据', 15, 25)
      }
    }
    
    drawKLineChart()
    
    // 窗口大小变化时重新绘制
    const handleResize = () => drawKLineChart()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [klineData, error, darkMode])
  
  return (
    <div className="w-full h-full bg-gray-900 relative">
      {isLoading ? (
        <div className="flex justify-center items-center h-full text-gray-400">
          <div className="animate-spin mr-2 h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          正在加载K线数据...
        </div>
      ) : (
        <div 
          ref={chartRef} 
          className="w-full h-full"
          />
      )}
        
      {error && (
        <Button 
          className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-xs p-1 h-7"
          onClick={fetchKlineData}
        >
          <RefreshCw className="w-3 h-3 mr-1" /> 重新加载
        </Button>
        )}
    </div>
  )
} 