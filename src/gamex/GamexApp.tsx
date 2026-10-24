"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "./components/Header"
import Home from "./pages/Home"
import ArenaListing from "./pages/ArenaListing"
import ArenaDetails from "./pages/ArenaDetails"
import BookingFlow from "./pages/BookingFlow"
import Payment from "./pages/Payment"
import Confirmation from "./pages/Confirmation"
import Events from "./pages/Events"
import Dashboard, { type DashboardSection } from "./pages/Dashboard"
import {
  DEFAULT_ARENA,
  type BookingDraft,
  type ConfirmedBooking,
  type Page,
} from "./types"

export type SessionUser = {
  email: string
  id: number | string
  name: string
}

function tomorrowISO() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function createInitialBooking(): BookingDraft {
  return {
    ...DEFAULT_ARENA,
    device: "PC-2",
    dateISO: tomorrowISO(),
    time: "11:00 AM",
    durationHours: 2,
    rate: 80,
    quantity: 1,
  }
}

export default function GamexApp({
  initialPage = "home",
  initialUser = null,
  demoMode = false,
}: {
  initialPage?: Page
  initialUser?: SessionUser | null
  demoMode?: boolean
}) {
  const router = useRouter()
  const [page, setPage] = useState<Page>(initialPage)
  const [dashboardSection, setDashboardSection] =
    useState<DashboardSection>("bookings")
  const [user, setUser] = useState<SessionUser | null>(initialUser)
  const [bookingDraft, setBookingDraft] =
    useState<BookingDraft>(createInitialBooking)
  const [confirmedBookings, setConfirmedBookings] =
    useState<ConfirmedBooking[]>([])
  const [latestBooking, setLatestBooking] = useState<ConfirmedBooking | null>(
    null,
  )

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser)
      return
    }
    if (demoMode) {
      let demoUser: SessionUser = {
        email: "demo@gamex.local",
        id: "demo-player",
        name: "Demo Player",
      }
      try {
        const saved = window.localStorage.getItem("gamex-demo-session")
        if (saved)
          demoUser = { ...demoUser, ...JSON.parse(saved) as SessionUser }
      } catch {
        // Demo access remains available when browser storage is disabled.
      }
      setUser(demoUser)
      return
    }
    fetch("/api/auth/session")
      .then((response) => (response.ok ? response.json() : { user: null }))
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
  }, [demoMode, initialUser])

  useEffect(() => {
    if (!user) {
      setConfirmedBookings([])
      return
    }
    try {
      const stored = window.localStorage.getItem(`gamex-bookings:${user.id}`)
      setConfirmedBookings(
        stored ? JSON.parse(stored) as ConfirmedBooking[] : [],
      )
    } catch {
      setConfirmedBookings([])
    }
  }, [user])

  const saveConfirmedBooking = (booking: ConfirmedBooking) => {
    const next = [
      booking,
      ...confirmedBookings.filter((item) => item.id !== booking.id),
    ]
    setConfirmedBookings(next)
    if (user) {
      try {
        window.localStorage.setItem(
          `gamex-bookings:${user.id}`,
          JSON.stringify(next),
        )
      } catch {
        // Storage may be disabled; keep this session usable.
      }
    }
  }

  const navigate = (nextPage: Page) => {
    if (nextPage === "dashboard") {
      router.push(
        user
          ? `/dashboard${user.id === "demo-player" ? "?demo=1" : ""}`
          : "/login?next=/dashboard",
      )
      return
    }
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openProfile = () => {
    setDashboardSection("profile")
    setPage("dashboard")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const logout = async () => {
    if (user?.id === "demo-player") {
      try {
        window.localStorage.removeItem("gamex-demo-session")
      } catch {
        // Clear local UI even if storage is unavailable.
      }
    } else {
      try {
        await fetch("/api/auth/logout", { method: "POST" })
      } catch {
        // Clear local UI even if the network is unavailable.
      }
    }
    setUser(null)
    setConfirmedBookings([])
    setLatestBooking(null)
    setPage("home")
    router.push("/")
    router.refresh()
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100%" }}>
      <Header
        currentPage={page}
        onNavigate={navigate}
        loggedIn={Boolean(user)}
        userInitial={user?.name.charAt(0).toUpperCase()}
        onLogin={() => router.push("/login")}
        onSignUp={() => router.push("/signup")}
        onOpenProfile={openProfile}
        onLogout={logout}
      />

      {page === "home" && <Home onNavigate={navigate} />}
      {page === "arenas" && <ArenaListing onNavigate={navigate} />}
      {page === "arena-detail" && (
        <ArenaDetails
          onNavigate={navigate}
          onStartBooking={(device, quantity) => {
            const rate = device.startsWith("PS5")
              ? 120
              : device.startsWith("VR")
                ? 150
                : 80
            setBookingDraft({
              ...DEFAULT_ARENA,
              device,
              rate,
              quantity,
              dateISO: tomorrowISO(),
              time: "11:00 AM",
              durationHours: 2,
            })
            navigate("booking")
          }}
        />
      )}
      {page === "booking" && (
        <BookingFlow
          booking={bookingDraft}
          onNavigate={navigate}
          onContinue={(nextBooking) => {
            setBookingDraft(nextBooking)
            navigate("payment")
          }}
        />
      )}
      {page === "payment" && (
        <Payment
          booking={bookingDraft}
          onNavigate={navigate}
          onConfirm={(paymentMethod) => {
            const booking: ConfirmedBooking = {
              ...bookingDraft,
              id: `GX-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
              status: "Upcoming",
              paymentMethod,
              createdAt: new Date().toISOString(),
            }
            setLatestBooking(booking)
            saveConfirmedBooking(booking)
            navigate("confirmation")
          }}
        />
      )}
      {page === "confirmation" && (
        <Confirmation
          booking={latestBooking ?? confirmedBookings[0] ?? null}
          onNavigate={navigate}
        />
      )}
      {page === "events" && <Events onNavigate={navigate} />}
      {page === "dashboard" && user && (
        <Dashboard
          onNavigate={navigate}
          onLogout={logout}
          user={user}
          bookings={confirmedBookings}
          activeSection={dashboardSection}
          onSectionChange={setDashboardSection}
        />
      )}
    </div>
  )
}
