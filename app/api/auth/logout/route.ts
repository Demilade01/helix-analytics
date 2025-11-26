import { NextResponse } from "next/server"

import { clearSessionCookie } from "@/lib/auth/session"

export async function POST() {
  const response = NextResponse.json({ success: true })
  const sessionCookie = clearSessionCookie()
  response.cookies.delete(sessionCookie.name)
  return response
}


