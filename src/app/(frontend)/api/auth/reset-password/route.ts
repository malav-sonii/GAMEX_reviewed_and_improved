import { NextResponse } from "next/server"
import { validatePassword } from "@/lib/auth-validation"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const password = validatePassword(body.password, true)
  const token = typeof body.token === "string" ? body.token : ""
  const fields = {
    ...(password.error ? { password: password.error } : {}),
    ...(body.confirmPassword !== password.value
      ? { confirmPassword: "Passwords do not match." }
      : {}),
  }

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "This reset link is invalid or expired." },
      { status: 400 },
    )
  }
  if (Object.keys(fields).length) {
    return NextResponse.json(
      { ok: false, error: "Check the highlighted fields.", fields },
      { status: 400 },
    )
  }

  try {
    const { getPayloadClient } = await import("@/lib/payload")
    const payload = await getPayloadClient()
    const result = await payload.resetPassword({
      collection: "users",
      data: { password: password.value, token },
      overrideAccess: false,
    })
    const email =
      "email" in result.user && typeof result.user.email === "string"
        ? result.user.email
        : null
    if (email) {
      const { appAuth } = await import("@/lib/app-auth")
      await appAuth.login(email, password.value)
    }
    return NextResponse.json({ ok: true, redirectTo: "/dashboard" })
  } catch {
    return NextResponse.json(
      { ok: false, error: "This reset link is invalid or expired." },
      { status: 400 },
    )
  }
}
