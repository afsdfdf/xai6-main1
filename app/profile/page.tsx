"use client"

import { useState } from "react"
import { ArrowLeft, ChevronRight, Moon, Bell, Shield, LogOut, Wallet, UserCircle, BookOpen, Gift, MessageSquare, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import Image from "next/image"
import BottomNav from "../components/BottomNav"

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(true)

  // 模拟用户数据
  const user = {
    name: "用户123456",
    walletAddress: "0x1a2...3b4c",
    balance: "12,345.67",
    avatar: "/LOGO.JPG"  // 使用已有的LOGO.JPG
  }

  // 菜单项数据
  const menuItems = [
    {
      title: "账户安全",
      icon: <Shield className="w-5 h-5" />,
      href: "#"
    },
    {
      title: "我的钱包",
      icon: <Wallet className="w-5 h-5" />,
      href: "#"
    },
    {
      title: "个人资料",
      icon: <UserCircle className="w-5 h-5" />,
      href: "#"
    },
    {
      title: "交易记录",
      icon: <BookOpen className="w-5 h-5" />,
      href: "#"
    },
    {
      title: "邀请奖励",
      icon: <Gift className="w-5 h-5" />,
      href: "#"
    },
    {
      title: "消息中心",
      icon: <MessageSquare className="w-5 h-5" />,
      badge: 3  // 未读消息数量
    },
    {
      title: "帮助中心",
      icon: <HelpCircle className="w-5 h-5" />,
      href: "#"
    }
  ]

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="max-w-md mx-auto pb-20">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">我的</h1>
            </div>
          </div>
        </div>

        {/* 用户信息卡片 */}
        <div className={`m-4 p-4 rounded-xl ${darkMode ? "bg-gray-900" : "bg-gray-50"} border ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <span>{user.walletAddress}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${user.balance}</p>
              <p className="text-xs text-gray-400">总资产(USD)</p>
            </div>
          </div>
        </div>

        {/* 设置菜单 */}
        <div className="px-4 py-2">
          <h3 className="text-gray-500 text-sm mb-2">设置</h3>
          <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-50"} border ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <span>深色模式</span>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span>通知提醒</span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* 功能菜单 */}
        <div className="px-4 py-2">
          <h3 className="text-gray-500 text-sm mb-2">功能</h3>
          <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-50"} border ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href || "#"}
                className={`flex items-center justify-between p-4 ${
                  index !== menuItems.length - 1 ? "border-b border-gray-800" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 退出按钮 */}
        <div className="px-4 py-6 mt-4">
          <Button 
            variant="outline" 
            className={`w-full ${darkMode ? "border-gray-800 hover:bg-gray-800" : ""}`}
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
      </div>
      
      {/* 底部导航栏 */}
      <BottomNav darkMode={darkMode} />
    </div>
  )
} 