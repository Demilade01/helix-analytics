import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { getSessionUser, serializeUser } from "@/lib/auth/session"

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, email } = body ?? {}

    // Validate email if provided
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })
      if (existingUser) {
        return NextResponse.json({ error: "Email is already in use." }, { status: 409 })
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email && email !== user.email && { email }),
      },
      include: {
        sector: true,
        organization: true,
      },
    })

    return NextResponse.json({ user: serializeUser(updatedUser) })
  } catch (error) {
    console.error("[API][USER][UPDATE]", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

