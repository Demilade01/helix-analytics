"use client"

import { useState } from "react"
import { ArrowUpDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RevenueByDepartment } from "@/lib/types/profitability"

interface ProfitabilityTableProps {
  data: RevenueByDepartment[]
}

type SortField = "department" | "revenue" | "cost" | "profit" | "margin"
type SortDirection = "asc" | "desc"

export function ProfitabilityTable({ data }: ProfitabilityTableProps) {
  const [sortField, setSortField] = useState<SortField>("revenue")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    let aValue: number
    let bValue: number

    switch (sortField) {
      case "department":
        return sortDirection === "asc"
          ? a.department.localeCompare(b.department)
          : b.department.localeCompare(a.department)
      case "revenue":
        aValue = a.revenue
        bValue = b.revenue
        break
      case "cost":
        aValue = a.cost
        bValue = b.cost
        break
      case "profit":
        aValue = a.profit
        bValue = b.profit
        break
      case "margin":
        aValue = a.margin
        bValue = b.margin
        break
      default:
        return 0
    }

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const SortButton = ({ field, children, align = "left" }: { field: SortField; children: React.ReactNode; align?: "left" | "right" }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1.5 hover:text-white transition w-full ${align === "right" ? "justify-end" : "justify-start"}`}
    >
      {children}
      <ArrowUpDown className="size-3 text-slate-400 shrink-0" />
    </button>
  )

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-xl">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-slate-300 font-medium pl-6 py-4">
              <SortButton field="department" align="left">Department</SortButton>
            </TableHead>
            <TableHead className="text-slate-300 font-medium text-right pr-6 py-4">
              <SortButton field="revenue" align="right">Revenue</SortButton>
            </TableHead>
            <TableHead className="text-slate-300 font-medium text-right pr-6 py-4">
              <SortButton field="cost" align="right">Cost</SortButton>
            </TableHead>
            <TableHead className="text-slate-300 font-medium text-right pr-6 py-4">
              <SortButton field="profit" align="right">Profit</SortButton>
            </TableHead>
            <TableHead className="text-slate-300 font-medium text-right pr-6 py-4">
              <SortButton field="margin" align="right">Margin</SortButton>
            </TableHead>
            <TableHead className="text-slate-300 font-medium text-right pr-6 py-4">Share</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={row.department} className="border-white/10 hover:bg-white/5 transition">
              <TableCell className="font-medium text-white py-4 pl-6">{row.department}</TableCell>
              <TableCell className="text-right text-slate-300 py-4 pr-6 tabular-nums">{formatCurrency(row.revenue)}</TableCell>
              <TableCell className="text-right text-slate-300 py-4 pr-6 tabular-nums">{formatCurrency(row.cost)}</TableCell>
              <TableCell className="text-right font-semibold text-white py-4 pr-6 tabular-nums">{formatCurrency(row.profit)}</TableCell>
              <TableCell className="text-right py-4 pr-6">
                <span
                  className={`font-semibold tabular-nums ${
                    row.margin >= 20 ? "text-emerald-400" : row.margin >= 10 ? "text-yellow-400" : "text-red-400"
                  }`}
                >
                  {row.margin.toFixed(1)}%
                </span>
              </TableCell>
              <TableCell className="text-right text-slate-400 py-4 pr-6 tabular-nums">{row.percentage.toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

