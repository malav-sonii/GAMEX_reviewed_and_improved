import { NextResponse } from "next/server"
import { validateEmail } from "@/lib/auth-validation"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const email = validateEmail(body.email)
  if (email.error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Check the highlighted field.",
        fields: { email: email.error },
      },
      { status: 400 },
    )
  }

  try {
    const { getPayloadClient } = await import("@/lib/payload")
    const payload = await getPayloadClient()
    await payload.forgotPassword({
      collection: "users",
      data: { email: email.value },
      overrideAccess: false,
    })
  } catch {
    // Keep the response identical so account existence is never disclosed.
  }

  return NextResponse.json({
    ok: true,
    message:
      "If an account exists for that email, password reset instructions have been sent.",
  })
}
