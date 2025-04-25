"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ChartTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  darkMode: boolean
}

export default function ChartTabs({ activeTab, setActiveTab, darkMode }: ChartTabsProps) {
  // 标签选项
  const tabOptions = [
    { id: "chart", label: "图表" },
    { id: "info", label: "信息" },
    { id: "trades", label: "交易" },
    { id: "txns", label: "交易记录" }
  ]
  
  return (
    <div 
      className={`flex justify-around items-center h-14 ${
        darkMode ? "bg-gray-900 border-t border-gray-800" : "bg-white border-t border-gray-200"
      }`}
    >
      {tabOptions.map(tab => (
        <Button
          key={tab.id}
          variant="ghost"
          className={`h-full flex-1 rounded-none transition-all ${
            activeTab === tab.id 
              ? `text-blue-500 border-b-2 border-blue-500` 
              : `text-gray-500`
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}