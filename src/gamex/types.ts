export type Page =
  | 'home'
  | 'arenas'
  | 'arena-detail'
  | 'booking'
  | 'payment'
  | 'confirmation'
  | 'events'
  | 'dashboard'

export type BookingDraft = {
  arena: string
  location: string
  device: string
  dateISO: string
  time: string
  durationHours: number
  rate: number
  quantity: number
  img: string
}

export type ConfirmedBooking = BookingDraft & {
  id: string
  status: 'Upcoming' | 'Completed'
  paymentMethod: 'demo'
  createdAt: string
}

export const DEFAULT_ARENA = {
  arena: 'Nexus Gaming Lounge',
  location: 'CG Road, Ahmedabad',
  img: 'https://images.unsplash.com/photo-1696710257827-75e2e5954059?w=800&h=500&fit=crop&auto=format',
}

export function formatBookingDate(dateISO: string) {
  const date = new Date(`${dateISO}T12:00:00`)
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatTimeRange(time: string, durationHours: number) {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return `${time} · ${durationHours} hr${durationHours === 1 ? '' : 's'}`
  let hour = Number(match[1]) % 12
  const minute = Number(match[2])
  if (match[3].toUpperCase() === 'PM') hour += 12
  const endMinutes = (hour * 60 + minute + durationHours * 60) % (24 * 60)
  const endHour24 = Math.floor(endMinutes / 60)
  const endHour = endHour24 % 12 || 12
  const endPeriod = endHour24 >= 12 ? 'PM' : 'AM'
  const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')} ${endPeriod}`
  return `${time} – ${endTime}`
}
