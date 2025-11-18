"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { fadeInUp } from "@/components/sections/motion-presets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const [email, setEmail] = useState("demo@helix.com")
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState("dark")

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
            />
          </div>
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
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="flex justify-end gap-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Button
          variant="outline"
          className="rounded-full border-white/30 bg-transparent px-6 py-2 text-white transition hover:border-white/50 hover:bg-white/5 hover:text-white"
        >
          Cancel
        </Button>
        <Button className="rounded-full bg-white px-6 py-2 text-[#010203] transition hover:bg-white/90">
          Save Changes
        </Button>
      </motion.div>
    </div>
  )
}

