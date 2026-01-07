"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { fadeInUp, staggerContainer } from "@/components/sections/motion-presets"
import { useUser } from "@/lib/hooks/use-user"

interface AnalyticsData {
  revenueAnalytics: { value: number; change: number; period: string }
  costAnalysis: { value: number; change: number; period: string }
  profitMargin: { value: number; change: number; period: string }
  chartData: Array<{ month: string; value: number; revenue: number; cost: number; profit: number }>
}

export default function AnalyticsPage() {
  const { user } = useUser()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.organization) {
      setIsLoading(true)
      fetch("/api/analytics", {
        method: "GET",
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`)
          }
          const data = (await res.json()) as AnalyticsData
          setAnalyticsData(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching analytics data:", error)
          setIsLoading(false)
        })
    }
  }, [user?.organization])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block size-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            <p className="mt-4 text-sm text-slate-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
          Unable to load analytics data. Please try again later.
        </div>
      </div>
    )
  }

  const displayData = [
    {
      name: "Revenue Analytics",
      value: analyticsData.revenueAnalytics.value,
      change: analyticsData.revenueAnalytics.change,
      period: analyticsData.revenueAnalytics.period,
    },
    {
      name: "Cost Analysis",
      value: analyticsData.costAnalysis.value,
      change: analyticsData.costAnalysis.change,
      period: analyticsData.costAnalysis.period,
    },
    {
      name: "Profit Margin",
      value: analyticsData.profitMargin.value,
      change: analyticsData.profitMargin.change,
      period: analyticsData.profitMargin.period,
    },
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
        {displayData.map((item) => (
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
              <span
                className={`text-sm ${item.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {item.change >= 0 ? "+" : ""}
                {item.change.toFixed(1)}%
              </span>
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
              data={analyticsData.chartData}
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

