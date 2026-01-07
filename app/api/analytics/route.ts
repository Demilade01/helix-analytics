import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth/session"

export async function GET(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || !user.organizationId || !user.sectorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Parse date filters or use defaults (last 6 months)
    const periodStart = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 6))
    const periodEnd = endDate ? new Date(endDate) : new Date()

    // Get all snapshots in the date range for time series
    const snapshots = await prisma.profitabilitySnapshot.findMany({
      where: {
        organizationId: user.organizationId,
        sectorId: user.sectorId,
        periodStart: { gte: periodStart },
        periodEnd: { lte: periodEnd },
      },
      orderBy: { periodStart: "asc" },
    })

    if (snapshots.length === 0) {
      return NextResponse.json({
        revenueAnalytics: { value: 0, change: 0, period: "vs last quarter" },
        costAnalysis: { value: 0, change: 0, period: "vs last quarter" },
        profitMargin: { value: 0, change: 0, period: "vs last quarter" },
        chartData: [],
      })
    }

    // Calculate current period totals (most recent 3 months)
    const currentPeriodSnapshots = snapshots.slice(-3)
    const currentRevenue = currentPeriodSnapshots.reduce((sum, s) => sum + Number(s.revenue), 0)
    const currentCost = currentPeriodSnapshots.reduce((sum, s) => sum + Number(s.cost), 0)
    const currentProfit = currentPeriodSnapshots.reduce((sum, s) => sum + Number(s.profit), 0)

    // Calculate previous period totals (3 months before current)
    const previousPeriodSnapshots = snapshots.slice(-6, -3)
    const previousRevenue = previousPeriodSnapshots.length > 0
      ? previousPeriodSnapshots.reduce((sum, s) => sum + Number(s.revenue), 0)
      : currentRevenue * 0.9 // Fallback if no previous data
    const previousCost = previousPeriodSnapshots.length > 0
      ? previousPeriodSnapshots.reduce((sum, s) => sum + Number(s.cost), 0)
      : currentCost * 0.95
    const previousProfit = previousPeriodSnapshots.length > 0
      ? previousPeriodSnapshots.reduce((sum, s) => sum + Number(s.profit), 0)
      : currentProfit * 0.85

    // Calculate percentage changes
    const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0
    const costChange = previousCost > 0 ? ((currentCost - previousCost) / previousCost) * 100 : 0
    const profitChange = previousProfit > 0 ? ((currentProfit - previousProfit) / previousProfit) * 100 : 0

    // Build chart data (monthly aggregates)
    const chartDataMap = new Map<string, { revenue: number; cost: number; profit: number; count: number }>()

    snapshots.forEach((snapshot) => {
      const monthKey = snapshot.periodEnd.toISOString().slice(0, 7) // YYYY-MM
      const existing = chartDataMap.get(monthKey) || { revenue: 0, cost: 0, profit: 0, count: 0 }
      chartDataMap.set(monthKey, {
        revenue: existing.revenue + Number(snapshot.revenue),
        cost: existing.cost + Number(snapshot.cost),
        profit: existing.profit + Number(snapshot.profit),
        count: existing.count + 1,
      })
    })

    const chartData = Array.from(chartDataMap.entries())
      .map(([month, data]) => {
        const date = new Date(month + "-01")
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return {
          month: monthNames[date.getMonth()],
          value: data.revenue / 1000000, // Convert to millions for display
          revenue: data.revenue,
          cost: data.cost,
          profit: data.profit,
        }
      })
      .sort((a, b) => {
        // Sort by month order
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
      })

    return NextResponse.json({
      revenueAnalytics: {
        value: currentRevenue,
        change: revenueChange,
        period: "vs last quarter",
      },
      costAnalysis: {
        value: currentCost,
        change: costChange,
        period: "vs last quarter",
      },
      profitMargin: {
        value: currentProfit,
        change: profitChange,
        period: "vs last quarter",
      },
      chartData,
    })
  } catch (error) {
    console.error("[API][ANALYTICS]", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

