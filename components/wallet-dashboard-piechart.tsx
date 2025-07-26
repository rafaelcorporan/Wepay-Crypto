import * as RechartsPrimitive from "recharts"
import React from "react"

interface WalletDashboardPieChartProps {
  walletData: {
    balances: Record<string, { amount: number; usdValue: number; change24h: number }>
    totalUsdValue: number
    transactions: unknown[]
  }
  tabColors: Record<string, string>
  ALL_ASSETS: { symbol: string; name: string; decimals: number; color: string }[]
}

export default function WalletDashboardPieChart({ walletData, tabColors, ALL_ASSETS }: WalletDashboardPieChartProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[32rem] mx-auto min-h-[20rem]">
      <RechartsPrimitive.PieChart width={400} height={320}>
        <RechartsPrimitive.Pie
          data={ALL_ASSETS
            .map(asset => ({
              name: asset.symbol,
              value: walletData.balances[asset.symbol]?.usdValue ?? 0,
            }))
            .filter(d => d.value > 0)
          }
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={130}
          stroke="none"
          label={({ cx, cy }) => (
            <g>
              <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle" fontSize="49" fontWeight="bold" fill="#fff">
                ${Math.ceil(walletData.totalUsdValue).toLocaleString()}
              </text>
              <text x={cx} y={cy + 32} textAnchor="middle" dominantBaseline="middle" fontSize="18" fill="#b3b3b3">
                Total USD
              </text>
            </g>
          )}
          startAngle={90}
          endAngle={450}
          paddingAngle={0}
        >
          {ALL_ASSETS.filter(asset => (walletData.balances[asset.symbol]?.usdValue ?? 0) > 0).map(asset => (
            <RechartsPrimitive.Cell key={asset.symbol} fill={tabColors[asset.symbol]} />
          ))}
        </RechartsPrimitive.Pie>
      </RechartsPrimitive.PieChart>
      {/* Removed selected asset value display below the chart to avoid duplicate */}
    </div>
  )
} 