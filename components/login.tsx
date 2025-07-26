"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Zap } from "lucide-react"

interface LoginProps {
  onLogin: () => void
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Generate stable random values once
  const [animationDurations] = useState(() => 
    Array.from({ length: 24 }, () => 8 + Math.random() * 4)
  )

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple authentication check
    if (username === "admin" && password === "Aa1234567$$$") {
      onLogin()
    } else {
      setError("ACCESS DENIED - Invalid credentials")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#181A1B] relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Perspective Lines converging to center */}
        <div className="absolute inset-0 overflow-hidden">
          {/* First set - angling downward to center */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`down-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#FF6600] to-transparent opacity-20"
              style={{
                top: `${20 + i * 5}%`,
                left: '50%',
                width: `${40 + i * 10}%`,
                transform: `translateX(-50%) rotate(${(i - 6) * 2}deg)`,
                transformOrigin: 'center center',
                animationName: 'perspectiveMove',
                animationDuration: `${animationDurations[i]}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDirection: 'alternate',
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
          
          {/* Second set - angling upward to center (opposite direction) */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`up-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#FF6600] to-transparent opacity-15"
              style={{
                top: `${20 + i * 5}%`,
                left: '50%',
                width: `${40 + i * 10}%`,
                transform: `translateX(-50%) rotate(${-(i - 6) * 2}deg)`,
                transformOrigin: 'center center',
                animationName: 'perspectiveMove',
                animationDuration: `${animationDurations[i + 12]}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDirection: 'alternate-reverse',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
        
        {/* Floating Crypto Symbols */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-[#FF6600] opacity-20 font-mono text-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              {['₿', 'Ξ', '◊', '⟨XRP⟩', '✦', '◈'][i]}
            </div>
          ))}
        </div>

        {/* Scanning Lines */}
        <div className="absolute inset-0">
          <div className="h-px bg-gradient-to-r from-transparent via-[#FF6600] to-transparent opacity-50"
               style={{ animation: 'scanLine 3s linear infinite' }} />
        </div>

        {/* Pulse Circles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-[#FF6600] rounded-full opacity-20"
             style={{ animation: 'pulse 4s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-[#FF6600] rounded-full opacity-10"
             style={{ animation: 'pulse 6s ease-in-out infinite reverse' }} />
      </div>

      {/* Main Login Card */}
      <Card className="w-full max-w-sm bg-[#222426]/95 border border-[#2D2D2D] backdrop-blur-sm relative z-10 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-6">
          {/* Title */}
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-[#FF6600] tracking-wider font-mono">
              WEPAY CRYPTO
            </CardTitle>
          </div>
          
          {/* Description */}
          <CardDescription className="text-gray-300 text-sm leading-relaxed">
            Secure cryptocurrency wallet with advanced encryption protocols
          </CardDescription>

          {/* Current Time */}
          <div className="text-xs text-gray-500 font-mono">
            {currentTime.toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })} UTC
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300 font-mono text-sm tracking-wide">
                USERNAME
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#1a1c1d] border-[#2D2D2D] text-white font-mono focus:border-[#FF6600] focus:ring-[#FF6600] transition-colors"
                placeholder="Enter tactical access code"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-mono text-sm tracking-wide">
                PASSWORD
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1a1c1d] border-[#2D2D2D] text-white font-mono focus:border-[#FF6600] focus:ring-[#FF6600] transition-colors"
                placeholder="Enter secure passphrase"
                required
              />
            </div>

            {error && (
              <Alert className="bg-red-900/20 border-red-500/50">
                <AlertDescription className="text-red-300 font-mono text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-1/2 bg-[#FF6600] hover:bg-[#E55A00] text-white font-semibold font-mono tracking-wider transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING...
                </div>
              ) : (
                "Sign In"
              )}
              </Button>
            </div>
          </form>

        </CardContent>
      </Card>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes perspectiveMove {
          0% { opacity: 0.1; transform: translateX(-50%) scale(0.8); }
          100% { opacity: 0.3; transform: translateX(-50%) scale(1.1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}