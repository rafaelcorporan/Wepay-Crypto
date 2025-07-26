"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function Messages() {
  const [messages, setMessages] = useState([
    { sender: "You", content: "Welcome to Messages! Start chatting." },
    { sender: "Support", content: "Hi! How can we help you today?" },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (input.trim() === "") return
    setMessages((prev) => [...prev, { sender: "You", content: input }])
    setInput("")
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)] sm:max-h-[70vh] space-y-3 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wider">MESSAGES</h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-[#222426] rounded-lg border border-[#2D2D2D] p-3 sm:p-6 space-y-3 sm:space-y-4 min-h-0">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] sm:max-w-xs px-3 sm:px-4 py-2 rounded-lg ${msg.sender === "You" ? "bg-[#FF6600] text-white" : "bg-[#1a1c1d] text-gray-200 border border-[#2D2D2D]"}`}>
              <div className="text-xs font-semibold mb-1">{msg.sender}</div>
              <div className="text-xs sm:text-sm whitespace-pre-line break-words">{msg.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        className="flex gap-2 items-end"
        onSubmit={e => {
          e.preventDefault()
          handleSend()
        }}
      >
        <Textarea
          className="flex-1 bg-[#1a1c1d] border-[#2D2D2D] text-white resize-none text-sm"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          rows={2}
        />
        <Button
          type="submit"
          className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-3 sm:px-6 py-2 font-medium tracking-wide text-sm flex-shrink-0"
          disabled={input.trim() === ""}
        >
          Send
        </Button>
      </form>
    </div>
  )
}
