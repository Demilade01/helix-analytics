"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Plus, Calendar, DollarSign, TrendingUp, ChevronDown, Upload } from "lucide-react"

import { fadeInUp, staggerContainer } from "@/components/sections/motion-presets"
import { useUser } from "@/lib/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Department {
  id: string
  name: string
  code: string | null
}

interface CostCategory {
  id: string
  name: string
  code: string | null
}

interface KPI {
  id: string
  label: string
  slug: string
  format: string
}

interface Snapshot {
  id: string
  periodStart: string
  periodEnd: string
  revenue: number
  cost: number
  profit: number
  currency: string
}

export default function DataPage() {
  const { user } = useUser()
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [categories, setCategories] = useState<CostCategory[]>([])
  const [kpis, setKpis] = useState<KPI[]>([])

  // Form state
  const [formData, setFormData] = useState({
    periodStart: "",
    periodEnd: "",
    currency: "USD",
    revenue: "",
    cost: "",
    departmentMetrics: [] as Array<{ departmentName: string; revenue: string; cost: string }>,
    costBreakdown: [] as Array<{ categoryName: string; amount: string }>,
    kpiValues: [] as Array<{ kpiSlug: string; value: string; trend: string }>,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const currencyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user?.organization) {
      fetchSnapshots()
      fetchDepartments()
      fetchCategories()
      fetchKPIs()
    }
  }, [user?.organization])

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const fetchSnapshots = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/snapshots", {
        credentials: "include",
      })
      if (response.ok) {
        const data = (await response.json()) as { snapshots: Snapshot[] }
        setSnapshots(data.snapshots)
      }
    } catch (error) {
      console.error("Error fetching snapshots:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/snapshots/departments", {
        credentials: "include",
      })
      if (response.ok) {
        const data = (await response.json()) as { departments: Department[] }
        setDepartments(data.departments)
      }
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/snapshots/categories", {
        credentials: "include",
      })
      if (response.ok) {
        const data = (await response.json()) as { categories: CostCategory[] }
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchKPIs = async () => {
    try {
      const response = await fetch("/api/snapshots/kpis", {
        credentials: "include",
      })
      if (response.ok) {
        const data = (await response.json()) as { kpis: KPI[] }
        setKpis(data.kpis)
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = (await response.json()) as { error: string }
        throw new Error(errorData.error || "Failed to create snapshot")
      }

      setSuccess(true)
      setIsDialogOpen(false)
      // Reset form
      setFormData({
        periodStart: "",
        periodEnd: "",
        currency: "USD",
        revenue: "",
        cost: "",
        departmentMetrics: [],
        costBreakdown: [],
        kpiValues: [],
      })
      // Refresh snapshots
      await fetchSnapshots()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create snapshot")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addDepartmentMetric = () => {
    setFormData({
      ...formData,
      departmentMetrics: [...formData.departmentMetrics, { departmentName: "", revenue: "", cost: "" }],
    })
  }

  const addCostCategory = () => {
    setFormData({
      ...formData,
      costBreakdown: [...formData.costBreakdown, { categoryName: "", amount: "" }],
    })
  }

  const addKPI = () => {
    setFormData({
      ...formData,
      kpiValues: [...formData.kpiValues, { kpiSlug: "", value: "", trend: "NEUTRAL" }],
    })
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block size-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            <p className="mt-4 text-sm text-slate-400">Loading data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Data Management</h1>
          <p className="mt-2 text-slate-400">Upload and manage your profitability data</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="rounded-lg bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
        >
          <Plus className="mr-2 size-4" />
          Add Snapshot
        </Button>
      </motion.div>

      {success && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-400"
        >
          Snapshot created successfully!
        </motion.div>
      )}

      {error && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400"
        >
          {error}
        </motion.div>
      )}

      {snapshots.length === 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl"
        >
          <Upload className="mx-auto mb-4 size-12 text-slate-400" />
          <h3 className="mb-2 text-lg font-semibold text-white">No data snapshots yet</h3>
          <p className="mb-6 text-slate-400">Get started by creating your first profitability snapshot.</p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="rounded-lg bg-white/10 px-6 py-2 text-white transition hover:bg-white/20"
          >
            <Plus className="mr-2 size-4" />
            Create First Snapshot
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {snapshots.map((snapshot) => (
            <motion.div
              key={snapshot.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              variants={fadeInUp}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Calendar className="size-5 text-slate-400" />
                  <div>
                    <p className="font-semibold text-white">
                      {new Date(snapshot.periodStart).toLocaleDateString()} -{" "}
                      {new Date(snapshot.periodEnd).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-400">{snapshot.currency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Revenue</p>
                    <p className="font-semibold text-white">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: snapshot.currency,
                        minimumFractionDigits: 0,
                      }).format(snapshot.revenue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Profit</p>
                    <p className="font-semibold text-emerald-400">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: snapshot.currency,
                        minimumFractionDigits: 0,
                      }).format(snapshot.profit)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Snapshot Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-white/10 bg-[#010203] text-white p-0">
          <div className="flex max-h-[90vh] flex-col">
            <DialogHeader className="shrink-0 border-b border-white/10 px-6 py-4">
              <DialogTitle className="text-2xl font-semibold text-white">Create New Snapshot</DialogTitle>
            </DialogHeader>

            <div className="dialog-scrollable flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Period */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Period Start</label>
                    <input
                      type="date"
                      required
                      value={formData.periodStart}
                      onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Period End</label>
                    <input
                      type="date"
                      required
                      value={formData.periodEnd}
                      onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/20 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Currency</label>
                  <div className="relative" ref={currencyRef}>
                    <button
                      type="button"
                      onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                      className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-left text-white transition hover:border-white/20 hover:bg-white/8"
                    >
                      <span>{formData.currency}</span>
                      <ChevronDown
                        className={`size-4 text-slate-400 transition-transform ${isCurrencyOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isCurrencyOpen && (
                      <div className="absolute z-50 mt-2 w-full space-y-1 rounded-xl border border-white/20 bg-[#0f172a]/95 p-2 backdrop-blur-xl shadow-2xl shadow-black/60">
                        {["USD", "EUR", "GBP"].map((currencyOption) => (
                          <button
                            key={currencyOption}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, currency: currencyOption })
                              setIsCurrencyOpen(false)
                            }}
                            className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                              formData.currency === currencyOption
                                ? "bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/30"
                                : "bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {currencyOption}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Revenue & Cost */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Revenue</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.revenue}
                      onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/20 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/20 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Department Metrics */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300">Department Metrics (Optional)</label>
                    <Button
                      type="button"
                      onClick={addDepartmentMetric}
                      className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/20"
                    >
                      <Plus className="mr-1 size-3" />
                      Add Department
                    </Button>
                  </div>
                  {formData.departmentMetrics.map((dept, index) => (
                    <div key={index} className="mb-3 grid gap-3 rounded-lg border border-white/10 bg-white/5 p-3 sm:grid-cols-3">
                      <select
                        value={dept.departmentName}
                        onChange={(e) => {
                          const updated = [...formData.departmentMetrics]
                          updated[index].departmentName = e.target.value
                          setFormData({ ...formData, departmentMetrics: updated })
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/20 focus:outline-none"
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        value={dept.revenue}
                        onChange={(e) => {
                          const updated = [...formData.departmentMetrics]
                          updated[index].revenue = e.target.value
                          setFormData({ ...formData, departmentMetrics: updated })
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/20 focus:outline-none"
                        placeholder="Revenue"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={dept.cost}
                        onChange={(e) => {
                          const updated = [...formData.departmentMetrics]
                          updated[index].cost = e.target.value
                          setFormData({ ...formData, departmentMetrics: updated })
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/20 focus:outline-none"
                        placeholder="Cost"
                      />
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300">Cost Breakdown (Optional)</label>
                    <Button
                      type="button"
                      onClick={addCostCategory}
                      className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/20"
                    >
                      <Plus className="mr-1 size-3" />
                      Add Category
                    </Button>
                  </div>
                  {formData.costBreakdown.map((cost, index) => (
                    <div key={index} className="mb-3 grid gap-3 rounded-lg border border-white/10 bg-white/5 p-3 sm:grid-cols-2">
                      <select
                        value={cost.categoryName}
                        onChange={(e) => {
                          const updated = [...formData.costBreakdown]
                          updated[index].categoryName = e.target.value
                          setFormData({ ...formData, costBreakdown: updated })
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/20 focus:outline-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        value={cost.amount}
                        onChange={(e) => {
                          const updated = [...formData.costBreakdown]
                          updated[index].amount = e.target.value
                          setFormData({ ...formData, costBreakdown: updated })
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/20 focus:outline-none"
                        placeholder="Amount"
                      />
                    </div>
                  ))}
                </div>

                {/* KPI Values */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300">KPI Values (Optional)</label>
                    <Button
                      type="button"
                      onClick={addKPI}
                      className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/20"
                    >
                      <Plus className="mr-1 size-3" />
                      Add KPI
                    </Button>
                  </div>
                  {formData.kpiValues.map((kpi, index) => (
                    <div key={index} className="mb-3 grid gap-3 rounded-lg border border-white/10 bg-white/5 p-3 sm:grid-cols-3">
                      <select
                        value={kpi.kpiSlug}
                        onChange={(e) => {
                          const updated = [...formData.kpiValues]
                          updated[index].kpiSlug = e.target.value
                          setFormData({ ...formData, kpiValues: updated })
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/20 focus:outline-none"
                      >
                        <option value="">Select KPI</option>
                        {kpis.map((k) => (
                          <option key={k.id} value={k.slug}>
                            {k.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        value={kpi.value}
                        onChange={(e) => {
                          const updated = [...formData.kpiValues]
                          updated[index].value = e.target.value
                          setFormData({ ...formData, kpiValues: updated })
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/20 focus:outline-none"
                        placeholder="Value"
                      />
                      <select
                        value={kpi.trend}
                        onChange={(e) => {
                          const updated = [...formData.kpiValues]
                          updated[index].trend = e.target.value
                          setFormData({ ...formData, kpiValues: updated })
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/20 focus:outline-none"
                      >
                        <option value="NEUTRAL">Neutral</option>
                        <option value="UP">Up</option>
                        <option value="DOWN">Down</option>
                      </select>
                    </div>
                  ))}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                  <Button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-lg border border-white/10 bg-transparent px-4 py-2 text-white transition hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-white/10 px-4 py-2 text-white transition hover:bg-white/20 disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating..." : "Create Snapshot"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

