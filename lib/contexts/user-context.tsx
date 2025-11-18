"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Sector = "Healthcare" | "Banking & Capital Markets" | "Retail & Ecommerce" | "Energy" | "Life Sciences" | "Public Sector"

export interface User {
  email: string
  sector: Sector
  organization: string
  isAuthenticated: boolean
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const authData = localStorage.getItem("helix_auth")
        if (authData) {
          const parsed = JSON.parse(authData)
          setUserState(parsed)
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Sync user state with localStorage
  const setUser = (newUser: User | null) => {
    setUserState(newUser)
    if (newUser) {
      localStorage.setItem("helix_auth", JSON.stringify(newUser))
    } else {
      localStorage.removeItem("helix_auth")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("helix_auth")
  }

  return <UserContext.Provider value={{ user, isLoading, setUser, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

