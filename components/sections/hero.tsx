"use client"

import { motion } from "framer-motion"

import { fadeInUp, staggerContainer, subtleScale } from "@/components/sections/motion-presets"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <motion.section
      id="hero"
      className="relative isolate mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-white shadow-2xl shadow-black/40 backdrop-blur-xl sm:gap-8 sm:rounded-3xl sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:gap-16 lg:rounded-[32px] lg:px-8 lg:py-16 lg:text-left"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-[#64748B]/20 opacity-60 sm:rounded-3xl lg:rounded-[32px]" />
      <motion.div className="flex-1 space-y-4 sm:space-y-6" variants={fadeInUp}>
        <p className="text-xs uppercase tracking-[0.3em] text-[#64748B] sm:text-sm sm:tracking-[0.4em]">Enterprise Intelligence</p>
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl sm:text-5xl lg:text-6xl">
            Illuminate performance with Helix Analytics
          </h1>
          <p className="text-base text-slate-300 sm:text-lg lg:text-xl">
            A modern decision layer for executives who need a unified, trustworthy view of financial and operational
            health. Built with glass-grade clarity, governed access, and real-time intelligence.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:items-start">
          <Button className="w-full rounded-full bg-white px-6 py-5 text-sm font-semibold text-[#010203] transition hover:bg-white/90 sm:w-auto sm:px-8 sm:py-6 sm:text-base">
            Launch Live Demo
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full border-white/30 bg-transparent px-6 py-5 text-sm text-white transition hover:border-white/50 hover:bg-white/5 hover:text-white sm:w-auto sm:px-8 sm:py-6 sm:text-base"
          >
            View Platform Overview
          </Button>
        </div>
        <motion.dl className="grid gap-4 sm:gap-6 sm:grid-cols-3" variants={staggerContainer}>
          {[
            { label: "Data sources unified", value: "150+" },
            { label: "Executive teams served", value: "42" },
            { label: "Avg. time-to-signal", value: "3.2 hrs" },
          ].map((item) => (
            <motion.div
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur-xl sm:rounded-2xl sm:p-4"
              variants={fadeInUp}
            >
              <dt className="text-xs uppercase tracking-wider text-slate-400">{item.label}</dt>
              <dd className="text-xl font-semibold text-white sm:text-2xl">{item.value}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>

      <motion.div className="flex-1" variants={subtleScale}>
        <div className="relative h-64 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-[#0f172a] to-transparent shadow-2xl shadow-black/30 backdrop-blur-2xl sm:h-72 md:h-80 md:rounded-3xl">
          <div className="absolute inset-2 rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-xl sm:inset-3 sm:rounded-2xl sm:p-4 md:inset-4 md:p-6">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400 sm:text-xs">
              <span>Signal Momentum</span>
              <span className="hidden sm:inline">Last 30 days</span>
              <span className="sm:hidden">30d</span>
            </div>
            <div className="mt-3 grid gap-2 text-left sm:mt-4 sm:gap-3 md:mt-6 md:gap-4">
              {[65, 78, 91, 84].map((value, index) => (
                <div key={index} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 sm:text-sm">
                    <span>Region {index + 1}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 sm:h-2">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] via-[#22d3ee] to-[#a855f7]" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-white/5 bg-white/5 p-3 text-left sm:mt-6 sm:rounded-2xl sm:p-4 md:mt-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#64748B] sm:text-xs sm:tracking-[0.3em]">Live Insight</p>
              <p className="mt-1.5 text-sm font-semibold text-white sm:mt-2 sm:text-base">
                Supply chain risk dropped 18% week-over-week with variance stabilized across LATAM nodes.
              </p>
            </div>
          </div>
          <div className="absolute -right-2 -top-2 rounded-xl border border-white/10 bg-[#64748B]/30 px-3 py-1.5 text-xs font-semibold text-white shadow-2xl shadow-black/40 backdrop-blur-2xl sm:-right-4 sm:-top-4 sm:rounded-2xl sm:px-4 sm:py-2 md:-right-6 md:-top-6 md:px-6 md:py-3 md:text-sm">
            ESG ↑ 12.4%
          </div>
          <div className="absolute -left-2 bottom-4 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] text-white/90 shadow shadow-black/50 backdrop-blur-2xl sm:-left-3 sm:bottom-6 sm:px-3 sm:py-1.5 md:-left-4 md:bottom-8 md:px-4 md:py-2 md:text-xs">
            <span className="hidden sm:inline">AI anomaly guard active</span>
            <span className="sm:hidden">AI guard</span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}

