import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth/session"

// GET - Get available KPIs for the user's sector
export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user || !user.sectorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const kpis = await prisma.kpiDefinition.findMany({
      where: {
        OR: [{ sectorId: user.sectorId }, { sectorId: null }], // Sector-specific or global KPIs
      },
      orderBy: { label: "asc" },
    })

    return NextResponse.json({ kpis })
  } catch (error) {
    console.error("[API][SNAPSHOTS][KPIS]", error)
    return NextResponse.json({ error: "Failed to fetch KPIs" }, { status: 500 })
  }
}

