import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { appAuth } = await import("@/lib/app-auth")
    const user = await appAuth.currentUser()
    return NextResponse.json({
      user: user
        ? {
            email: user.email,
            id: user.id,
            name: user.name ?? user.email.split("@")[0],
          }
        : null,
    })
  } catch {
    // The public frontend remains usable when the optional CMS backend is offline.
    return NextResponse.json({ user: null })
  }
}
