"use client"

import { useState, useRef } from "react"
import { ArrowLeft, QrCode, Send, AlertTriangle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ALLOWED_ASSETS, Asset } from "@/lib/assets"
import { ALL_ASSETS } from "@/lib/assets"
import jsQR from "jsqr"

interface SendPayProps {
  onBack: () => void
}

export function SendPay({ onBack }: SendPayProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ALLOWED_ASSETS[0]) // Default to XRP
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [memo, setMemo] = useState("")
  const [showQrScanner, setShowQrScanner] = useState(false)
  const [showContactPicker, setShowContactPicker] = useState(false)
  const [contactSearch, setContactSearch] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState("")

  const walletBalances = {
    XRP: 1250.456789,
    XLM: 5000.1234567,
    RLUSD: 1000.00
  }

  const networkFees = {
    XRP: 0.000012,
    XLM: 0.00001,
    RLUSD: 0.50
  }

  const handleSend = () => {
    // Simulate sending payment
    alert(`Payment of ${amount} ${selectedAsset.symbol} sent successfully!`)
    onBack()
  }

  const getAddressPlaceholder = () => {
    switch (selectedAsset.symbol) {
      case "XRP":
        return "Enter XRP address (r...) or scan QR code"
      case "XLM":
        return "Enter Stellar address (G...) or scan QR code"
      case "RLUSD":
        return "Enter Ethereum address (0x...) or scan QR code"
      default:
        return "Enter address or scan QR code"
    }
  }

  // Contact list for picker
  const contactList = [
    { id: '1', name: 'Alice', address: 'rAliceXRPAddress123456' },
    { id: '2', name: 'Bob', address: 'GBOBXLMAddress654321' },
    { id: '3', name: 'Carol', address: '0xCarolRLUSDAddress789012' },
  ];

  // Asset color mapping for tab and amount (cover all ALL_ASSETS)
  const assetColors: Record<string, string> = {
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
  }

  // QR Scanner logic
  const startQrScanner = async () => {
    setScanError("")
    setShowQrScanner(true)
    setScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute("playsinline", "true")
        videoRef.current.play()
        requestAnimationFrame(scanFrame)
      }
    } catch {
      setScanError("Camera access denied or unavailable.")
      setScanning(false)
    }
  }

  const stopQrScanner = () => {
    setShowQrScanner(false)
    setScanning(false)
    setScanError("")
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const scanFrame = async () => {
    if (!videoRef.current || !scanning) return
    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, canvas.width, canvas.height)
      if (code) {
        setRecipient(code.data)
        stopQrScanner()
        return
      }
    }
    requestAnimationFrame(scanFrame)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="bg-[#222426] border-[#2D2D2D] text-gray-300 hover:bg-[#2D2D2D] flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        {/* Remove the old title, as the tab provides context */}
      </div>
      {/* Main Content Grid */}
      <div className="flex flex-col items-center w-full">
        {/* Payment Details */}
        <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-4 sm:p-6 w-full max-w-xl">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold tracking-wide text-center mb-2">PAYMENT DETAILS</h2>
            <div className="w-full">
              <div className="overflow-x-auto flex gap-2 pb-1 hide-scrollbar w-full sm:w-auto px-6">
                {ALL_ASSETS.map((asset: Asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border-2 min-w-[56px] flex-shrink-0
                      ${selectedAsset.symbol === asset.symbol
                        ? "bg-[#FF6600] text-white border-[#FF6600] shadow"
                        : "bg-[#1a1c1d] text-gray-300 border-transparent hover:bg-[#2D2D2D]"}
                    `}
                    style={selectedAsset.symbol === asset.symbol ? { background: assetColors[asset.symbol], borderColor: assetColors[asset.symbol], color: '#fff' } : {}}
                  >
                    {asset.symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Receiver Address with Contact Picker */}
            <div className="relative">
              <Label htmlFor="recipient" className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                Receiver Address
              </Label>
              <div className="flex gap-2">
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={getAddressPlaceholder()}
                  className="bg-[#1a1c1d] border-[#2D2D2D] text-white placeholder-gray-500 text-sm"
                  onFocus={() => setShowContactPicker(true)}
                  autoComplete="off"
                />
                <Button
                  type="button"
                  onClick={() => setShowContactPicker((v) => !v)}
                  className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-3 sm:px-4 flex-shrink-0"
                  tabIndex={-1}
                >
                  <Users className="w-4 h-4" />
                </Button>
                <Button
                  onClick={startQrScanner}
                  className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-3 sm:px-4 flex-shrink-0"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
              {showContactPicker && (
                <div className="absolute z-20 mt-2 w-full max-w-xs bg-[#222426] border border-[#2D2D2D] rounded shadow-lg">
                  <Input
                    placeholder="Search contacts..."
                    value={contactSearch}
                    onChange={e => setContactSearch(e.target.value)}
                    className="bg-[#1a1c1d] border-[#2D2D2D] text-white text-xs mb-2"
                  />
                  <div className="max-h-40 overflow-y-auto">
                    {contactList.filter(c =>
                      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
                      c.address.toLowerCase().includes(contactSearch.toLowerCase())
                    ).map(contact => (
                      <div
                        key={contact.id}
                        className="px-3 py-2 cursor-pointer hover:bg-[#2D2D2D] text-xs text-white"
                        onClick={() => {
                          setRecipient(contact.address)
                          setShowContactPicker(false)
                        }}
                      >
                        <div className="font-semibold">{contact.name}</div>
                        <div className="text-gray-400 break-all">{contact.address}</div>
                      </div>
                    ))}
                    {contactList.filter(c =>
                      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
                      c.address.toLowerCase().includes(contactSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="px-3 py-2 text-gray-400 text-xs">No contacts found.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                AMOUNT ({selectedAsset.symbol})
              </Label>
              <Input
                id="amount"
                type="number"
                step={1 / Math.pow(10, selectedAsset.decimals)}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`0.${"0".repeat(selectedAsset.decimals)}`}
                className="bg-[#1a1c1d] border-[#2D2D2D] text-white placeholder-gray-500 text-sm"
              />
              <div className="text-xs text-gray-400 mt-1">
                Available: <span style={{ color: assetColors[selectedAsset.symbol] }}>
                  {walletBalances[selectedAsset.symbol as keyof typeof walletBalances] !== undefined
                    ? walletBalances[selectedAsset.symbol as keyof typeof walletBalances].toFixed(selectedAsset.decimals)
                    : (0).toFixed(selectedAsset.decimals)}
                </span> {selectedAsset.symbol}
              </div>
            </div>

            {/* Memo */}
            <div>
              <Label htmlFor="memo" className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                MEMO (OPTIONAL)
              </Label>
              <Input
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Add a note for this transaction"
                className="bg-[#1a1c1d] border-[#2D2D2D] text-white placeholder-gray-500 text-sm"
              />
            </div>

            {/* Transaction Preview */}
            <div className="bg-[#1a1c1d] rounded border border-[#2D2D2D] p-3 sm:p-4">
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">TRANSACTION PREVIEW</span>
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span style={{ color: assetColors[selectedAsset.symbol], fontWeight: 600 }}>
                    {amount || `0.${"0".repeat(selectedAsset.decimals)}`} {selectedAsset.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee:</span>
                  <span style={{ color: assetColors[selectedAsset.symbol], fontWeight: 600 }}>
                    {networkFees[selectedAsset.symbol as keyof typeof networkFees] !== undefined
                      ? networkFees[selectedAsset.symbol as keyof typeof networkFees].toFixed(selectedAsset.decimals)
                      : (0).toFixed(selectedAsset.decimals)} {selectedAsset.symbol}
                  </span>
                </div>
                <div className="border-t border-[#2D2D2D] pt-2 flex justify-between font-medium">
                  <span className="text-gray-300">Total:</span>
                  <span style={{ color: assetColors[selectedAsset.symbol], fontWeight: 600 }}>
                    {networkFees[selectedAsset.symbol as keyof typeof networkFees] !== undefined
                      ? (Number.parseFloat(amount || "0") + networkFees[selectedAsset.symbol as keyof typeof networkFees]).toFixed(selectedAsset.decimals)
                      : (Number.parseFloat(amount || "0")).toFixed(selectedAsset.decimals)} {selectedAsset.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!recipient || !amount}
              className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white py-2 sm:py-3 font-medium tracking-wide text-sm sm:text-base"
            >
              <Send className="w-4 h-4 mr-2" />
              SEND {selectedAsset.symbol}
            </Button>
          </div>
        </div>

        {/* QR Scanner */}
        {showQrScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-6 w-full max-w-md relative flex flex-col items-center">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={stopQrScanner}
              >×</button>
              <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 tracking-wide text-white">QR CODE SCANNER</h2>
              {scanError && <div className="text-red-400 text-xs mb-2">{scanError}</div>}
              <video ref={videoRef} className="w-full h-64 bg-black rounded mb-2" />
              <div className="text-xs text-gray-400">Point your camera at a QR code to scan the receiver address.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
