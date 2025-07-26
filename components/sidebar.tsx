"use client"

import { Wallet, Send, QrCode, Settings, MessageCircle, LogOut } from "lucide-react"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  onLogout?: () => void
}

export function Sidebar({ activeView, setActiveView, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "messages", label: "MESSAGES", icon: MessageCircle },
    { id: "receive", label: "GET PAY", icon: QrCode },
    { id: "send", label: "SEND PAY", icon: Send },
    { id: "dashboard", label: "WALLET", icon: Wallet },
  ]

  const handleItemClick = (viewId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveView(viewId)
  }

  return (
    <div className="w-full lg:w-72 bg-[#222426] border-r border-[#2D2D2D] flex flex-col h-full">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden lg:block p-4 lg:p-6 border-b border-[#2D2D2D]">
        <div className="text-[#FF6600] font-bold text-lg tracking-wider">WEPAY CRYPTO</div>
        <div className="text-xs text-gray-400 mt-1">WEPAY</div>
      </div>

      <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={(e) => handleItemClick(item.id, e)}
              className={`w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded text-left transition-colors ${
                isActive ? "bg-[#FF6600] text-white" : "text-gray-300 hover:bg-[#2D2D2D] hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              <span className="font-medium text-xs lg:text-sm tracking-wide truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* SETTINGS and LOGOUT at the bottom */}
      <div className="p-3 lg:p-4 border-t border-[#2D2D2D] mt-auto space-y-1 lg:space-y-2">
        <button
          onClick={e => handleItemClick("settings", e)}
          className={`w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded text-left transition-colors ${
            activeView === "settings" ? "bg-[#FF6600] text-white" : "text-gray-400 hover:bg-[#2D2D2D] hover:text-white"
          }`}
        >
          <Settings className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
          <span className="font-medium text-xs lg:text-sm tracking-wide truncate">SETTINGS</span>
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onLogout?.()
          }}
          className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded text-left transition-colors text-red-400 hover:bg-red-900/20 hover:text-red-300"
        >
          <LogOut className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
          <span className="font-medium text-xs lg:text-sm tracking-wide truncate">LOGOUT</span>
        </button>
      </div>
    </div>
  )
}
