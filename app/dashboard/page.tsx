"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

import { fadeInUp, staggerContainer } from "@/components/sections/motion-presets"

export default function DashboardPage() {

  const kpiData = [
    { label: "Revenue Yield", value: "78%", delta: "+1.6%", trend: "up" },
    { label: "Cash Conversion", value: "64%", delta: "+2.4%", trend: "up" },
    { label: "Risk Coverage", value: "91%", delta: "+3.1%", trend: "up" },
    { label: "ESG Index", value: "87%", delta: "+12.4%", trend: "up" },
  ]

  const regionData = [
    { name: "North America", value: 78, color: "from-[#38bdf8] to-[#22d3ee]" },
    { name: "Europe", value: 65, color: "from-[#22d3ee] to-[#a855f7]" },
    { name: "Asia Pacific", value: 91, color: "from-[#a855f7] to-[#38bdf8]" },
    { name: "LATAM", value: 84, color: "from-[#38bdf8] to-[#22d3ee]" },
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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* KPI Cards */}
      <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {kpiData.map((kpi) => (
              <motion.div
                key={kpi.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                variants={fadeInUp}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">{kpi.label}</p>
                  <span className="text-xs text-emerald-400">↑ {kpi.delta}</span>
                </div>
                <p className="mt-4 text-3xl font-semibold text-white">{kpi.value}</p>
                <div className="mt-4 h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#22d3ee] via-[#38bdf8] to-[#a855f7]"
                    style={{ width: kpi.value }}
                  />
                </div>
              </motion.div>
            ))}
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Signal Momentum Chart */}
        <motion.div
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Signal Momentum</h2>
              <p className="mt-1 text-sm text-slate-400">Last 30 days</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
              Live
            </span>
          </div>
          <div className="space-y-4">
            {regionData.map((region) => (
              <div key={region.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{region.name}</span>
                  <span className="font-medium text-white">{region.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${region.color}`}
                    style={{ width: `${region.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Insights */}
        <motion.div
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="mb-6 text-xl font-semibold text-white">Live Insights</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-[#64748B]">Supply Chain</p>
              <p className="mt-2 text-sm text-white">
                Risk dropped 18% week-over-week with variance stabilized across LATAM nodes.
              </p>
              <p className="mt-2 text-xs text-slate-400">2 hours ago</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-[#64748B]">Financial</p>
              <p className="mt-2 text-sm text-white">
                Cash conversion cycle improved by 3.2 days in Q4, exceeding targets.
              </p>
              <p className="mt-2 text-xs text-slate-400">5 hours ago</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-[#64748B]">ESG</p>
              <p className="mt-2 text-sm text-white">
                Carbon footprint reduced by 12% through optimized logistics routing.
              </p>
              <p className="mt-2 text-xs text-slate-400">1 day ago</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analytics Chart Section */}
      <motion.div
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Global Demand Curve</h2>
            <p className="mt-1 text-sm text-slate-400">Rolling 12 weeks</p>
          </div>
        </div>
        <div className="h-64 rounded-xl border border-white/5 bg-linear-to-tr from-[#22d3ee]/20 via-[#38bdf8]/10 to-transparent p-4">
          <div className="h-full rounded-lg bg-black/30 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={demandCurveData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="week"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(1, 2, 3, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#64748B" }}
                  animationDuration={200}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

