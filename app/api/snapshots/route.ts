import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth/session"

// GET - List all snapshots for the user's organization
export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user || !user.organizationId || !user.sectorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const snapshots = await prisma.profitabilitySnapshot.findMany({
      where: {
        organizationId: user.organizationId,
        sectorId: user.sectorId,
      },
      orderBy: { periodEnd: "desc" },
      include: {
        departmentMetrics: {
          include: { department: true },
        },
        costEntries: {
          include: { category: true },
        },
      },
    })

    return NextResponse.json({ snapshots })
  } catch (error) {
    console.error("[API][SNAPSHOTS][GET]", error)
    return NextResponse.json({ error: "Failed to fetch snapshots" }, { status: 500 })
  }
}

// POST - Create a new snapshot
export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || !user.organizationId || !user.sectorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      periodStart,
      periodEnd,
      currency = "USD",
      revenue,
      cost,
      departmentMetrics = [],
      costBreakdown = [],
      kpiValues = [],
    } = body

    // Validate required fields
    if (!periodStart || !periodEnd || revenue === undefined || cost === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const profit = Number(revenue) - Number(cost)
    const grossMargin = ((Number(revenue) - Number(cost) * 0.6) / Number(revenue)) * 100
    const operatingMargin = (profit / Number(revenue)) * 100
    const netMargin = operatingMargin * 0.85

    // Check if snapshot already exists for this period
    const existing = await prisma.profitabilitySnapshot.findUnique({
      where: {
        organizationId_periodStart_periodEnd: {
          organizationId: user.organizationId,
          periodStart: new Date(periodStart),
          periodEnd: new Date(periodEnd),
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Snapshot already exists for this period" }, { status: 409 })
    }

    // Create the snapshot
    const snapshot = await prisma.profitabilitySnapshot.create({
      data: {
        organizationId: user.organizationId,
        sectorId: user.sectorId,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        currency,
        revenue: Number(revenue),
        cost: Number(cost),
        profit,
        grossMargin,
        operatingMargin,
        netMargin,
      },
    })

    // Create department metrics
    if (departmentMetrics.length > 0) {
      const orgDepts = await prisma.organizationDepartment.findMany({
        where: { organizationId: user.organizationId },
        include: { department: true },
      })

      const deptMap = new Map(orgDepts.map((od) => [od.department.name, od.department.id]))

      for (const deptMetric of departmentMetrics) {
        const deptId = deptMap.get(deptMetric.departmentName)
        if (deptId) {
          await prisma.departmentMetric.create({
            data: {
              snapshotId: snapshot.id,
              departmentId: deptId,
              organizationId: user.organizationId,
              revenue: Number(deptMetric.revenue),
              cost: Number(deptMetric.cost),
              profit: Number(deptMetric.revenue) - Number(deptMetric.cost),
              margin: ((Number(deptMetric.revenue) - Number(deptMetric.cost)) / Number(deptMetric.revenue)) * 100,
              revenueShare: (Number(deptMetric.revenue) / Number(revenue)) * 100,
            },
          })
        }
      }
    }

    // Create cost entries
    if (costBreakdown.length > 0) {
      const totalCost = Number(cost)
      for (const costItem of costBreakdown) {
        const category = await prisma.costCategory.findFirst({
          where: { name: costItem.categoryName },
        })

        if (category) {
          await prisma.costEntry.create({
            data: {
              snapshotId: snapshot.id,
              categoryId: category.id,
              amount: Number(costItem.amount),
              percentage: (Number(costItem.amount) / totalCost) * 100,
            },
          })
        }
      }
    }

    // Create KPI values
    if (kpiValues.length > 0) {
      for (const kpiItem of kpiValues) {
        const kpi = await prisma.kpiDefinition.findFirst({
          where: {
            slug: kpiItem.kpiSlug,
            sectorId: user.sectorId,
          },
        })

        if (kpi) {
          await prisma.kpiValue.create({
            data: {
              snapshotId: snapshot.id,
              kpiId: kpi.id,
              value: Number(kpiItem.value),
              deltaPercent: kpi.targetValue
                ? ((Number(kpiItem.value) - Number(kpi.targetValue)) / Number(kpi.targetValue)) * 100
                : null,
              trend: kpiItem.trend || "NEUTRAL",
            },
          })
        }
      }
    }

    return NextResponse.json({ snapshot }, { status: 201 })
  } catch (error) {
    console.error("[API][SNAPSHOTS][POST]", error)
    return NextResponse.json({ error: "Failed to create snapshot" }, { status: 500 })
  }
}

