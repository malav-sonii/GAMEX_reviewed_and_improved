"use client"
// The dashboard can still open with an in-memory demo profile if storage is unavailable.
import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Mode = "login" | "signup" | "forgot" | "reset"
type Result = {
  ok: boolean
  error?: string
  fields?: Record<string, string>
  message?: string
  redirectTo?: string
}

const content = {
  login: {
    eyebrow: "Welcome back",
    title: "Enter the arena",
    subtitle: "Sign in to manage bookings, squads and achievements.",
    button: "Login to GAMEX",
  },
  signup: {
    eyebrow: "Create your player ID",
    title: "Join the next match",
    subtitle: "Create a secure account and start booking premium play spaces.",
    button: "Create Account",
  },
  forgot: {
    eyebrow: "Account recovery",
    title: "Reset your password",
    subtitle: "Enter your account email and we’ll send a secure reset link.",
    button: "Send Reset Link",
  },
  reset: {
    eyebrow: "Choose a new password",
    title: "Secure your account",
    subtitle: "Use at least 8 characters for your new GAMEX password.",
    button: "Update Password",
  },
} satisfies Record<Mode, {
  eyebrow: string
  title: string
  subtitle: string
  button: string
}>

export default function AuthPage({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const copy = content[mode]
  const isPasswordMode =
    mode === "login" || mode === "signup" || mode === "reset"

  function enterDemo() {
    try {
      window.localStorage.setItem(
        "gamex-demo-session",
        JSON.stringify({
          email: "demo@gamex.local",
          id: "demo-player",
          name: "Demo Player",
        }),
      )
    } catch {}
    router.push("/dashboard?demo=1")
    router.refresh()
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setResult(null)

    const form = new FormData(event.currentTarget)
    const body = Object.fromEntries(form.entries())
    const searchParams = new URLSearchParams(window.location.search)
    body.next = searchParams.get("next") ?? "/dashboard"
    body.token = searchParams.get("token") ?? ""

    try {
      const response = await fetch(
        `/api/auth/${
          mode === "forgot"
            ? "forgot-password"
            : mode === "reset"
              ? "reset-password"
              : mode
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      )
      const payload: unknown = await response.json().catch(() => ({}))
      const data: Result =
        payload && typeof payload === "object"
          ? payload as Result
          : {
              ok: false,
              error: "We could not complete that request. Please try again.",
            }
      if (!response.ok && !data.error)
        data.error = "We could not complete that request. Please try again."
      setResult(data)

      if (data.ok && data.redirectTo) {
        router.push(data.redirectTo)
        router.refresh()
      }
    } catch {
      setResult({
        ok: false,
        error:
          "Unable to reach the server. Check your connection and try again.",
      })
    } finally {
      setPending(false)
    }
  }

  const fieldClass = (field: string) =>
    `w-full rounded-xl border bg-transparent px-4 py-3.5 text-sm outline-none transition-all ${
      result?.fields?.[field]
        ? "border-red-500/70 focus:border-red-400"
        : "border-white/10 focus:border-violet-500/70"
    }`

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090f] px-4 py-24 text-[#f0eeff]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(139,92,246,0.18),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(236,72,153,0.1),transparent_30%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#13131e]/90 shadow-2xl shadow-violet-950/30 backdrop-blur-2xl md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-violet-600/25 via-[#0f0f1a] to-pink-500/15 p-10 md:flex">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold tracking-tight"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500">
              G
            </span>
            GAME<span className="gradient-text -ml-3">X</span>
          </Link>
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
              Ahmedabad gaming network
            </p>
            <h2 className="text-4xl font-black leading-tight">
              Your next great session starts here.
            </h2>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["14", "Venues"],
                ["8", "Game types"],
                ["24/7", "Access"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-black/20 p-3"
                >
                  <div className="font-mono text-lg font-bold text-violet-300">
                    {value}
                  </div>
                  <div className="mt-1 text-xs text-[#a09ab8]">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs leading-relaxed text-[#5c5778]">
            Real account sessions use a secure, HTTP-only cookie. Demo progress
            stays in this browser.
          </p>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-[#a09ab8] transition-colors hover:text-white"
          >
            ← Back to GAMEX
          </Link>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-violet-400">
            {copy.eyebrow}
          </p>
          <h1 className="mb-3 text-3xl font-black sm:text-4xl">{copy.title}</h1>
          <p className="mb-8 max-w-md text-sm leading-6 text-[#a09ab8]">
            {copy.subtitle}
          </p>

          {result?.error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {result.error}
            </div>
          )}
          {result?.message && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
            >
              {result.message}
            </div>
          )}

          <form onSubmit={submit} noValidate className="space-y-5">
            {mode === "signup" && (
              <Field label="Player name" error={result?.fields?.name}>
                <input
                  name="name"
                  autoComplete="name"
                  className={fieldClass("name")}
                  placeholder="Malav"
                />
              </Field>
            )}
            {mode !== "reset" && (
              <Field label="Email address" error={result?.fields?.email}>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={fieldClass("email")}
                  placeholder="you@example.com"
                />
              </Field>
            )}
            {isPasswordMode && (
              <Field
                label={mode === "reset" ? "New password" : "Password"}
                error={result?.fields?.password}
              >
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    className={`${fieldClass("password")} pr-20`}
                    placeholder={
                      mode === "login"
                        ? "Enter your password"
                        : "At least 8 characters"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-violet-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>
            )}
            {(mode === "signup" || mode === "reset") && (
              <Field
                label="Confirm password"
                error={result?.fields?.confirmPassword}
              >
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={fieldClass("confirmPassword")}
                  placeholder="Repeat your password"
                />
              </Field>
            )}

            {mode === "login" && (
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-violet-300 hover:text-violet-200"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full py-3.5 text-sm disabled:cursor-wait disabled:opacity-70"
            >
              {pending ? "Please wait…" : copy.button}
            </button>
          </form>

          {(mode === "login" || mode === "signup") && (
            <div className="mt-5">
              <button
                type="button"
                onClick={enterDemo}
                className="w-full rounded-xl border border-violet-400/30 bg-violet-400/5 px-4 py-3.5 text-sm font-semibold text-violet-200 transition-colors hover:border-violet-300/60 hover:bg-violet-400/10"
              >
                Try demo account
              </button>
              <p className="mt-2 text-center text-xs text-[#77718f]">
                No account or password needed. Demo bookings stay on this device.
              </p>
            </div>
          )}

          <div className="mt-7 text-center text-sm text-[#a09ab8]">
            {mode === "login" && (
              <>
                New to GAMEX?{" "}
                <Link href="/signup" className="font-semibold text-violet-300">
                  Create an account
                </Link>
              </>
            )}
            {mode === "signup" && (
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-violet-300">
                  Login
                </Link>
              </>
            )}
            {(mode === "forgot" || mode === "reset") && (
              <Link href="/login" className="font-semibold text-violet-300">
                Return to login
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

function Field({
  children,
  error,
  label,
}: {
  children: React.ReactNode
  error?: string
  label: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#c4bde8]">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-2 block text-xs text-red-400">{error}</span>
      )}
    </label>
  )
}
