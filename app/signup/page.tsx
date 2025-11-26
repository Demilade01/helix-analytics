"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

import { fadeInUp, subtleScale } from "@/components/sections/motion-presets"
import type { Sector } from "@/lib/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Demo organizations by sector
const organizationsBySector: Record<Sector, string[]> = {
  Healthcare: ["City General Hospital", "Metro Health Center", "Regional Medical Group"],
  "Banking & Capital Markets": ["First National Bank", "Global Capital Partners", "Metro Credit Union"],
  "Retail & Ecommerce": ["TechMart Retail", "Global Commerce Inc", "Urban Marketplace"],
  Energy: ["Green Energy Solutions", "National Power Corp", "Solar Dynamics"],
  "Life Sciences": ["BioPharm Innovations", "MedTech Research Labs", "Genomic Solutions"],
  "Public Sector": ["State Health Department", "Federal Finance Office", "City Planning Bureau"],
}

export default function SignUpPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [sector, setSector] = useState<Sector | "">("")
  const [organization, setOrganization] = useState("")
  const [isSectorOpen, setIsSectorOpen] = useState(false)
  const [isOrgOpen, setIsOrgOpen] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sectorRef = useRef<HTMLDivElement>(null)
  const orgRef = useRef<HTMLDivElement>(null)

  // Update organization options when sector changes
  const availableOrganizations = sector ? organizationsBySector[sector] || [] : []

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectorRef.current && !sectorRef.current.contains(event.target as Node)) {
        setIsSectorOpen(false)
      }
      if (orgRef.current && !orgRef.current.contains(event.target as Node)) {
        setIsOrgOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!sector) {
      setError("Please select a sector")
      return
    }

    if (!organization) {
      setError("Please select an organization")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          sector,
          organization,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error ?? "Unable to create account. Please try again.")
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
    } catch (err) {
      console.error("Signup error:", err)
      setError("Unable to create account. Please try again.")
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
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-[#64748B]/20 opacity-60 sm:rounded-3xl" />

            <div className="mb-8 text-center">
              <Link
                href="/"
                className="inline-block text-2xl font-semibold tracking-tight text-white transition hover:text-slate-300"
              >
                Helix Analytics
              </Link>
              <h1 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">Create account</h1>
              <p className="mt-2 text-sm text-slate-400">
                Get started with Helix Analytics today
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-slate-300">
                    First name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-slate-300">
                    Last name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">
                  Sector
                </label>
                <div className="relative" ref={sectorRef}>
                  <button
                    type="button"
                    onClick={() => setIsSectorOpen(!isSectorOpen)}
                    disabled={isLoading}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-xl"
                  >
                    <span className={sector ? "text-white" : "text-slate-400"}>
                      {sector || "Select sector"}
                    </span>
                    <ChevronDown
                      className={`size-4 text-slate-400 transition-transform ${isSectorOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isSectorOpen && (
                    <div className="absolute z-50 mt-2 w-full space-y-1 rounded-xl border border-white/20 bg-[#0f172a]/95 p-2 backdrop-blur-xl shadow-2xl shadow-black/60">
                      {(Object.keys(organizationsBySector) as Sector[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setSector(s)
                            setOrganization("") // Reset organization when sector changes
                            setIsSectorOpen(false)
                          }}
                          disabled={isLoading}
                          className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                            sector === s
                              ? "bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30"
                              : "bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">
                  Organization
                </label>
                <div className="relative" ref={orgRef}>
                  <button
                    type="button"
                    onClick={() => sector && setIsOrgOpen(!isOrgOpen)}
                    disabled={isLoading || !sector}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-xl"
                  >
                    <span className={organization ? "text-white" : "text-slate-400"}>
                      {organization || (sector ? "Select organization" : "Select a sector first")}
                    </span>
                    <ChevronDown
                      className={`size-4 text-slate-400 transition-transform ${isOrgOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOrgOpen && availableOrganizations.length > 0 && (
                    <div className="absolute z-50 mt-2 w-full space-y-1 rounded-xl border border-white/20 bg-[#0f172a]/95 p-2 backdrop-blur-xl shadow-2xl shadow-black/60">
                      {availableOrganizations.map((org) => (
                        <button
                          key={org}
                          type="button"
                          onClick={() => {
                            setOrganization(org)
                            setIsOrgOpen(false)
                          }}
                          disabled={isLoading}
                          className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                            organization === org
                              ? "bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30"
                              : "bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {org}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Password
                </label>
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
                  Must be at least 8 characters with uppercase, lowercase, and a number
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 size-4 rounded border-white/20 bg-white/5 text-white focus:ring-2 focus:ring-white/20 focus:ring-offset-0"
                />
                <label htmlFor="terms" className="text-sm text-slate-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-white hover:text-slate-300">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-white hover:text-slate-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-white px-6 py-6 text-base font-semibold text-[#010203] transition hover:bg-white/90 disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-white transition hover:text-slate-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

