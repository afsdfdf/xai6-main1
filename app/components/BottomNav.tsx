"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart2, Compass, Book, Wallet } from "lucide-react"

interface BottomNavProps {
  darkMode: boolean
}

export default function BottomNav({ darkMode }: BottomNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: "首页",
      icon: Home,
      href: "/"
    },
    {
      name: "市场",
      icon: BarChart2,
      href: "/market"
    },
    {
      name: "发现",
      icon: Compass,
      href: "/discover"
    },
    {
      name: "交易",
      icon: Book,
      href: "/trade"
    },
    {
      name: "钱包",
      icon: Wallet,
      href: "/wallet"
    }
  ]

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${darkMode ? "bg-gray-900 border-t border-gray-800" : "bg-white border-t border-gray-200"}`}>
      <div className="max-w-md mx-auto grid grid-cols-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 ${isActive ? "text-blue-500" : darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-500" : darkMode ? "text-gray-400" : "text-gray-600"}`} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}