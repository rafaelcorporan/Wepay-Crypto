"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Plus, Share2 } from "lucide-react"
import { useRef } from "react"

interface Contact {
  id: string
  name: string
  address: string
}

const initialContacts: Contact[] = [
  { id: "1", name: "Alice", address: "rAliceXRPAddress123456" },
  { id: "2", name: "Bob", address: "GBOBXLMAddress654321" },
  { id: "3", name: "Carol", address: "0xCarolRLUSDAddress789012" },
]

export function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [search, setSearch] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newName, setNewName] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [shareLink, setShareLink] = useState("")
  const nameInputRef = useRef<HTMLInputElement>(null)

  const filteredContacts = contacts.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-2">
        <Users className="w-6 h-6 text-[#FF6600]" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-wider">CONTACTS</h1>
        <button
          className="ml-auto bg-[#FF6600] hover:bg-[#e55a00] text-white rounded-full p-2 flex items-center justify-center"
          title="Add new contact"
          onClick={() => {
            setShowAddModal(true)
            setTimeout(() => nameInputRef.current?.focus(), 100)
          }}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#1a1c1d] border-[#2D2D2D] text-white text-sm"
        />
      </div>
      <div className="space-y-3">
        {filteredContacts.length === 0 && (
          <div className="text-gray-400 text-sm">No contacts found.</div>
        )}
        {filteredContacts.map(contact => (
          <div key={contact.id} className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="font-semibold text-[#FF6600] text-base">{contact.name}</div>
              <div className="text-xs sm:text-sm text-gray-300 break-all">{contact.address}</div>
            </div>
            <Button
              size="sm"
              className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-4 py-2 text-xs sm:text-sm"
              onClick={() => {
                navigator.clipboard.writeText(contact.address)
              }}
            >
              Copy Address
            </Button>
          </div>
        ))}
      </div>
      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#222426] rounded-lg border border-[#2D2D2D] p-6 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => { setShowAddModal(false); setShareLink("") }}
            >
              ×
            </button>
            <h2 className="text-lg font-bold text-white mb-4">Add New Contact</h2>
            <div className="space-y-3">
              <input
                ref={nameInputRef}
                type="text"
                placeholder="Contact Name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full p-2 rounded bg-[#1a1c1d] border border-[#2D2D2D] text-white"
              />
              <input
                type="text"
                placeholder="Contact Address"
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
                className="w-full p-2 rounded bg-[#1a1c1d] border border-[#2D2D2D] text-white"
              />
              <button
                className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white py-2 rounded font-medium mt-2"
                disabled={!newName || !newAddress}
                onClick={() => {
                  setContacts(prev => [...prev, { id: Date.now().toString(), name: newName, address: newAddress }])
                  const link = `${window.location.origin}/invite?name=${encodeURIComponent(newName)}&address=${encodeURIComponent(newAddress)}`
                  setShareLink(link)
                  setNewName("")
                  setNewAddress("")
                }}
              >Add Contact</button>
              <button
                className="w-full bg-[#2D2D2D] text-gray-400 py-2 rounded font-medium mt-1 cursor-not-allowed"
                disabled
              >Add from phone contacts (coming soon)</button>
              {shareLink && (
                <div className="mt-4 p-3 bg-[#1a1c1d] rounded border border-[#2D2D2D]">
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-300">
                    <Share2 className="w-4 h-4" />
                    Share this link with your new contact:
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 p-1 rounded bg-[#23272A] border border-[#2D2D2D] text-xs text-white"
                    />
                    <button
                      className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-2 py-1 rounded text-xs"
                      onClick={() => { navigator.clipboard.writeText(shareLink) }}
                    >Copy</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 