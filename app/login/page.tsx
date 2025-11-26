"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"

import { fadeInUp, subtleScale } from "@/components/sections/motion-presets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error ?? "Unable to sign in. Please try again.")
        return
      }

      router.push("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError("Unable to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
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

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={subtleScale}
        >
          <motion.div
            className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:rounded-3xl sm:p-10"
            variants={fadeInUp}
          >
            <div className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-white/10 via-transparent to-[#64748B]/20 opacity-60 sm:rounded-3xl" />

            <div className="mb-8 text-center">
              <Link
                href="/"
                className="inline-block text-2xl font-semibold tracking-tight text-white transition hover:text-slate-300"
              >
                Helix Analytics
              </Link>
              <h1 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">Welcome back</h1>
              <p className="mt-2 text-sm text-slate-400">
                Sign in to your account to continue
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@helix.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#64748B] transition hover:text-white"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
                <p className="text-xs text-slate-500">
                  Demo: Use the email and password from your signup
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="size-4 rounded border-white/20 bg-white/5 text-white focus:ring-2 focus:ring-white/20 focus:ring-offset-0"
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="text-sm text-slate-400">
                  Remember me for 30 days
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-white px-6 py-6 text-base font-semibold text-[#010203] transition hover:bg-white/90 disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-white transition hover:text-slate-300"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-center text-xs text-slate-500">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-[#64748B] hover:text-white">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#64748B] hover:text-white">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

