"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { ALLOWED_ASSETS, ALL_ASSETS, Asset } from "@/lib/assets"
import dynamic from "next/dynamic"
const PieChartNoSSR = dynamic(() => import("./wallet-dashboard-piechart"), { ssr: false })

export function WalletDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ALLOWED_ASSETS[0]) // Default to XRP

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Ensure walletData.balances includes all assets with fixed demo values for new assets
  const walletData = {
    balances: {
      XRP: { amount: 1250.456789, usdValue: 892.34, change24h: 5.67 },
      XLM: { amount: 5000.1234567, usdValue: 445.67, change24h: -2.34 },
      RLUSD: { amount: 1000.00, usdValue: 1000.00, change24h: 0.00 },
      XDC: { amount: 4321.12, usdValue: 2100.55, change24h: 2.13 },
      SGB: { amount: 2789.44, usdValue: 1345.22, change24h: -1.45 },
      SOLO: { amount: 1500.00, usdValue: 800.00, change24h: 0.67 },
      HBAR: { amount: 6890.77, usdValue: 2500.33, change24h: 3.21 },
      FLR: { amount: 2100.50, usdValue: 1200.10, change24h: -0.98 },
      CSPR: { amount: 3200.88, usdValue: 1600.44, change24h: 1.75 },
      ALGO: { amount: 1850.25, usdValue: 925.12, change24h: 1.23 },
      QNT: { amount: 125.75, usdValue: 1875.50, change24h: -0.45 },
      IOTA: { amount: 3450.90, usdValue: 1725.45, change24h: 2.78 },
    } as Record<string, { amount: number; usdValue: number; change24h: number }>,
    totalUsdValue: 2338.01,
    transactions: [
      {
        id: "tx1",
        type: "received",
        asset: "XRP",
        amount: 250.123456,
        from: "rDepositSourceAddress1234567890",
        timestamp: "2025-01-09T10:00:00Z",
        status: "confirmed",
      },
      {
        id: "tx2",
        type: "sent",
        asset: "CSPR",
        amount: 100.5,
        to: "casperRecipientAddress0987654321",
        timestamp: "2025-01-09T09:30:00Z",
        status: "confirmed",
      },
      {
        id: "tx3",
        type: "received",
        asset: "XDC",
        amount: 500.00,
        from: "xdcSenderAddress5678901234",
        timestamp: "2025-01-09T08:45:00Z",
        status: "confirmed",
      },
    ],
  }

  const activityLog = [
    {
      timestamp: "08/01/2025 14:30",
      action: "Wallet",
      details: "gh0st_fire received 100.456789 XRP from external wallet",
      type: "receive",
    },
    {
      timestamp: "08/01/2025 12:15",
      action: "Wallet",
      details: "dr4g0n_V3in sent 250.5000000 XLM to external address",
      type: "send",
    },
    {
      timestamp: "08/01/2025 09:45",
      action: "System",
      details: "Wallet backup completed successfully",
      type: "system",
    },
    {
      timestamp: "08/01/2025 08:20",
      action: "Security",
      details: "Two-factor authentication verified",
      type: "security",
    },
  ]

  const currentBalance = walletData.balances[selectedAsset.symbol as keyof typeof walletData.balances] || { amount: 0, usdValue: 0, change24h: 0 }

  // Asset color mapping for tab highlight
  const tabColors: Record<string, string> = {
    XRP: '#0000FF',
    XLM: '#ff6347',
    RLUSD: '#6495ED',
    XDC: '#00FFFF', // Aqua blue
    SGB: '#FF69B4', // pink
    SOLO: '#FF0000', // red
    HBAR: '#d5d8dc', // light grey
    FLR: '#a102e7', // purple
    CSPR: '#FF4500', // orange red
    ALGO: '#f4d03f', // yellow
    QNT: '#2ecc71', // green
    IOTA: '#34495e', // dark blue-grey
  }

  // Activity log color mapping
  const activityColors: Record<string, string> = {
    XRP: '#0000FF',
    XLM: '#ff6347',
    RLUSD: '#6495ED',
    XDC: '#00FFFF',
    SGB: '#FF69B4',
    SOLO: '#FF0000',
    HBAR: '#d5d8dc',
    FLR: '#a102e7',
    CSPR: '#FF4500',
    ALGO: '#f4d03f',
    QNT: '#2ecc71',
    IOTA: '#34495e',
    default: '#FF6600',
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider">DASHBOARD</h1>
        </div>
        <div className="text-xs sm:text-sm text-gray-400">
          {`Last update: ${currentTime.toLocaleString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            hour12: true
          }).replace(',', ' /').replace(/ (\d{1,2}):\d{2} (AM|PM)/, ', $1$2.')}  (GMT-4)`}
        </div>
      </div>

      {/* Assets Distribution Card - now at the top */}
      <div className="bg-[#18191A] rounded-2xl border border-[#23272A] p-6 flex flex-col items-center max-w-4xl mx-auto shadow-lg w-full">
        <div className="text-lg font-semibold text-white mb-1">Assets Distribution</div>
        <div className="text-xs text-gray-400 mb-4">Asset Values in (USD)</div>
        <PieChartNoSSR walletData={walletData} tabColors={tabColors} ALL_ASSETS={ALL_ASSETS} />
        {/* Show selected asset value above the scroller, not inside */}
        <div className="mb-2 text-xl font-bold flex items-center gap-2">
          <span style={{ color: tabColors[selectedAsset.symbol] }}>{selectedAsset.symbol}</span>
          <span className="text-white">${walletData.balances[selectedAsset.symbol]?.usdValue?.toLocaleString() ?? '0'}</span>
        </div>
        <div className="overflow-x-auto hide-scrollbar w-full">
          <div className="flex flex-nowrap justify-center gap-6 min-w-max w-full">
            {ALL_ASSETS.map(asset => (
              <button
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset)}
                className={`flex items-center gap-2 text-xs flex-shrink-0 px-2 py-1 rounded transition-colors border-2 font-medium ${
                  selectedAsset.symbol === asset.symbol
                    ? "bg-[#23272A] text-white border-white"
                    : "bg-transparent text-white border-transparent hover:bg-[#2D2D2D]"
                }`}
                style={selectedAsset.symbol === asset.symbol ? { color: tabColors[asset.symbol], borderColor: tabColors[asset.symbol] } : {}}
              >
                <span className="inline-block w-3 h-3 rounded-full" style={{background: tabColors[asset.symbol]}}></span> {asset.symbol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {/* Wallet Balance Section (RECENT TRANSACTIONS) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {ALL_ASSETS.map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset)}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors border-2 ${
                  selectedAsset.symbol === asset.symbol
                    ? `bg-[${tabColors[asset.symbol]}] text-white border-[${tabColors[asset.symbol]}]`
                    : "bg-[#1a1c1d] text-gray-300 border-transparent hover:bg-[#2D2D2D]"
                }`}
                style={selectedAsset.symbol === asset.symbol ? { background: tabColors[asset.symbol], borderColor: tabColors[asset.symbol], color: '#fff' } : {}}
              >
                {asset.symbol}
              </button>
            ))}
          </div>
        </div>
        {/* Balance Stats */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 mb-6 sm:mb-8 w-full">
            <div className="flex flex-col items-center w-full sm:w-auto">
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: tabColors[selectedAsset.symbol] }}>
                {currentBalance?.amount?.toFixed(selectedAsset.decimals) ?? '0.000000'}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Total {selectedAsset.symbol}</div>
            </div>
            <div className="hidden sm:block h-10 w-px bg-gray-600 mx-4" />
            <div className="flex flex-col items-center w-full sm:w-auto">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                ${currentBalance?.usdValue?.toLocaleString?.() ?? '0'}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">USD Value</div>
            </div>
          </div>
        {/* Recent Transactions */}
        <div className="space-y-3">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide">RECENT TRANSACTIONS</h3>
          <div className="space-y-2 sm:space-y-3">
            {walletData.transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-[#1a1c1d] rounded border border-[#2D2D2D] gap-2 sm:gap-0"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {tx.type === "received" ? (
                    <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm sm:text-base">
                      {tx.type === "received" ? "Received" : "Sent"} {tx.amount.toFixed(selectedAsset.decimals)} {tx.asset}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {tx.type === "received" ? `From: ${tx.from?.slice(0, 20)}...` : `To: ${tx.to?.slice(0, 20)}...`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-medium">{tx.status.toUpperCase()}</div>
                  <div className="text-xs text-gray-400">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITIES - wide card at the bottom */}
      <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 tracking-wide">RECENT ACTIVITIES</h2>
        <div className="space-y-3 sm:space-y-4">
          {activityLog.map((log, index) => {
            let color = activityColors.default;
            const asset = ALL_ASSETS.map(a => a.symbol).find(a => log.details.includes(a));
            if (asset) {
              color = activityColors[asset];
            } else if (log.action === 'System') {
              color = '#00C853'; // green for System
            } else if (log.action === 'Security') {
              color = '#000000'; // black for Security
            }
            const textColor = '#686868';

            // Format transaction activities
            let detailsNode: React.ReactNode = log.details;
            if (log.action === 'Wallet' && asset) {
              // Try to extract: name, action, amount, asset, contact, address
              // Example: 'gh0st_fire received 100.456789 XRP from external wallet'
              // or 'dr4g0n_V3in sent 250.5000000 XLM to external address'
              const assetSymbols = ALL_ASSETS.map(a => a.symbol).join('|');
              const receivedMatch = log.details.match(new RegExp(`(\\w+) received ([\\d,.]+) (${assetSymbols}) from ([\\w\\s]+)(?:, wallet address: \\(([^)]+)\\))?`, 'i'));
              const sentMatch = log.details.match(new RegExp(`(\\w+) sent ([\\d,.]+) (${assetSymbols}) to ([\\w\\s]+)(?:, wallet address: \\(([^)]+)\\))?`, 'i'));
              if (receivedMatch) {
                const [, walletName, amount, assetName, contactName, address] = receivedMatch;
                detailsNode = <>
                  <span className="font-medium">{walletName}</span> received <span style={{ color }}>{amount} {assetName}</span> from <span className="font-medium">{contactName}</span>
                  {address && <>, wallet address: (<span className="font-mono text-xs">{address}</span>)</>}
                </>;
              } else if (sentMatch) {
                const [, walletName, amount, assetName, contactName, address] = sentMatch;
                detailsNode = <>
                  <span className="font-medium">{walletName}</span> sent <span style={{ color }}>{amount} {assetName}</span> to <span className="font-medium">{contactName}</span>
                  {address && <>, wallet address: (<span className="font-mono text-xs">{address}</span>)</>}
                </>;
              }
            }

            return (
              <div
                key={index}
                className="border-l-2 pl-3 sm:pl-4"
                style={{ borderColor: color }}
              >
                <div className="text-xs mb-1" style={{ color: textColor }}>{log.timestamp}</div>
                <div className="text-xs sm:text-sm" style={{ color: textColor }}>
                  <span className="font-medium">{log.action}</span>{" "}
                  <span>{detailsNode}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
