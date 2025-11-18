"use client"

import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"

import { fadeInUp, staggerContainer, subtleScale } from "@/components/sections/motion-presets"

const previewCards = [
  {
    title: "Margin Pulse",
    description: "Combines POS, logistics, and treasury data to flag shrinking unit economics before they hit earnings.",
  },
  {
    title: "Liquidity Radar",
    description: "Predictive view of cash runway blending FX exposure, credit facilities, and working capital levers.",
  },
]

const kpiStats = [
  { label: "Revenue yield", value: 78, delta: "+1.6% vs plan" },
  { label: "Cash conversion", value: 64, delta: "+2.4% vs plan" },
  { label: "Risk coverage", value: 91, delta: "+3.1% vs plan" },
]

const demandCurveData = [
  { week: "W1", value: 65 },
  { week: "W2", value: 72 },
  { week: "W3", value: 68 },
  { week: "W4", value: 75 },
  { week: "W5", value: 82 },
  { week: "W6", value: 78 },
  { week: "W7", value: 85 },
  { week: "W8", value: 88 },
  { week: "W9", value: 82 },
  { week: "W10", value: 90 },
  { week: "W11", value: 87 },
  { week: "W12", value: 92 },
]

export function AnalyticsPreviewSection() {
  return (
    <motion.section
      id="analytics"
      className="mx-auto flex max-w-6xl flex-col gap-10 rounded-[32px] border border-white/5 bg-gradient-to-br from-white/5 via-transparent to-[#0f172a] px-8 py-12 text-white shadow-2xl shadow-black/40 backdrop-blur-2xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={staggerContainer}
    >
      <motion.div className="flex flex-col gap-4 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left" variants={fadeInUp}>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#64748B]">Analytics preview</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Screens crafted for CROs & CFOs</h2>
          <p className="mt-2 text-lg text-slate-300">High-contrast signal maps rendered in real time for leadership reviews.</p>
        </div>
        <span className="text-sm uppercase tracking-[0.3em] text-slate-400">Synthetic data shown</span>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">
        <motion.div className="order-2 flex flex-col gap-6 lg:order-1 lg:col-span-2" variants={staggerContainer}>
          {previewCards.map((card) => (
            <motion.div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl"
              variants={fadeInUp}
            >
              <p className="text-sm uppercase tracking-widest text-[#64748B]">{card.title}</p>
              <p className="mt-3 text-base text-slate-300">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="order-1 lg:order-2 lg:col-span-3" variants={subtleScale}>
          <div className="relative h-[28rem] rounded-[28px] border border-white/10 bg-[#04060b]/70 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,1)] backdrop-blur-2xl">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
              <span>Executive dashboard</span>
              <span>Live</span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 text-left">
              {kpiStats.map((stat) => (
                <motion.div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4" variants={fadeInUp}>
                  <p className="text-xs uppercase text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stat.value}%</p>
                  <p className="text-xs text-emerald-400">{stat.delta}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 h-48 rounded-2xl border border-white/5 bg-gradient-to-tr from-[#22d3ee]/60 via-[#38bdf8]/30 to-transparent p-4">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Global demand curve</span>
                <span>Rolling 12 weeks</span>
              </div>
              <div className="mt-4 h-full rounded-2xl bg-black/30">
                <div className="h-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent)] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={demandCurveData}
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      style={{
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      <defs>
                        <linearGradient id="previewGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="previewLineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="50%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="week"
                        stroke="rgba(255,255,255,0.3)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "rgba(255,255,255,0.5)" }}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.3)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "rgba(255,255,255,0.5)" }}
                        domain={[0, 100]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="url(#previewLineGradient)"
                        strokeWidth={3}
                        fill="url(#previewGradient)"
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <motion.div
              className="absolute -right-6 top-12 rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm text-white shadow-2xl shadow-black/40 backdrop-blur-2xl"
              variants={fadeInUp}
            >
              Model drift <span className="ml-2 font-semibold text-emerald-400">stable</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

