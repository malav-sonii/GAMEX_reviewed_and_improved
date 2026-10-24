import { NextResponse } from "next/server"
import {
  safeRedirect,
  validateEmail,
  validatePassword,
} from "@/lib/auth-validation"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const email = validateEmail(body.email)
  const password = validatePassword(body.password)
  const fields = {
    ...(email.error ? { email: email.error } : {}),
    ...(password.error ? { password: password.error } : {}),
  }

  if (Object.keys(fields).length) {
    return NextResponse.json(
      { ok: false, error: "Check the highlighted fields.", fields },
      { status: 400 },
    )
  }

  try {
    const { appAuth } = await import("@/lib/app-auth")
    await appAuth.login(email.value, password.value)
    return NextResponse.json({ ok: true, redirectTo: safeRedirect(body.next) })
  } catch {
    return NextResponse.json(
      { ok: false, error: "Email or password is incorrect." },
      { status: 401 },
    )
  }
}
