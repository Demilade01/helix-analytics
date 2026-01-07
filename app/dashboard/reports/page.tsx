"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { fadeInUp, staggerContainer } from "@/components/sections/motion-presets"
import { useUser } from "@/lib/hooks/use-user"

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

export default function ReportsPage() {
  const { user } = useUser()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
                  onClick={() => {
                    // TODO: Implement report view modal or page
                    console.log("View report:", report.id)
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
    </div>
  )
}

