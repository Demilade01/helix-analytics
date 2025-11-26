import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import prisma from "@/lib/prisma"
import { getSessionCookie, serializeUser } from "@/lib/auth/session"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body ?? {}

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        sector: true,
        organization: true,
      },
    })

    if (!user || !user.hashedPassword) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 })
    }

    const response = NextResponse.json({ user: serializeUser(user) })
    const sessionCookie = getSessionCookie(user.id)
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options)
    return response
  } catch (error) {
    console.error("[AUTH][LOGIN]", error)
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 })
  }
}


