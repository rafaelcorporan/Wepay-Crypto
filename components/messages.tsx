"use client"
import { useState } from "react"
import { Users, DollarSign, Check, X, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const contacts = [
  { id: "1", name: "Alice", address: "rAliceXRPAddress123456" },
  { id: "2", name: "Bob", address: "GBOBXLMAddress654321" },
  { id: "3", name: "Carol", address: "0xCarolRLUSDAddress789012" },
]

interface PaymentRequestMessage {
  id: string
  from: string
  amount: string
  asset: string
  memo?: string
  status: 'pending' | 'approved' | 'denied'
}

interface Message {
  from: string
  text?: string
  time: string
  paymentRequest?: PaymentRequestMessage
}

const messagesData: Record<string, Message[]> = {
  "1": [
    { from: "me", text: "Hi Alice!", time: "09:00" },
    { from: "Alice", text: "Hey! How are you?", time: "09:01" },
    { from: "me", text: "All good. Ready for the payment?", time: "09:02" },
    { from: "Alice", text: "Yes, send it!", time: "09:03" },
    { 
      from: "Alice", 
      time: "09:05",
      paymentRequest: {
        id: "req_001",
        from: "Alice",
        amount: "100",
        asset: "XRP",
        memo: "Payment for services rendered",
        status: "pending"
      }
    },
  ],
  "2": [
    { from: "me", text: "Hi Bob!", time: "10:00" },
    { from: "Bob", text: "Hello!", time: "10:01" },
    { 
      from: "me", 
      time: "10:15",
      paymentRequest: {
        id: "req_002",
        from: "me",
        amount: "50",
        asset: "XLM",
        memo: "Lunch split",
        status: "approved"
      }
    },
  ],
  "3": [
    { from: "me", text: "Hi Carol!", time: "11:00" },
    { from: "Carol", text: "Hi!", time: "11:01" },
  ],
}

export function Messages() {
  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const [search, setSearch] = useState("")
  const [newMsg, setNewMsg] = useState("")
  const [showContactsMobile, setShowContactsMobile] = useState(true)
  const filteredContacts = contacts.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase())
  )
  const conversation = messagesData[selectedContact.id] || []

  // Asset color mapping
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

  const handlePaymentAction = (requestId: string, action: 'approve' | 'deny') => {
    // Find and update the payment request status
    Object.keys(messagesData).forEach(contactId => {
      messagesData[contactId] = messagesData[contactId].map(msg => {
        if (msg.paymentRequest?.id === requestId) {
          return {
            ...msg,
            paymentRequest: {
              ...msg.paymentRequest,
              status: action === 'approve' ? 'approved' : 'denied'
            }
          }
        }
        return msg
      })
    })

    // Add a follow-up message
    const actionMsg = action === 'approve' 
      ? "Payment approved! Transaction processing..." 
      : "Payment request declined."
    
    messagesData[selectedContact.id] = [
      ...messagesData[selectedContact.id],
      { 
        from: "me", 
        text: actionMsg, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]

    // Force re-render by updating state
    setSelectedContact({ ...selectedContact })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3 text-yellow-500" />
      case 'approved':
        return <Check className="w-3 h-3 text-green-500" />
      case 'denied':
        return <X className="w-3 h-3 text-red-500" />
      default:
        return <Clock className="w-3 h-3 text-yellow-500" />
    }
  }

  const renderPaymentRequest = (msg: Message) => {
    if (!msg.paymentRequest) return null

    const request = msg.paymentRequest
    const isIncoming = msg.from !== "me"
    const canInteract = isIncoming && request.status === 'pending'

    return (
      <div className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
        <div className={`rounded-lg p-3 max-w-xs border-2 ${
          msg.from === "me" 
            ? "bg-[#2a2a2a] border-[#FF6600] text-white" 
            : "bg-[#1a1c1d] border-[#2D2D2D] text-white"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-[#FF6600]" />
            <span className="text-xs font-semibold text-[#FF6600]">PAYMENT REQUEST</span>
            {getStatusIcon(request.status)}
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Amount:</span>
              <span 
                className="font-semibold"
                style={{ color: assetColors[request.asset] || '#FF6600' }}
              >
                {request.amount} {request.asset}
              </span>
            </div>
            
            {request.memo && (
              <div className="flex justify-between">
                <span className="text-gray-400">Memo:</span>
                <span className="text-white text-right max-w-[120px] break-words">
                  {request.memo}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`text-xs font-medium ${
                request.status === 'pending' ? 'text-yellow-500' :
                request.status === 'approved' ? 'text-green-500' :
                'text-red-500'
              }`}>
                {request.status.toUpperCase()}
              </span>
            </div>
          </div>

          {canInteract && (
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => handlePaymentAction(request.id, 'approve')}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
              >
                <Check className="w-3 h-3 mr-1" />
                Approve
              </Button>
              <Button
                onClick={() => handlePaymentAction(request.id, 'deny')}
                size="sm"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs px-3 py-1"
              >
                <X className="w-3 h-3 mr-1" />
                Deny
              </Button>
            </div>
          )}

          <div className="text-[10px] text-gray-400 text-right mt-2">{msg.time}</div>
        </div>
      </div>
    )
  }

  // Helper: is mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024

  // When a contact is selected on mobile, hide contacts list
  const handleSelectContact = (contact: typeof contacts[0]) => {
    setSelectedContact(contact)
    if (window.innerWidth < 1024) setShowContactsMobile(false)
  }

  // Back to contacts on mobile
  const handleBackToContacts = () => setShowContactsMobile(true)

  return (
    <div className="flex h-[32rem] bg-[#18191A] rounded-2xl border border-[#23272A] shadow-lg overflow-hidden">
      {/* Contacts List */}
      <div
        className={`w-64 bg-[#222426] border-r border-[#2D2D2D] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          showContactsMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed inset-y-0 left-0 z-20 lg:static lg:z-auto lg:relative lg:flex`}
        style={{ maxWidth: "16rem", minWidth: "16rem" }}
      >
        <div className="flex items-center gap-2 p-4 border-b border-[#2D2D2D]">
          <Users className="w-5 h-5 text-[#FF6600]" />
          <span className="font-bold text-white text-lg">Messages</span>
        </div>
        <div className="p-2">
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#1a1c1d] border-[#2D2D2D] text-white text-xs"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`px-4 py-3 cursor-pointer flex items-center gap-2 border-b border-[#23272A] transition-colors ${selectedContact.id === contact.id ? "bg-[#18191A] text-[#FF6600]" : "text-white hover:bg-[#23272A]"}`}
              onClick={() => handleSelectContact(contact)}
            >
              <div className="font-semibold">{contact.name}</div>
              <div className="text-xs text-gray-400 truncate">{contact.address.slice(0, 8)}...</div>
            </div>
          ))}
        </div>
      </div>
      {/* Conversation */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-0" style={{ minWidth: 0 }}>
        {/* Mobile back button */}
        {(!showContactsMobile && isMobile) && (
          <div className="p-2 border-b border-[#23272A] bg-[#222426] flex items-center gap-2 lg:hidden">
            <button
              onClick={handleBackToContacts}
              className="p-2 rounded bg-[#1a1c1d] border border-[#2D2D2D] text-gray-300 hover:bg-[#2D2D2D]"
            >Back</button>
            <span className="font-bold text-white text-lg">{selectedContact.name}</span>
            <span className="text-xs text-gray-400">{selectedContact.address}</span>
          </div>
        )}
        {((!isMobile) || (isMobile && !showContactsMobile)) && (
          <>
            <div className="p-4 border-b border-[#23272A] flex items-center gap-2">
              <span className="font-bold text-white text-lg">{selectedContact.name}</span>
              <span className="text-xs text-gray-400">{selectedContact.address}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {conversation.map((msg, idx) => (
                <div key={idx}>
                  {msg.paymentRequest ? (
                    renderPaymentRequest(msg)
                  ) : (
                    <div className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`rounded-lg px-3 py-2 max-w-xs text-sm ${msg.from === "me" ? "bg-[#FF6600] text-white" : "bg-[#23272A] text-white"}`}>
                        <div>{msg.text}</div>
                        <div className="text-[10px] text-gray-300 text-right mt-1">{msg.time}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form
              className="p-4 border-t border-[#23272A] flex gap-2 bg-[#222426]"
              onSubmit={e => {
                e.preventDefault()
                if (!newMsg.trim()) return
                messagesData[selectedContact.id] = [
                  ...(messagesData[selectedContact.id] || []),
                  { from: "me", text: newMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                ]
                setNewMsg("")
              }}
            >
              <Input
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                placeholder="Type a message..."
                className="bg-[#1a1c1d] border-[#2D2D2D] text-white text-sm"
              />
              <Button type="submit" className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-4">Send</Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
} 