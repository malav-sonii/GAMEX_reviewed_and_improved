import { NextResponse } from "next/server"

import {
  safeRedirect,
  validateEmail,
  validatePassword,
} from "@/lib/auth-validation"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))

  const name = typeof body.name === "string" ? body.name.trim() : ""
  const email = validateEmail(body.email)
  const password = validatePassword(body.password, true)

  const fields = {
    ...(!name ? { name: "Name is required." } : {}),
    ...(name.length > 80
      ? { name: "Name must be 80 characters or fewer." }
      : {}),
    ...(email.error ? { email: email.error } : {}),
    ...(password.error ? { password: password.error } : {}),
    ...(body.confirmPassword !== password.value
      ? { confirmPassword: "Passwords do not match." }
      : {}),
  }

  if (Object.keys(fields).length) {
    return NextResponse.json(
      { ok: false, error: "Check the highlighted fields.", fields },
      { status: 400 },
    )
  }

  try {
    const { getPayloadClient } = await import("@/lib/payload")
    const { appAuth } = await import("@/lib/app-auth")
    const payload = await getPayloadClient()

    await payload.create({
      collection: "users",
      data: { name, email: email.value, password: password.value },
      overrideAccess: false,
    })

    await appAuth.login(email.value, password.value)

    return NextResponse.json(
      { ok: true, redirectTo: safeRedirect(body.next) },
      { status: 201 },
    )
  } catch (error) {
    const message =
      error instanceof Error && /unique|already|duplicate/i.test(error.message)
        ? "An account with this email already exists."
        : process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : "We could not create your account. Please try again."

    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
