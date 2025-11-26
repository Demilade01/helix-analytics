"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

import type { AppUser } from "@/lib/types/user"

export type Sector =
  | "Healthcare"
  | "Banking & Capital Markets"
  | "Retail & Ecommerce"
  | "Energy"
  | "Life Sciences"
  | "Public Sector"

export interface User extends AppUser {
  sector: Sector | string | null
  organization: string | null
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        setUserState(null)
        return
      }

      const data = (await response.json()) as AppUser
      setUserState({
        ...data,
        sector: data.sector ?? null,
        organization: data.organization ?? null,
      })
    } catch (error) {
      console.error("Error loading authenticated user:", error)
      setUserState(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setUserState(null)
    }
  }

  return <UserContext.Provider value={{ user, isLoading, setUser, refreshUser, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

