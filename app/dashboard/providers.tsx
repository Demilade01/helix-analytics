"use client"

import { UserProvider } from "@/lib/contexts/user-context"

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>
}

