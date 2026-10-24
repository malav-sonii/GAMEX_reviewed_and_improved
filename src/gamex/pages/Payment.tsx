'use client'

import { useState } from 'react'
import type { BookingDraft, Page } from '../types'
import { formatBookingDate, formatTimeRange } from '../types'

interface Props {
  booking: BookingDraft
  onNavigate: (page: Page) => void
  onConfirm: (paymentMethod: 'demo') => void
}

export default function Payment({ booking, onNavigate, onConfirm }: Props) {
  const [processing, setProcessing] = useState(false)
  const total = booking.rate * booking.durationHours * booking.quantity

  function confirmDemoBooking() {
    if (processing) return
    setProcessing(true)
    window.setTimeout(() => onConfirm('demo'), 500)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Checkout Preview</h1>
          <button onClick={() => onNavigate('booking')} className="text-sm" style={{ color: '#a09ab8' }}>← Back</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <section className="lg:col-span-3">
            <div className="card p-6 sm:p-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}>🧪</div>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Demo checkout</h2>
              <p className="text-sm leading-6 mb-5" style={{ color: '#a09ab8' }}>This project is not connected to a payment provider yet. Confirming below creates a clearly marked prototype booking only; no money is charged.</p>
              <div role="note" className="rounded-xl p-4 text-sm leading-6" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>
                For your safety, do not enter card numbers, CVV, UPI IDs, or banking credentials on this demo screen.
              </div>
              <button className="btn-primary w-full py-4 text-base font-bold mt-6 disabled:opacity-60" onClick={confirmDemoBooking} disabled={processing}>
                {processing ? 'Confirming demo booking…' : `Confirm demo booking · ₹${total}`}
              </button>
              <p className="text-xs text-center mt-3" style={{ color: '#77718f' }}>No real payment will be processed.</p>
            </div>
          </section>

          <aside className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-base mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Booking Summary</h3>
              <div className="flex items-center gap-4 p-4 rounded-xl mb-5" style={{ background: 'var(--bg-2)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <img src={booking.img} alt="Gaming arena" className="w-14 h-14 rounded-xl object-cover" />
                <div><div className="font-semibold text-sm">{booking.arena}</div><div className="text-xs mt-1" style={{ color: '#a09ab8' }}>{booking.location}</div></div>
              </div>
              <div className="space-y-3 text-sm mb-5">
                {[
                  ['Device', booking.device],
                  ['Date', formatBookingDate(booking.dateISO)],
                  ['Time', formatTimeRange(booking.time, booking.durationHours)],
                  ['Duration', `${booking.durationHours} ${booking.durationHours === 1 ? 'hour' : 'hours'}`],
                  ['Rate', `₹${booking.rate}/station/hr`],
                  ['Stations', `${booking.quantity}`],
                ].map(([label, value]) => <div key={label} className="flex justify-between gap-4"><span style={{ color: '#77718f' }}>{label}</span><span className="text-right">{value}</span></div>)}
              </div>
              <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}><div className="flex justify-between items-center"><span className="font-bold">Total</span><span className="text-xl font-black" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#a78bfa' }}>₹{total}</span></div><p className="text-xs mt-2" style={{ color: '#77718f' }}>Platform fee: Free</p></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
