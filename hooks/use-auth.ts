"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem("wepay-auth")
    setIsAuthenticated(authStatus === "true")
    setIsLoading(false)
  }, [])

  const login = () => {
    localStorage.setItem("wepay-auth", "true")
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("wepay-auth")
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  }
}