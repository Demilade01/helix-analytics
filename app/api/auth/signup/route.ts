import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import prisma from "@/lib/prisma"
import { getSessionCookie, serializeUser } from "@/lib/auth/session"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, sector, organization } = body ?? {}

    if (!email || !password || !sector || !organization) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 })
    }

    const sectorSlug = slugify(sector)
    const organizationSlug = `${sectorSlug}-${slugify(organization)}`

    // Find or create sector
    let sectorRecord = await prisma.sector.findUnique({
      where: { slug: sectorSlug },
    })

    if (!sectorRecord) {
      sectorRecord = await prisma.sector.create({
        data: { name: sector, slug: sectorSlug },
      })
    }

    // Find or create organization using the unique constraint (name, sectorId)
    let organizationRecord = await prisma.organization.findUnique({
      where: { name_sectorId: { name: organization, sectorId: sectorRecord.id } },
    })

    if (!organizationRecord) {
      organizationRecord = await prisma.organization.create({
        data: {
          name: organization,
          slug: organizationSlug,
          sectorId: sectorRecord.id,
        },
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        hashedPassword,
        sectorId: sectorRecord.id,
        organizationId: organizationRecord.id,
      },
      include: {
        sector: true,
        organization: true,
      },
    })

    const response = NextResponse.json({ user: serializeUser(user) }, { status: 201 })
    const sessionCookie = getSessionCookie(user.id)
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options)
    return response
  } catch (error) {
    console.error("[AUTH][SIGNUP]", error)
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 })
  }
}


