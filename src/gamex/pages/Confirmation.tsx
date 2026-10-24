import type { ConfirmedBooking, Page } from '../types'
import { formatBookingDate, formatTimeRange } from '../types'

interface Props {
  booking: ConfirmedBooking | null
  onNavigate: (page: Page) => void
}

export default function Confirmation({ booking, onNavigate }: Props) {
  if (!booking) {
    return <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)', paddingTop: 80 }}><div className="card max-w-lg p-8 text-center"><h1 className="text-2xl font-bold mb-3">No booking to show</h1><p className="text-sm mb-6" style={{ color: '#a09ab8' }}>Complete the checkout preview first to create a demo booking.</p><button className="btn-primary px-6 py-3" onClick={() => onNavigate('arenas')}>Browse arenas</button></div></main>
  }

  const total = booking.rate * booking.durationHours * booking.quantity
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)', paddingTop: 80 }}>
      <div className="max-w-lg w-full mx-auto px-4 py-12 text-center">
        <div className="relative inline-flex items-center justify-center mb-8"><div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.5)', boxShadow: '0 0 40px rgba(16,185,129,0.2)' }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg></div></div>
        <h1 className="text-4xl font-black mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Demo Booking Created</h1>
        <p className="text-sm mb-8 leading-6" style={{ color: '#a09ab8' }}>Your booking details are saved in this browser for the prototype. This is not a live venue reservation and no payment was taken.</p>

        <div className="rounded-2xl p-6 mb-6 text-left" style={{ background: 'var(--card)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl mb-5" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}><span className="text-xs" style={{ color: '#a09ab8' }}>Demo booking ID</span><span className="font-bold text-sm" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#a78bfa' }}>{booking.id}</span></div>
          <div className="space-y-4">
            {[
              ['Arena', booking.arena],
              ['Location', booking.location],
              ['Device', booking.device],
              ['Stations', String(booking.quantity)],
              ['Date', formatBookingDate(booking.dateISO)],
              ['Time', formatTimeRange(booking.time, booking.durationHours)],
              ['Duration', `${booking.durationHours} ${booking.durationHours === 1 ? 'hour' : 'hours'}`],
              ['Demo total', `₹${total}`],
            ].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-4 py-2" style={{ borderBottom: '1px solid var(--border)' }}><span className="text-sm" style={{ color: '#77718f' }}>{label}</span><span className="text-sm font-semibold text-right">{value}</span></div>)}
          </div>
        </div>
        <div role="note" className="rounded-xl p-4 mb-6 text-sm leading-6 text-left" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>Prototype only: venue availability, payment processing, and server-side booking storage still need to be integrated before accepting real customers.</div>
        <button className="btn-primary w-full py-4 mb-4 text-base font-bold" onClick={() => onNavigate('dashboard')}>View My Bookings</button>
        <button className="w-full py-3 text-sm" style={{ color: '#a09ab8' }} onClick={() => onNavigate('home')}>Back to Home</button>
      </div>
    </main>
  )
}
