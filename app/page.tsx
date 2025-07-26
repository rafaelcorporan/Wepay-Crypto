"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { WalletDashboard } from "@/components/wallet-dashboard"
import { SendPay } from "@/components/send-pay"
import { ExportData } from "@/components/export-data"
import { Messages } from "@/components/messages"
import { Contacts } from "@/components/contacts"
import { Settings as SettingsModule } from "@/components/settings"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PayRequest } from "@/components/pay-request"
import { Login } from "@/components/login"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const { isAuthenticated, isLoading, login, logout } = useAuth()
  const [activeView, setActiveView] = useState("dashboard")
  const [payTab, setPayTab] = useState<'send'|'receive'>("send")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Handle window resize to close mobile sidebar on desktop
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Show loading or login screen if not authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#181A1B] flex items-center justify-center">
        <div className="text-[#FF6600] text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />
  }
  
  // Debug: Log current state
  console.log("Current activeView:", activeView, "payTab:", payTab)

  const renderActiveView = () => {
    // Show payment tabs when in any payment-related view
    if (activeView === "send" || activeView === "receive") {
      return (
        <div>
          {/* Main Payment Tabs */}
          <Tabs value={payTab} onValueChange={v => setPayTab(v as 'send'|'receive')} className="mb-6">
            <TabsList className="w-full flex gap-2 bg-[#181A1B] border border-[#2D2D2D] rounded-lg p-1">
              <TabsTrigger 
                value="send" 
                className="flex-1 data-[state=active]:bg-[#FF6600] data-[state=active]:text-white text-gray-300 text-sm sm:text-base font-semibold rounded-lg py-2"
              >
                SEND PAY
              </TabsTrigger>
              <TabsTrigger 
                value="receive" 
                className="flex-1 data-[state=active]:bg-[#FF6600] data-[state=active]:text-white text-gray-300 text-sm sm:text-base font-semibold rounded-lg py-2"
              >
                GET PAY
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/* Tab Content */}
          {payTab === 'send' && (
            <SendPay onBack={() => setActiveView("dashboard")}/>
          )}
          {payTab === 'receive' && (
            <PayRequest />
          )}
        </div>
      )
    }
    switch (activeView) {
      case "dashboard":
        return <WalletDashboard />
      case "export":
        return <ExportData onBack={() => setActiveView("dashboard")} />
      case "messages":
        return <Messages />
      case "contacts":
        return <Contacts />
      case "settings":
        return <SettingsModule />
      default:
        return <WalletDashboard />
    }
  }

  const handleViewChange = (view: string) => {
    if (view === "send" || view === "receive") {
      setPayTab(view as 'send'|'receive')
    }
    setActiveView(view)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#181A1B] text-[#f2f4f4] flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#222426] border-b border-[#2D2D2D] z-40 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md bg-[#1a1c1d] border border-[#2D2D2D] text-gray-300 hover:bg-[#2D2D2D]"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <div className="text-[#FF6600] font-bold text-lg tracking-wider">WEPAY CRYPTO</div>
            <div className="text-xs text-gray-400">v2.1.7 CLASSIFIED</div>
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile Overlay (fixed, flex) */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex min-h-0">
          {/* Sidebar */}
          <div className="h-full w-80 max-w-[85vw] bg-[#222426] border-r border-[#2D2D2D] flex flex-col min-h-0">
            <Sidebar activeView={activeView} setActiveView={handleViewChange} onLogout={logout} />
          </div>
          {/* Backdrop */}
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={closeSidebar}
          />
        </div>
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar activeView={activeView} setActiveView={handleViewChange} onLogout={logout} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            {renderActiveView()}
          </div>
        </div>
      </main>
    </div>
  )
}
