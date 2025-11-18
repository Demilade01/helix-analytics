"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

import { fadeInUp, staggerContainer } from "@/components/sections/motion-presets"

export default function AnalyticsPage() {
  const analyticsData = [
    { name: "Revenue Analytics", value: 2450000, change: "+12.5%", period: "vs last quarter" },
    { name: "Cost Analysis", value: 1820000, change: "-3.2%", period: "vs last quarter" },
    { name: "Profit Margin", value: 630000, change: "+18.7%", period: "vs last quarter" },
  ]

  const chartData = [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 72 },
    { month: "Mar", value: 68 },
    { month: "Apr", value: 75 },
    { month: "May", value: 82 },
    { month: "Jun", value: 78 },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Analytics</h1>
        <p className="mt-2 text-slate-400">Deep dive into your performance metrics</p>
      </motion.div>

      <motion.div
        className="grid gap-4 sm:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {analyticsData.map((item) => (
          <motion.div
            key={item.name}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            variants={fadeInUp}
          >
            <p className="text-sm font-medium text-slate-400">{item.name}</p>
            <p className="mt-4 text-3xl font-semibold text-white">
              ${(item.value / 1000000).toFixed(2)}M
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-emerald-400">{item.change}</span>
              <span className="text-xs text-slate-500">{item.period}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h2 className="mb-6 text-xl font-semibold text-white">Performance Trend</h2>
        <div className="h-64 rounded-xl border border-white/5 bg-black/30 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              style={{
                transition: "all 0.3s ease-in-out",
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="month"
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
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ fill: "#22d3ee", r: 4 }}
                activeDot={{ r: 6 }}
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
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}

