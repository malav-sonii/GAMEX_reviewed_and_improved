import { NextResponse } from "next/server"

export async function POST() {
  try {
    const { appAuth } = await import("@/lib/app-auth")
    await appAuth.logout()
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: "Sign out is unavailable right now." },
      { status: 503 },
    )
  }
}
