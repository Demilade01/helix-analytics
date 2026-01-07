import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth/session"

// GET - Get available departments for the user's organization
export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user || !user.organizationId || !user.sectorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orgDepts = await prisma.organizationDepartment.findMany({
      where: { organizationId: user.organizationId },
      include: { department: true },
    })

    const departments = orgDepts.map((od) => ({
      id: od.department.id,
      name: od.department.name,
      code: od.department.code,
    }))

    return NextResponse.json({ departments })
  } catch (error) {
    console.error("[API][SNAPSHOTS][DEPARTMENTS]", error)
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 })
  }
}

