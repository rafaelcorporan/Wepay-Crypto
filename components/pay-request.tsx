"use client"

import { useState, useRef } from "react"
import { Copy, Users, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ALLOWED_ASSETS, Asset } from "@/lib/assets"
import { ALL_ASSETS } from "@/lib/assets"
import QRCode from 'react-qr-code'

const walletAddresses = {
  XRP: "rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  XLM: "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
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

const contactList = [
  { id: '1', name: 'Alice', address: 'rAliceXRPAddress123456' },
  { id: '2', name: 'Bob', address: 'GBOBXLMAddress654321' },
  { id: '3', name: 'Carol', address: '0xCarolRLUSDAddress789012' },
];

export function PayRequest() {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ALLOWED_ASSETS[0])
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [memo, setMemo] = useState("")
  const [showContactPicker, setShowContactPicker] = useState(false)
  const [contactSearch, setContactSearch] = useState("")

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses])
    alert("Address copied to clipboard!")
  }

  const downloadQR = () => {
    alert("QR code downloaded!")
  }

  const handleSendRequest = () => {
    if (!recipient || !amount) {
      alert("Please fill in recipient and amount fields")
      return
    }
    const contact = contactList.find(c => c.address === recipient)
    const recipientName = contact?.name || recipient
    alert(`Payment request sent to ${recipientName}!\nAmount: ${amount} ${selectedAsset.symbol}\nMemo: ${memo || 'No memo'}`)
    setRecipient("")
    setAmount("")
    setMemo("")
    setShowContactPicker(false)
  }

  return (
    <div className="bg-[#181A1B] rounded-lg border border-[#232425] p-6 w-full max-w-md mx-auto space-y-6 shadow-lg">
      {/* QR Code Section */}
      <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-4 mb-4">
        {/* Removed QR CODE heading and Download button */}
        <div className="aspect-square bg-white rounded p-4 mb-3">
          <div className="w-full h-full flex items-center justify-center relative">
            <QRCode
              value={walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses] || 'No address'}
              size={160}
              bgColor="#fff"
              fgColor="#000"
              style={{ borderRadius: '0.5rem', width: '100%', height: '100%', maxWidth: 192, minWidth: 120 }}
            />
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
      <h2 className="text-2xl font-bold text-center text-[#FF6600] flex items-center justify-center gap-2 mb-2">
        <Send className="w-6 h-6 text-[#FF6600]" />
        SEND PAY REQUEST
      </h2>
      {/* Asset Selector */}
      <div className="flex gap-2 justify-center mb-2 flex-wrap">
        {ALL_ASSETS.map((asset: Asset) => (
          <button
            key={asset.symbol}
            onClick={() => setSelectedAsset(asset)}
            className={`px-4 py-1 rounded-full text-xs font-semibold transition-colors border-2 min-w-[56px] flex-shrink-0
              ${selectedAsset.symbol === asset.symbol
                ? "bg-[#FF6600] text-white border-[#FF6600] shadow"
                : "bg-[#232425] text-gray-300 border-transparent hover:bg-[#2D2D2D]"}
            `}
            style={selectedAsset.symbol === asset.symbol ? { background: assetColors[asset.symbol], borderColor: assetColors[asset.symbol], color: '#fff' } : {}}
          >
            {asset.symbol}
          </button>
        ))}
      </div>
      {/* Send Request To */}
      <div>
        <Label htmlFor="recipient" className="text-xs font-medium text-gray-300 mb-2 block">
          Send Request To
        </Label>
        <div className="flex gap-2 relative">
          <Input
            id="recipient"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            placeholder="Pick a contact or enter address"
            className="bg-[#232425] border-[#2D2D2D] text-white placeholder-gray-500 text-sm"
            onFocus={() => setShowContactPicker(true)}
            autoComplete="off"
          />
          <Button
            type="button"
            onClick={() => setShowContactPicker((v) => !v)}
            className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-3 flex-shrink-0"
            tabIndex={-1}
          >
            <Users className="w-4 h-4" />
          </Button>
          {showContactPicker && (
            <div className="absolute z-20 mt-10 w-full max-w-xs bg-[#232425] border border-[#2D2D2D] rounded shadow-lg">
              <Input
                placeholder="Search contacts..."
                value={contactSearch}
                onChange={e => setContactSearch(e.target.value)}
                className="bg-[#181A1B] border-[#2D2D2D] text-white text-xs mb-2"
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
      </div>
      {/* Request Amount */}
      <div>
        <Label htmlFor="amount" className="text-xs font-medium text-gray-300 mb-2 block">
          Request Amount
        </Label>
        <Input
          id="amount"
          type="number"
          step={1 / Math.pow(10, selectedAsset.decimals)}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder={`0.${"0".repeat(selectedAsset.decimals)}`}
          className="bg-[#232425] border-[#2D2D2D] text-white placeholder-gray-500 text-sm"
        />
      </div>
      {/* Request Memo */}
      <div>
        <Label htmlFor="memo" className="text-xs font-medium text-gray-300 mb-2 block">
          Request Memo (Optional)
        </Label>
        <Input
          id="memo"
          value={memo}
          onChange={e => setMemo(e.target.value)}
          placeholder="Add a note for this payment request"
          className="bg-[#232425] border-[#2D2D2D] text-white placeholder-gray-500 text-sm"
        />
      </div>
      {/* Wallet Address */}
      <div>
        <Label className="text-xs font-medium text-gray-300 mb-2 block">Wallet Address</Label>
        <div className="flex gap-2">
          <Input
            value={walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses] || "No address set"}
            readOnly
            className="bg-[#232425] border-[#2D2D2D] text-white text-sm"
          />
          <Button
            onClick={copyAddress}
            className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-3 flex-shrink-0"
            disabled={!walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses]}
            title={walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses] ? "Copy address" : "No address to copy"}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* Payment Details */}
      <div className="bg-[#232425] rounded border border-[#2D2D2D] p-3">
        <div className="text-xs font-medium text-gray-300 mb-2">Payment Details</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Address:</span>
            <span className="text-white font-mono text-xs truncate max-w-[120px]">
              {walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses]
                ? `${walletAddresses[selectedAsset.symbol as keyof typeof walletAddresses].slice(0, 20)}...`
                : "No address set"}
            </span>
          </div>
        </div>
      </div>
      {/* Request Preview */}
      <div className="bg-[#232425] rounded border border-[#2D2D2D] p-3">
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
              {amount || `0.${"0".repeat(selectedAsset.decimals)}`} {selectedAsset.symbol}
            </span>
          </div>
          {memo && (
            <div className="flex justify-between">
              <span className="text-gray-400">Memo:</span>
              <span className="text-white truncate max-w-[150px]">{memo}</span>
            </div>
          )}
          {recipient && (
            <div className="flex justify-between">
              <span className="text-gray-400">To:</span>
              <span className="text-white truncate max-w-[150px]">
                {contactList.find(c => c.address === recipient)?.name || 
                 `${recipient.slice(0, 6)}...${recipient.slice(-4)}`}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Send Pay Request Button */}
      <Button
        onClick={handleSendRequest}
        disabled={!recipient || !amount}
        className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white py-2 font-medium tracking-wide text-sm mt-2"
      >
        <Send className="w-4 h-4 mr-2" />
        SEND PAY REQUEST
      </Button>
    </div>
  )
} 