"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import ChartTabs from "./ChartTabs"

interface ChartWrapperProps {
  src: string
  title: string
  darkMode: boolean
}

export default function ChartWrapper({ src, title, darkMode }: ChartWrapperProps) {
  // 默认设置为展开状态
  const [expandedView, setExpandedView] = useState(true)
  const [showOverlay, setShowOverlay] = useState(true)
  const [activeTab, setActiveTab] = useState("chart")
  
  // 计算高度 - 默认为较短视图，展开后为更长视图
  const baseHeight = expandedView ? "800px" : "550px"
  
  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={`text-xs h-7 rounded-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"}`}
            onClick={() => setShowOverlay(!showOverlay)}
          >
            <Settings2 className="w-3 h-3 mr-1" />
            显示/隐藏
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={`text-xs h-7 rounded-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"}`}
            onClick={() => setExpandedView(!expandedView)}
          >
            {expandedView ? "收起" : "展开"}
          </Button>
        </div>
      </div>
      
      <div className={`relative rounded-xl overflow-hidden ${darkMode ? "border border-gray-800" : "border border-gray-200"}`}>
        <div style={{ height: baseHeight }}>
          <iframe 
            src={src}
            title={title}
            className="w-full h-full border-0"
          />
        </div>
        
        {/* 底部标签栏 */}
        {showOverlay && (
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <ChartTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>
    </div>
  )
} 