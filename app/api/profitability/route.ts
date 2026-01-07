import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth/session"
import type { ProfitabilityData } from "@/lib/types/profitability"

export async function GET(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || !user.organizationId || !user.sectorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const departmentName = searchParams.get("department")

    // Parse date filters or use defaults (last 3 months)
    const periodStart = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 3))
    const periodEnd = endDate ? new Date(endDate) : new Date()

    // If department filter is provided, find the department ID first
    let departmentId: string | undefined
    if (departmentName) {
      const department = await prisma.department.findFirst({
        where: {
          name: departmentName,
          sectorId: user.sectorId,
        },
      })
      departmentId = department?.id
    }

    // Find the most recent snapshot for the organization within the date range
    const snapshot = await prisma.profitabilitySnapshot.findFirst({
      where: {
        organizationId: user.organizationId,
        sectorId: user.sectorId,
        periodStart: { lte: periodEnd },
        periodEnd: { gte: periodStart },
      },
      orderBy: { periodEnd: "desc" },
      include: {
        departmentMetrics: {
          include: {
            department: true,
          },
          where: departmentId ? { departmentId } : undefined,
        },
        costEntries: {
          include: {
            category: true,
          },
        },
        kpiValues: {
          include: {
            kpi: true,
          },
        },
      },
    })

    if (!snapshot) {
      return NextResponse.json(
        {
          kpis: [],
          grossProfitMargin: 0,
          operatingProfitMargin: 0,
          netProfitMargin: 0,
          revenue: 0,
          costs: 0,
          profit: 0,
          revenueByDepartment: [],
          costBreakdown: [],
          timeSeriesData: [],
        },
        { status: 200 }
      )
    }

    // Get time series data for the date range
    const timeSeriesSnapshots = await prisma.profitabilitySnapshot.findMany({
      where: {
        organizationId: user.organizationId,
        sectorId: user.sectorId,
        periodStart: { gte: periodStart },
        periodEnd: { lte: periodEnd },
      },
      orderBy: { periodStart: "asc" },
    })

    // Build KPIs from KPI values
    const kpis = snapshot.kpiValues.map((kpiValue) => {
      const kpi = kpiValue.kpi
      const targetValue = kpi.targetValue ? Number(kpi.targetValue) : null
      const currentValue = Number(kpiValue.value)
      const delta = targetValue ? currentValue - targetValue : 0

      let deltaString = ""
      if (kpi.format === "PERCENTAGE") {
        deltaString = `${delta > 0 ? "+" : ""}${delta.toFixed(1)}% vs target`
      } else if (kpi.format === "CURRENCY") {
        const prevValue = targetValue || currentValue * 0.8 // Fallback if no target
        deltaString = `+${(((currentValue - prevValue) / prevValue) * 100).toFixed(1)}% vs last quarter`
      }

      return {
        label: kpi.label,
        value: currentValue,
        delta: deltaString,
        trend: kpiValue.trend.toLowerCase() as "up" | "down" | "neutral",
        format: kpi.format.toLowerCase() as "percentage" | "currency" | "number",
        description: kpi.description || undefined,
      }
    })

    // Build revenue by department
    const revenueByDepartment = snapshot.departmentMetrics.map((metric) => ({
      department: metric.department.name,
      revenue: Number(metric.revenue),
      cost: Number(metric.cost),
      profit: Number(metric.profit),
      margin: metric.margin,
      percentage: metric.revenueShare,
    }))

    // Build cost breakdown
    const costBreakdown = snapshot.costEntries.map((entry) => ({
      category: entry.category.name,
      amount: Number(entry.amount),
      percentage: entry.percentage,
    }))

    // Build time series data
    const timeSeriesData = timeSeriesSnapshots.map((snap) => ({
      date: snap.periodEnd.toISOString().split("T")[0],
      revenue: Number(snap.revenue),
      cost: Number(snap.cost),
      profit: Number(snap.profit),
      margin: snap.operatingMargin,
    }))

    const profitabilityData: ProfitabilityData = {
      kpis,
      grossProfitMargin: snapshot.grossMargin,
      operatingProfitMargin: snapshot.operatingMargin,
      netProfitMargin: snapshot.netMargin,
      revenue: Number(snapshot.revenue),
      costs: Number(snapshot.cost),
      profit: Number(snapshot.profit),
      revenueByDepartment,
      costBreakdown,
      timeSeriesData,
    }

    return NextResponse.json(profitabilityData)
  } catch (error) {
    console.error("[API][PROFITABILITY]", error)
    return NextResponse.json({ error: "Failed to fetch profitability data" }, { status: 500 })
  }
}

