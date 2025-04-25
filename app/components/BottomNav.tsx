"use client"

import { Home, BarChart2, Grid, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"

export default function BottomNav({ darkMode = true }: { darkMode?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  
  // 确定当前活跃的标签页
  const getActiveTab = () => {
    if (pathname === "/") return "home"
    if (pathname === "/market" || pathname.includes("/token/") || pathname === "/kline") return "market"
    if (pathname === "/discover") return "discover"
    if (pathname === "/profile") return "profile"
    return ""
  }
  
  const activeTab = getActiveTab()

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 flex justify-around py-3 border-t z-50 ${darkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"}`}
    >
      <Button
        variant="ghost"
        className={`flex flex-col items-center gap-1 ${activeTab === "home" ? "text-blue-500" : "text-gray-500"}`}
        onClick={() => router.push("/")}
      >
        <Home className="w-5 h-5" />
        <span className="text-xs">首页</span>
      </Button>
      <Button
        variant="ghost"
        className={`flex flex-col items-center gap-1 ${activeTab === "market" ? "text-blue-500" : "text-gray-500"}`}
        onClick={() => router.push("/market")}
      >
        <BarChart2 className="w-5 h-5" />
        <span className="text-xs">行情</span>
      </Button>
      <Button
        variant="ghost"
        className={`flex flex-col items-center gap-1 ${activeTab === "discover" ? "text-blue-500" : "text-gray-500"}`}
        onClick={() => router.push("/discover")}
      >
        <Grid className="w-5 h-5" />
        <span className="text-xs">发现</span>
      </Button>
      <Button
        variant="ghost"
        className={`flex flex-col items-center gap-1 ${activeTab === "profile" ? "text-blue-500" : "text-gray-500"}`}
        onClick={() => router.push("/profile")}
      >
        <User className="w-5 h-5" />
        <span className="text-xs">我的</span>
      </Button>
    </div>
  )
} 