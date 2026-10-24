import { redirect } from "next/navigation"
import GamexApp from "@/gamex/GamexApp"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>
}) {
  const { demo } = await searchParams
  if (demo === "1") {
    return <GamexApp initialPage="dashboard" demoMode />
  }

  const { appAuth } = await import("@/lib/app-auth")
  const user = await appAuth.currentUser()
  if (!user) redirect("/login?next=/dashboard")

  return (
    <GamexApp
      initialPage="dashboard"
      initialUser={{
        email: user.email,
        id: user.id,
        name: user.name?.trim() || user.email.split("@")[0],
      }}
    />
  )
}
