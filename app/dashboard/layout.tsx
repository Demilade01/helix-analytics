"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, LineChart, FileText, Settings, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/hooks/use-user"
import { DashboardProviders } from "./providers"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/analytics", label: "Analytics", icon: LineChart },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, logout } = useUser()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.push("/login")
    return null
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010203] text-white">
        <div className="text-center">
          <div className="inline-block size-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
          <p className="mt-4 text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#010203] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-0 top-0 bg-[radial-gradient(circle_at_top,rgba(100,116,139,0.35),transparent)]"
          style={{ height: "32rem" }}
        />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle,rgba(34,211,238,0.2),transparent_60%)] blur-3xl" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(circle,rgba(59,130,246,0.15),transparent_65%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05),transparent)]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl lg:block">
          <div className="sticky top-0 flex h-screen flex-col p-6">
            <Link href="/" className="mb-8 text-xl font-semibold tracking-tight text-white">
              Helix Analytics
            </Link>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="size-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-white/10 pt-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-white">{user?.email}</p>
                <p className="text-xs text-slate-400">{user?.organization}</p>
                <p className="mt-1 text-xs text-[#64748B]">{user?.sector}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full rounded-lg border-white/30 bg-transparent text-sm text-white transition hover:border-white/50 hover:bg-white/5 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {/* Mobile Header */}
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[#010203]/80 px-4 py-4 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-center">
              <Link href="/" className="text-lg font-semibold text-white">
                Helix Analytics
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#010203]/95 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                >
                  <item.icon className={`size-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-slate-400 transition hover:text-white"
            >
              <LogOut className="size-5" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProviders>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProviders>
  )
}

