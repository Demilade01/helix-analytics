"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { fadeInUp, subtleScale } from "@/components/sections/motion-presets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignUpPage() {
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

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-slate-300">
                    First name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    required
                    className="w-full"
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
                    required
                    className="w-full"
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
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-slate-300">
                  Company name <span className="text-slate-500">(optional)</span>
                </label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Acme Inc."
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full"
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
                  required
                  className="w-full"
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
                className="w-full rounded-full bg-white px-6 py-6 text-base font-semibold text-[#010203] transition hover:bg-white/90"
              >
                Create account
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

