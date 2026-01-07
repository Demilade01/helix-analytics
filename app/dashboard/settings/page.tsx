"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

import { fadeInUp } from "@/components/sections/motion-presets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/lib/hooks/use-user"

export default function SettingsPage() {
  const { user, refreshUser } = useUser()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState("dark")
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const themeRef = useRef<HTMLDivElement>(null)

  // Close theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setEmail(user.email || "")
    }
  }, [user])

  const handleSave = async () => {
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: firstName.trim() || null,
          lastName: lastName.trim() || null,
          email: email.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.error || "Failed to update profile")
        setIsSaving(false)
        return
      }

      // Refresh user context to get updated data
      await refreshUser()
      setSuccess("Profile updated successfully!")
      setIsSaving(false)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("An unexpected error occurred")
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setEmail(user.email || "")
    }
    setError("")
    setSuccess("")
  }

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block size-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            <p className="mt-4 text-sm text-slate-400">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Settings</h1>
        <p className="mt-2 text-slate-400">Manage your account preferences</p>
      </motion.div>

      <motion.div
        className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div>
          <h2 className="text-lg font-semibold text-white">Profile</h2>
          <p className="mt-1 text-sm text-slate-400">Update your account information</p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-slate-300">
                First name
              </label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-slate-300">
                Last name
              </label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full"
                disabled={isSaving}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={isSaving}
            />
          </div>
          {user.organization && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Organization</label>
              <Input
                type="text"
                value={user.organization}
                className="w-full"
                disabled
              />
              <p className="text-xs text-slate-500">Organization cannot be changed</p>
            </div>
          )}
          {user.sector && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Sector</label>
              <Input
                type="text"
                value={user.sector}
                className="w-full"
                disabled
              />
              <p className="text-xs text-slate-500">Sector cannot be changed</p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div>
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
          <p className="mt-1 text-sm text-slate-400">Customize your experience</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Email notifications</p>
              <p className="text-xs text-slate-400">Receive updates via email</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white/20 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-white/20"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Theme</p>
              <p className="text-xs text-slate-400">Choose your preferred theme</p>
            </div>
            <div className="relative" ref={themeRef}>
              <button
                type="button"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                disabled={isSaving}
                className="flex w-32 items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-left text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-xl"
              >
                <span className="capitalize">{theme}</span>
                <ChevronDown
                  className={`size-4 text-slate-400 transition-transform ${isThemeOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isThemeOpen && (
                <div className="absolute right-0 z-50 mt-2 w-32 space-y-1 rounded-xl border border-white/20 bg-[#0f172a]/95 p-2 backdrop-blur-xl shadow-2xl shadow-black/60">
                  {["dark", "light"].map((themeOption) => (
                    <button
                      key={themeOption}
                      type="button"
                      onClick={() => {
                        setTheme(themeOption)
                        setIsThemeOpen(false)
                      }}
                      disabled={isSaving}
                      className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                        theme === themeOption
                          ? "bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30"
                          : "bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                      } disabled:cursor-not-allowed disabled:opacity-50 capitalize`}
                    >
                      {themeOption}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {(error || success) && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className={`rounded-2xl border p-4 ${
            error
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {error || success}
        </motion.div>
      )}

      <motion.div
        className="flex justify-end gap-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
          className="rounded-full border-white/30 bg-transparent px-6 py-2 text-white transition hover:border-white/50 hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-full bg-white px-6 py-2 text-[#010203] transition hover:bg-white/90 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </motion.div>
    </div>
  )
}

