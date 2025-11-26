"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

import { fadeInUp, staggerContainer } from "@/components/sections/motion-presets"
import { useUser } from "@/lib/hooks/use-user"
import { fetchProfitabilityData } from "@/lib/api/mock-profitability"
import type { ProfitabilityData, ProfitabilityFilters } from "@/lib/types/profitability"
import { ProfitabilityFilters as FiltersComponent } from "@/components/dashboard/profitability-filters"
import { ProfitabilityTable } from "@/components/dashboard/profitability-table"

function formatValue(value: string | number, format: "percentage" | "currency" | "number"): string {
  if (format === "percentage") {
    return `${typeof value === "number" ? value.toFixed(1) : value}%`
  }
  if (format === "currency") {
    const numValue = typeof value === "number" ? value : parseFloat(value.toString())
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue)
  }
  return value.toString()
}

export default function DashboardPage() {
  const { user } = useUser()
  const [profitabilityData, setProfitabilityData] = useState<ProfitabilityData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<ProfitabilityFilters>({
    dateRange: {
      start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      end: new Date(),
    },
    department: undefined,
  })

  useEffect(() => {
    if (user?.sector && user?.organization) {
      setIsLoading(true)
      fetchProfitabilityData(user.sector, user.organization, filters)
        .then((data) => {
          setProfitabilityData(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching profitability data:", error)
          setIsLoading(false)
        })
    }
  }, [user?.sector, user?.organization, filters])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block size-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            <p className="mt-4 text-sm text-slate-400">Loading profitability data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profitabilityData) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
          Unable to load profitability data. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* User Context Header */}
      {user && (
        <motion.div
          className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">Profitability Dashboard</h1>
              <p className="mt-1 text-sm text-slate-400">
                {user.organization} • {user.sector}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                {user.sector}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      {user && (
        <motion.div
          className="relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          style={{ zIndex: 1 }}
        >
          <FiltersComponent
            sector={user.sector ?? "General"}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </motion.div>
      )}

      {/* Profitability KPI Cards */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {profitabilityData.kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">{kpi.label}</p>
              <span
                className={`text-xs ${
                  kpi.trend === "up" ? "text-emerald-400" : kpi.trend === "down" ? "text-red-400" : "text-slate-400"
                }`}
              >
                {kpi.trend === "up" ? "↑" : kpi.trend === "down" ? "↓" : "→"} {kpi.delta}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">{formatValue(kpi.value, kpi.format)}</p>
            {kpi.description && <p className="mt-2 text-xs text-slate-500">{kpi.description}</p>}
            {kpi.format === "percentage" && (
              <div className="mt-4 h-1.5 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#22d3ee] via-[#38bdf8] to-[#a855f7]"
                  style={{ width: `${Math.min(100, typeof kpi.value === "number" ? kpi.value : parseFloat(kpi.value.toString()))}%` }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue by Department */}
        <motion.div
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Revenue by Department</h2>
              <p className="mt-1 text-sm text-slate-400">Profitability breakdown</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
              {user?.sector}
            </span>
          </div>
          <div className="space-y-4">
            {profitabilityData.revenueByDepartment?.map((dept, index) => {
              const colors = [
                "from-[#38bdf8] to-[#22d3ee]",
                "from-[#22d3ee] to-[#a855f7]",
                "from-[#a855f7] to-[#38bdf8]",
                "from-[#38bdf8] to-[#22d3ee]",
                "from-[#22d3ee] to-[#a855f7]",
              ]
              return (
                <div key={dept.department} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{dept.department}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(dept.revenue)}
                      </span>
                      <span className="font-medium text-white">{dept.margin.toFixed(1)}% margin</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full bg-linear-to-r ${colors[index % colors.length]}`}
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Cost Breakdown */}
        <motion.div
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="mb-6 text-xl font-semibold text-white">Cost Breakdown</h2>
          <div className="space-y-4">
            {profitabilityData.costBreakdown?.map((cost) => (
              <div key={cost.category} className="rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-300">{cost.category}</p>
                  <p className="text-sm font-semibold text-white">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cost.amount)}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#22d3ee] to-[#38bdf8]"
                      style={{ width: `${cost.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{cost.percentage.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Profitability Trend Chart */}
      <motion.div
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Profitability Trend</h2>
            <p className="mt-1 text-sm text-slate-400">Last 12 months</p>
          </div>
        </div>
        <div className="h-64 rounded-xl border border-white/5 bg-linear-to-tr from-[#22d3ee]/20 via-[#38bdf8]/10 to-transparent p-4">
          <div className="h-full rounded-lg bg-black/30 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={profitabilityData.timeSeriesData?.map((point) => ({
                  date: new Date(point.date).toLocaleDateString("en-US", { month: "short" }),
                  margin: point.margin,
                  profit: point.profit,
                }))}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <defs>
                  <linearGradient id="marginGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
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
                  label={{ value: "Margin %", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "#64748B" } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(1, 2, 3, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#64748B" }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Profit Margin"]}
                  animationDuration={200}
                />
                <Area
                  type="monotone"
                  dataKey="margin"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  fill="url(#marginGradient)"
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

      {/* Profitability Data Table */}
      {profitabilityData.revenueByDepartment && profitabilityData.revenueByDepartment.length > 0 && (
        <motion.div
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Profitability Breakdown</h2>
              <p className="mt-1 text-sm text-slate-400">Detailed department analysis</p>
            </div>
          </div>
          <ProfitabilityTable data={profitabilityData.revenueByDepartment} />
        </motion.div>
      )}
    </div>
  )
}

