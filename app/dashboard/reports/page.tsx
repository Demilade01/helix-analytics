"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { fadeInUp, staggerContainer } from "@/components/sections/motion-presets"
import { useUser } from "@/lib/hooks/use-user"

// Format large numbers with K/M notation
function formatCompactCurrency(value: number, currency: string): { display: string; full: string } {
  const full = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  const absValue = Math.abs(value)
  const currencySymbol = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(0)
    .replace(/\d/g, "")
    .trim()

  let display: string

  if (absValue >= 1_000_000) {
    // Millions
    const millions = value / 1_000_000
    const rounded = Math.round(millions * 10) / 10
    display = `${currencySymbol}${rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1)}M`
  } else if (absValue >= 1_000) {
    // Thousands
    const thousands = value / 1_000
    const rounded = Math.round(thousands * 10) / 10
    display = `${currencySymbol}${rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1)}K`
  } else {
    display = full
  }

  return { display, full }
}
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Report {
  id: string
  title: string
  date: string
  type: string
  status: string
  periodStart?: string
  periodEnd?: string
  revenue?: number
  cost?: number
  profit?: number
  grossMargin?: number
  operatingMargin?: number
  netMargin?: number
}

interface ReportDetail {
  id: string
  periodStart: string
  periodEnd: string
  organization: string
  sector: string
  currency: string
  revenue: number
  cost: number
  profit: number
  grossMargin: number
  operatingMargin: number
  netMargin: number
  departmentMetrics: Array<{
    department: string
    revenue: number
    cost: number
    profit: number
    margin: number
    revenueShare: number
  }>
  costBreakdown: Array<{
    category: string
    amount: number
    percentage: number
  }>
  kpis: Array<{
    label: string
    value: number
    format: string
    trend: string
    deltaPercent: number | null
  }>
}

export default function ReportsPage() {
  const { user } = useUser()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null)
  const [isViewingReport, setIsViewingReport] = useState(false)
  const [isLoadingReport, setIsLoadingReport] = useState(false)

  useEffect(() => {
    if (user?.organization) {
      setIsLoading(true)
      fetch("/api/reports", {
        method: "GET",
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`)
          }
          const data = (await res.json()) as { reports: Report[] }
          setReports(data.reports)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching reports:", error)
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
            <p className="mt-4 text-sm text-slate-400">Loading reports...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Reports</h1>
        <p className="mt-2 text-slate-400">View and manage your analytics reports</p>
      </motion.div>

      {reports.length === 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl"
        >
          <p className="text-slate-400">No reports available yet.</p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {reports.map((report) => (
          <motion.div
            key={report.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            variants={fadeInUp}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                  <span>{report.type}</span>
                  <span>•</span>
                  <span>{report.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    report.status === "Published"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-500/20 text-slate-400"
                  }`}
                >
                  {report.status}
                </span>
                <button
                  onClick={async () => {
                    setIsLoadingReport(true)
                    setIsViewingReport(true)
                    try {
                      const response = await fetch(`/api/reports/${report.id}`, {
                        method: "GET",
                        credentials: "include",
                      })
                      if (!response.ok) {
                        throw new Error("Failed to load report")
                      }
                      const data = (await response.json()) as ReportDetail
                      setSelectedReport(data)
                    } catch (error) {
                      console.error("Error loading report:", error)
                      setSelectedReport(null)
                    } finally {
                      setIsLoadingReport(false)
                    }
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        </motion.div>
      )}

      {/* Report Detail Dialog */}
      <Dialog open={isViewingReport} onOpenChange={setIsViewingReport}>
        <DialogContent className="max-h-[90vh] max-w-4xl border-white/10 bg-[#010203] text-white p-0">
          <div className="flex max-h-[90vh] flex-col">
            <DialogHeader className="shrink-0 border-b border-white/10 px-6 py-4">
              <DialogTitle className="text-2xl font-semibold text-white">
                {isLoadingReport
                  ? "Loading Report"
                  : selectedReport
                    ? reports.find((r) => r.id === selectedReport.id)?.title || "Report Details"
                    : "Report Details"}
              </DialogTitle>
              {selectedReport && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  <span>{selectedReport.organization}</span>
                  <span>•</span>
                  <span>{selectedReport.sector}</span>
                  <span>•</span>
                  <span>
                    {new Date(selectedReport.periodStart).toLocaleDateString()} -{" "}
                    {new Date(selectedReport.periodEnd).toLocaleDateString()}
                  </span>
                </div>
              )}
            </DialogHeader>

            <div className="dialog-scrollable flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
              {isLoadingReport ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block size-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
                    <p className="mt-4 text-sm text-slate-400">Loading report...</p>
                  </div>
                </div>
              ) : selectedReport ? (
                <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Revenue</p>
                    {(() => {
                      const { display, full } = formatCompactCurrency(selectedReport.revenue, selectedReport.currency)
                      return (
                        <p className="mt-2 text-2xl font-semibold text-white" title={full}>
                          {display}
                        </p>
                      )
                    })()}
                  </div>
                  <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Costs</p>
                    {(() => {
                      const { display, full } = formatCompactCurrency(selectedReport.cost, selectedReport.currency)
                      return (
                        <p className="mt-2 text-2xl font-semibold text-white" title={full}>
                          {display}
                        </p>
                      )
                    })()}
                  </div>
                  <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Profit</p>
                    {(() => {
                      const { display, full } = formatCompactCurrency(selectedReport.profit, selectedReport.currency)
                      return (
                        <p className="mt-2 text-2xl font-semibold text-white" title={full}>
                          {display}
                        </p>
                      )
                    })()}
                  </div>
                </div>

                {/* Margins */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Gross Margin</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{selectedReport.grossMargin.toFixed(1)}%</p>
                  </div>
                  <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Operating Margin</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {selectedReport.operatingMargin.toFixed(1)}%
                    </p>
                  </div>
                  <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Net Margin</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{selectedReport.netMargin.toFixed(1)}%</p>
                  </div>
                </div>

                {/* KPIs */}
                {selectedReport.kpis.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-white">Key Performance Indicators</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {selectedReport.kpis.map((kpi) => {
                        let display: string
                        let full: string | null = null

                        if (kpi.format === "percentage") {
                          display = `${kpi.value.toFixed(1)}%`
                        } else if (kpi.format === "currency") {
                          const formatted = formatCompactCurrency(kpi.value, selectedReport.currency)
                          display = formatted.display
                          full = formatted.full
                        } else {
                          display = kpi.value.toLocaleString()
                        }

                        return (
                          <div key={kpi.label} className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm text-slate-400">{kpi.label}</p>
                            <p className="mt-2 text-xl font-semibold text-white" title={full || undefined}>
                              {display}
                            </p>
                            {kpi.deltaPercent !== null && (
                              <p
                                className={`mt-1 text-xs ${
                                  kpi.deltaPercent >= 0 ? "text-emerald-400" : "text-red-400"
                                }`}
                              >
                                {kpi.deltaPercent >= 0 ? "+" : ""}
                                {kpi.deltaPercent.toFixed(1)}% vs target
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Department Metrics */}
                {selectedReport.departmentMetrics.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-white">Revenue by Department</h3>
                    <div className="space-y-3">
                      {selectedReport.departmentMetrics.map((dept) => (
                        <div key={dept.department} className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white">{dept.department}</p>
                              <p className="mt-1 text-sm text-slate-400">{dept.margin.toFixed(1)}% margin</p>
                            </div>
                            <div className="text-right">
                              {(() => {
                                const { display, full } = formatCompactCurrency(dept.revenue, selectedReport.currency)
                                return (
                                  <p className="font-semibold text-white" title={full}>
                                    {display}
                                  </p>
                                )
                              })()}
                              <p className="text-xs text-slate-400">{dept.revenueShare.toFixed(1)}% of total</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cost Breakdown */}
                {selectedReport.costBreakdown.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-white">Cost Breakdown</h3>
                    <div className="space-y-3">
                      {selectedReport.costBreakdown.map((cost) => (
                        <div key={cost.category} className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white">{cost.category}</p>
                              <p className="mt-1 text-sm text-slate-400">{cost.percentage.toFixed(0)}% of total costs</p>
                            </div>
                            {(() => {
                              const { display, full } = formatCompactCurrency(cost.amount, selectedReport.currency)
                              return (
                                <p className="font-semibold text-white" title={full}>
                                  {display}
                                </p>
                              )
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">Failed to load report details.</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

