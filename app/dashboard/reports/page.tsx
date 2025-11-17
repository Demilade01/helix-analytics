"use client"

import { motion } from "framer-motion"

import { fadeInUp, staggerContainer } from "@/components/sections/motion-presets"

export default function ReportsPage() {
  const reports = [
    {
      title: "Q4 Financial Report",
      date: "2024-01-15",
      type: "Financial",
      status: "Published",
    },
    {
      title: "Monthly Performance Summary",
      date: "2024-01-10",
      type: "Performance",
      status: "Draft",
    },
    {
      title: "ESG Compliance Report",
      date: "2024-01-05",
      type: "Compliance",
      status: "Published",
    },
    {
      title: "Risk Assessment Analysis",
      date: "2024-01-01",
      type: "Risk",
      status: "Published",
    },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Reports</h1>
        <p className="mt-2 text-slate-400">View and manage your analytics reports</p>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {reports.map((report, index) => (
          <motion.div
            key={index}
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
                <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                  View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

