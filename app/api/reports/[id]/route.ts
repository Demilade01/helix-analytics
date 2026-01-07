import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth/session"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser()
    if (!user || !user.organizationId || !user.sectorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get the snapshot with all related data
    const snapshot = await prisma.profitabilitySnapshot.findFirst({
      where: {
        id,
        organizationId: user.organizationId,
        sectorId: user.sectorId,
      },
      include: {
        departmentMetrics: {
          include: {
            department: true,
          },
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
        organization: true,
        sector: true,
      },
    })

    if (!snapshot) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Format the report data
    const report = {
      id: snapshot.id,
      periodStart: snapshot.periodStart.toISOString().split("T")[0],
      periodEnd: snapshot.periodEnd.toISOString().split("T")[0],
      organization: snapshot.organization.name,
      sector: snapshot.sector.name,
      currency: snapshot.currency,
      revenue: Number(snapshot.revenue),
      cost: Number(snapshot.cost),
      profit: Number(snapshot.profit),
      grossMargin: snapshot.grossMargin,
      operatingMargin: snapshot.operatingMargin,
      netMargin: snapshot.netMargin,
      departmentMetrics: snapshot.departmentMetrics.map((metric) => ({
        department: metric.department.name,
        revenue: Number(metric.revenue),
        cost: Number(metric.cost),
        profit: Number(metric.profit),
        margin: metric.margin,
        revenueShare: metric.revenueShare,
      })),
      costBreakdown: snapshot.costEntries.map((entry) => ({
        category: entry.category.name,
        amount: Number(entry.amount),
        percentage: entry.percentage,
      })),
      kpis: snapshot.kpiValues.map((kpiValue) => ({
        label: kpiValue.kpi.label,
        value: Number(kpiValue.value),
        format: kpiValue.kpi.format.toLowerCase(),
        trend: kpiValue.trend.toLowerCase(),
        deltaPercent: kpiValue.deltaPercent,
      })),
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("[API][REPORTS][ID]", error)
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 })
  }
}

