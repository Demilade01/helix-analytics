import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth/session"

export async function GET(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || !user.organizationId || !user.sectorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all snapshots for the organization, grouped by period
    const snapshots = await prisma.profitabilitySnapshot.findMany({
      where: {
        organizationId: user.organizationId,
        sectorId: user.sectorId,
      },
      orderBy: { periodEnd: "desc" },
      take: 12, // Last 12 snapshots
    })

    // Generate reports from snapshots
    const reports = snapshots.map((snapshot, index) => {
      const periodEnd = new Date(snapshot.periodEnd)
      const month = periodEnd.toLocaleString("default", { month: "long" })
      const year = periodEnd.getFullYear()
      const quarter = Math.floor(periodEnd.getMonth() / 3) + 1

      // Determine report type based on period
      let reportType = "Performance"
      let title = `${month} ${year} Performance Summary`

      if (index === 0) {
        // Most recent - could be Q4, Q3, etc.
        title = `Q${quarter} ${year} Financial Report`
        reportType = "Financial"
      } else if (index % 3 === 0) {
        // Every 3rd snapshot - quarterly
        title = `Q${quarter} ${year} Financial Report`
        reportType = "Financial"
      } else if (index % 6 === 0) {
        // Every 6th snapshot - compliance
        title = `Q${quarter} ${year} Compliance Report`
        reportType = "Compliance"
      } else if (index % 4 === 0) {
        // Every 4th snapshot - risk
        title = `${month} ${year} Risk Assessment Analysis`
        reportType = "Risk"
      }

      // Determine status (most recent is published, older ones might be drafts)
      const status = index < 3 ? "Published" : index < 6 ? "Published" : "Draft"

      return {
        id: snapshot.id,
        title,
        date: snapshot.periodEnd.toISOString().split("T")[0],
        type: reportType,
        status,
        periodStart: snapshot.periodStart.toISOString().split("T")[0],
        periodEnd: snapshot.periodEnd.toISOString().split("T")[0],
        revenue: Number(snapshot.revenue),
        cost: Number(snapshot.cost),
        profit: Number(snapshot.profit),
        grossMargin: snapshot.grossMargin,
        operatingMargin: snapshot.operatingMargin,
        netMargin: snapshot.netMargin,
      }
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("[API][REPORTS]", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

