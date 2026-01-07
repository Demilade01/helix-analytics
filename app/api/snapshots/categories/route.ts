import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth/session"

// GET - Get available cost categories
export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const categories = await prisma.costCategory.findMany({
      orderBy: { sortOrder: "asc" },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("[API][SNAPSHOTS][CATEGORIES]", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

