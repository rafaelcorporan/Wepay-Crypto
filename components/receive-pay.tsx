"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeft, Copy, Download, Users, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ALLOWED_ASSETS, Asset } from "@/lib/assets"
import { ALL_ASSETS } from "@/lib/assets"
import QRCode from 'react-qr-code'

interface ReceivePayProps {
  onBack: () => void
}

export function ReceivePay({ onBack }: ReceivePayProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ALLOWED_ASSETS[0]) // Default to XRP
  const [amount, setAmount] = useState("")
  const [memo, setMemo] = useState("")
  const [requestFrom, setRequestFrom] = useState("")
  const [showContactPicker, setShowContactPicker] = useState(false)
  const [contactSearch, setContactSearch] = useState("")
  
  // Send Pay Request states
  const [sendRequestRecipient, setSendRequestRecipient] = useState("")
  const [sendRequestAmount, setSendRequestAmount] = useState("")
  const [sendRequestMemo, setSendRequestMemo] = useState("")
  const [sendRequestContactPicker, setSendRequestContactPicker] = useState(false)
  const [sendRequestContactSearch, setSendRequestContactSearch] = useState("")
  
  const walletAddresses = {
    XRP: "rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    XLM: "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    RLUSD: "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    XDC: "xdcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    SGB: "sgbXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    SOLO: "soloXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    HBAR: "hbarXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    FLR: "flrXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    CSPR: "csprXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    ALGO: "algoXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    QNT: "qntXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    IOTA: "iotaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses])
    alert("Address copied to clipboard!")
  }

  const downloadQR = () => {
    alert("QR code downloaded!")
  }

  const handleSendRequest = () => {
    if (!sendRequestRecipient || !sendRequestAmount) {
      alert("Please fill in recipient and amount fields")
      return
    }

    const contact = contactList.find(c => c.address === sendRequestRecipient)
    const recipientName = contact?.name || sendRequestRecipient

    alert(`Payment request sent to ${recipientName}!\nAmount: ${sendRequestAmount} ${selectedAsset.symbol}\nMemo: ${sendRequestMemo || 'No memo'}`)
    
    // Clear send request form
    setSendRequestRecipient("")
    setSendRequestAmount("")
    setSendRequestMemo("")
    setSendRequestContactPicker(false)
  }

  // Asset color mapping for tab and amount
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
  // Contact list for picker
  const contactList = [
    { id: '1', name: 'Alice', address: 'rAliceXRPAddress123456' },
    { id: '2', name: 'Bob', address: 'GBOBXLMAddress654321' },
    { id: '3', name: 'Carol', address: '0xCarolRLUSDAddress789012' },
  ];

  const assetScrollRef = useRef<HTMLDivElement>(null)

  const checkScroll = useCallback(() => {
    const el = assetScrollRef.current
    if (!el) return
    // Scroll checking logic removed as variables are not used
  }, [])

  useEffect(() => {
    checkScroll()
    const el = assetScrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])
  
  useEffect(() => { 
    setTimeout(checkScroll, 100) 
  }, [checkScroll])

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* QR Code - now on the left */}
        <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-4 sm:p-6 order-1 lg:order-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
            <h2 className="text-base sm:text-lg font-semibold tracking-wide">QR CODE</h2>
            <Button
              onClick={downloadQR}
              variant="outline"
              size="sm"
              className="bg-transparent border-[#2D2D2D] text-gray-300 hover:bg-[#2D2D2D] w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="aspect-square bg-white rounded p-4 sm:p-8 mb-3 sm:mb-4">
            <div className="w-full h-full flex items-center justify-center relative">
              <QRCode
                value={walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses] || 'No address'}
                size={160}
                bgColor="#fff"
                fgColor="#000"
                style={{ borderRadius: '0.5rem', width: '100%', height: '100%', maxWidth: 192, minWidth: 120 }}
              />
              {/* Always use a colored circular background for the logo to ensure visibility, perfectly centered */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{ width: 64, height: 64, background: assetColors[selectedAsset.symbol] || '#888', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span
                  style={{
                    fontWeight: 'bold',
                    color: '#fff',
                    fontSize: 13,
                    textAlign: 'center',
                    width: '90%',
                    textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                    pointerEvents: 'none',
                    lineHeight: 1.1,
                    display: 'block',
                  }}
                >
                  {selectedAsset.name}
                </span>
              </div>
            </div>
          </div>
          <div className="text-center text-xs sm:text-sm text-gray-400">
            Scan QR code to receive <span style={{ fontWeight: 'bold', color: assetColors[selectedAsset.symbol] }}>{selectedAsset.name}</span> to this wallet
          </div>
        </div>
        {/* Payment Request - now on the right */}
        <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-4 sm:p-6 order-2 lg:order-2">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold tracking-wide text-center mb-2">REQUEST PAY</h2>
            <div className="w-full">
              <div ref={assetScrollRef} className="overflow-x-auto flex gap-2 pb-1 hide-scrollbar w-full sm:w-auto px-6">
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
          {/* Request From (Contact Picker) */}
          <div className="mb-4">
            <Label htmlFor="requestFrom" className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
              Request From
            </Label>
            <div className="flex gap-2 relative">
              <Input
                id="requestFrom"
                value={requestFrom}
                onChange={e => setRequestFrom(e.target.value)}
                placeholder="Pick a contact or enter address"
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
              {showContactPicker && (
                <div className="absolute z-20 mt-10 w-full max-w-xs bg-[#222426] border border-[#2D2D2D] rounded shadow-lg">
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
                          setRequestFrom(contact.address)
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
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                Amount ({selectedAsset.name})
              </Label>
              <Input
                id="amount"
                type="number"
                step={1 / Math.pow(10, selectedAsset.decimals)}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`0.${"0".repeat(selectedAsset.decimals)}`}
                className="bg-[#1a1c1d] border-[#2D2D2D] text-white placeholder-gray-500 text-sm"
                style={{ color: assetColors[selectedAsset.symbol] }}
              />
              <div className="text-xs text-gray-400 mt-1">Leave empty for flexible amount</div>
            </div>

            {/* Memo */}
            <div>
              <Label htmlFor="memo" className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                MEMO (Optional)
              </Label>
              <Input
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Add a note for this payment request"
                className="bg-[#1a1c1d] border-[#2D2D2D] text-white placeholder-gray-500 text-sm"
              />
            </div>

            {/* Wallet Address */}
            <div>
              <Label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">Wallet Address</Label>
              <div className="flex gap-2">
                <Input
                  value={walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses] || "No address set"}
                  readOnly
                  className="bg-[#1a1c1d] border-[#2D2D2D] text-white text-sm"
                />
                <Button
                  onClick={copyAddress}
                  className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-3 sm:px-4 flex-shrink-0"
                  disabled={!walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses]}
                  title={walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses] ? "Copy address" : "No address to copy"}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-[#1a1c1d] rounded border border-[#2D2D2D] p-3 sm:p-4">
              <div className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Payment Details</div>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white font-mono text-xs truncate max-w-[120px] sm:max-w-[200px]">
                    {walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses]
                      ? `${walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses].slice(0, 20)}...`
                      : "No address set"}
                  </span>
                </div>
                {amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span style={{ color: assetColors[selectedAsset.symbol], fontWeight: 600 }}>{amount} {selectedAsset.symbol}</span>
                  </div>
                )}
                {memo && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Memo:</span>
                    <span className="text-white truncate max-w-[120px] sm:max-w-[200px]">{memo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* SEND PAY REQUEST Section */}
            <div className="bg-[#1a1c1d] rounded border border-[#2D2D2D] p-4 sm:p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-[#FF6600]" />
                <h3 className="text-base sm:text-lg font-semibold tracking-wide text-[#FF6600]">SEND PAY REQUEST</h3>
              </div>

              <div className="space-y-4">
                {/* Send Request To */}
                <div className="relative">
                  <Label htmlFor="sendRequestRecipient" className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                    Send Request To
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="sendRequestRecipient"
                      value={sendRequestRecipient}
                      onChange={(e) => setSendRequestRecipient(e.target.value)}
                      placeholder="Pick a contact or enter address"
                      className="bg-[#222426] border-[#2D2D2D] text-white placeholder-gray-500 text-sm"
                      onFocus={() => setSendRequestContactPicker(true)}
                      autoComplete="off"
                    />
                    <Button
                      type="button"
                      onClick={() => setSendRequestContactPicker((v) => !v)}
                      className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-3 sm:px-4 flex-shrink-0"
                      tabIndex={-1}
                    >
                      <Users className="w-4 h-4" />
                    </Button>
                  </div>
                  {sendRequestContactPicker && (
                    <div className="absolute z-20 mt-2 w-full max-w-xs bg-[#222426] border border-[#2D2D2D] rounded shadow-lg">
                      <Input
                        placeholder="Search contacts..."
                        value={sendRequestContactSearch}
                        onChange={e => setSendRequestContactSearch(e.target.value)}
                        className="bg-[#1a1c1d] border-[#2D2D2D] text-white text-xs mb-2"
                      />
                      <div className="max-h-40 overflow-y-auto">
                        {contactList.filter(c =>
                          c.name.toLowerCase().includes(sendRequestContactSearch.toLowerCase()) ||
                          c.address.toLowerCase().includes(sendRequestContactSearch.toLowerCase())
                        ).map(contact => (
                          <div
                            key={contact.id}
                            className="px-3 py-2 cursor-pointer hover:bg-[#2D2D2D] text-xs text-white"
                            onClick={() => {
                              setSendRequestRecipient(contact.address)
                              setSendRequestContactPicker(false)
                            }}
                          >
                            <div className="font-semibold">{contact.name}</div>
                            <div className="text-gray-400 break-all">{contact.address}</div>
                          </div>
                        ))}
                        {contactList.filter(c =>
                          c.name.toLowerCase().includes(sendRequestContactSearch.toLowerCase()) ||
                          c.address.toLowerCase().includes(sendRequestContactSearch.toLowerCase())
                        ).length === 0 && (
                          <div className="px-3 py-2 text-gray-400 text-xs">No contacts found.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Request Amount */}
                <div>
                  <Label htmlFor="sendRequestAmount" className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                    Request Amount ({selectedAsset.symbol})
                  </Label>
                  <Input
                    id="sendRequestAmount"
                    type="number"
                    step={1 / Math.pow(10, selectedAsset.decimals)}
                    value={sendRequestAmount}
                    onChange={(e) => setSendRequestAmount(e.target.value)}
                    placeholder={`0.${"0".repeat(selectedAsset.decimals)}`}
                    className="bg-[#222426] border-[#2D2D2D] text-white placeholder-gray-500 text-sm"
                    style={{ color: assetColors[selectedAsset.symbol] }}
                  />
                </div>

                {/* Request Memo */}
                <div>
                  <Label htmlFor="sendRequestMemo" className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">
                    Request Memo (Optional)
                  </Label>
                  <Input
                    id="sendRequestMemo"
                    value={sendRequestMemo}
                    onChange={(e) => setSendRequestMemo(e.target.value)}
                    placeholder="Add a note for this payment request"
                    className="bg-[#222426] border-[#2D2D2D] text-white placeholder-gray-500 text-sm"
                  />
                </div>

                {/* Request Preview */}
                <div className="bg-[#222426] rounded border border-[#2D2D2D] p-3">
                  <div className="text-xs font-medium text-gray-300 mb-2">Request Preview</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Asset:</span>
                      <span style={{ color: assetColors[selectedAsset.symbol], fontWeight: 600 }}>
                        {selectedAsset.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span style={{ color: assetColors[selectedAsset.symbol], fontWeight: 600 }}>
                        {sendRequestAmount || `0.${"0".repeat(selectedAsset.decimals)}`} {selectedAsset.symbol}
                      </span>
                    </div>
                    {sendRequestMemo && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Memo:</span>
                        <span className="text-white truncate max-w-[150px]">{sendRequestMemo}</span>
                      </div>
                    )}
                    {sendRequestRecipient && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">To:</span>
                        <span className="text-white truncate max-w-[150px]">
                          {contactList.find(c => c.address === sendRequestRecipient)?.name || 
                           `${sendRequestRecipient.slice(0, 6)}...${sendRequestRecipient.slice(-4)}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Send Request Button */}
                <Button
                  onClick={handleSendRequest}
                  disabled={!sendRequestRecipient || !sendRequestAmount}
                  className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white py-2 font-medium tracking-wide text-sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  SEND PAY REQUEST
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
