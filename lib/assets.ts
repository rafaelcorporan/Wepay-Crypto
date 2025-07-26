export interface Asset {
  symbol: string
  name: string
  decimals: number
  address?: string
  color: string
}

export const ALLOWED_ASSETS: Asset[] = [
  {
    symbol: "XRP",
    name: "Ripple",
    decimals: 6,
    color: "#23292F"
  },
  {
    symbol: "XLM",
    name: "Stellar",
    decimals: 7,
    color: "#7B68EE"
  },
  {
    symbol: "RLUSD",
    name: "Real USD",
    decimals: 2,
    color: "#6495ED"
  }
]

export const getAssetBySymbol = (symbol: string): Asset | undefined => {
  return ALLOWED_ASSETS.find(asset => asset.symbol === symbol.toUpperCase())
}

export const isAllowedAsset = (symbol: string): boolean => {
  return ALLOWED_ASSETS.some(asset => asset.symbol === symbol.toUpperCase())
}

// Extra assets for the wallet (shared across the app)
export const EXTRA_ASSETS: Asset[] = [
  { symbol: 'XDC', name: 'XDC', decimals: 6, color: '#00FFFF' },
  { symbol: 'SGB', name: 'SGB', decimals: 6, color: '#FF69B4' },
  { symbol: 'SOLO', name: 'SOLO', decimals: 6, color: '#FF0000' },
  { symbol: 'HBAR', name: 'HBAR', decimals: 6, color: '#d5d8dc' },
  { symbol: 'FLR', name: 'FLR', decimals: 6, color: '#a102e7' },
  { symbol: 'CSPR', name: 'CSPR', decimals: 6, color: '#FF4500' },
  // Newly added assets
  { symbol: 'ALGO', name: 'Algorand', decimals: 6, color: '#f4d03f' },
  { symbol: 'QNT', name: 'Quant', decimals: 6, color: '#2ecc71' },
  { symbol: 'IOTA', name: 'IOTA', decimals: 6, color: '#34495e' },
]

export const ALL_ASSETS: Asset[] = [...ALLOWED_ASSETS, ...EXTRA_ASSETS] 