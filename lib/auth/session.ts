import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

import prisma from "@/lib/prisma"
import type { AppUser } from "@/lib/types/user"
import type { Organization, Sector, User } from "@/app/generated/prisma/client"

const AUTH_COOKIE_NAME = "helix_session"
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN && process.env.JWT_EXPIRES_IN.trim().length > 0
    ? process.env.JWT_EXPIRES_IN
    : "7d"

type UserWithRelations = User & {
  sector?: Sector | null
  organization?: Organization | null
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not set. Please add it to your environment variables.")
  }
  return secret
}

function signToken(userId: string) {
  // @ts-ignore
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN })
}

function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as jwt.JwtPayload
  } catch {
    return null
  }
}

export async function getUserFromToken(token: string) {
  const payload = verifyToken(token)
  if (!payload?.sub) {
    return null
  }

  return prisma.user.findUnique({
    where: { id: payload.sub },
    include: {
      sector: true,
      organization: true,
    },
  })
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  if (!token) {
    return null
  }
  return getUserFromToken(token)
}

export function getSessionCookie(userId: string) {
  const token = signToken(userId)
  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: AUTH_COOKIE_MAX_AGE,
    },
  }
}

export function clearSessionCookie() {
  return {
    name: AUTH_COOKIE_NAME,
  }
}

export function serializeUser(user: UserWithRelations): AppUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    sector: user.sector?.name ?? null,
    organization: user.organization?.name ?? null,
  }
}


