'use client'

import { useState } from 'react'
import type { BookingDraft, Page } from '../types'
import { formatBookingDate, formatTimeRange } from '../types'

interface Props {
  booking: BookingDraft
  onNavigate: (page: Page) => void
  onContinue: (booking: BookingDraft) => void
}

const times = ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
const durations = [1, 2, 3, 4]
const steps = ['Device', 'Date & Time', 'Details', 'Payment']

function nextDays(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    date.setDate(date.getDate() + index + 1)
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    return {
      iso,
      day: new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(date),
      date: date.getDate(),
      month: new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(date),
    }
  })
}

export default function BookingFlow({ booking, onNavigate, onContinue }: Props) {
  const dates = nextDays(7)
  const [selectedDate, setSelectedDate] = useState(dates.some((date) => date.iso === booking.dateISO) ? booking.dateISO : dates[0].iso)
  const [selectedTime, setSelectedTime] = useState(booking.time)
  const [selectedDuration, setSelectedDuration] = useState(booking.durationHours)
  const total = booking.rate * selectedDuration * booking.quantity

  function continueToPayment() {
    onContinue({ ...booking, dateISO: selectedDate, time: selectedTime, durationHours: selectedDuration, quantity: booking.quantity })
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Complete Your Booking</h1>
            <p className="text-sm mt-1" style={{ color: '#a09ab8' }}>{booking.arena} · {booking.device}</p>
          </div>
          <button onClick={() => onNavigate('arena-detail')} className="text-sm" style={{ color: '#a09ab8' }}>← Back</button>
        </div>

        <div className="flex items-center gap-0 mb-10" aria-label="Booking progress">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: index === 1 ? 'rgba(139,92,246,0.2)' : 'var(--card)', border: index === 1 ? '2px solid #8b5cf6' : '1px solid var(--border)', color: index === 1 ? '#a78bfa' : '#5c5778' }}>{index + 1}</div>
                <span className="text-xs hidden sm:block whitespace-nowrap" style={{ color: index === 1 ? '#f0eeff' : '#5c5778' }}>{step}</span>
              </div>
              {index < steps.length - 1 && <div className="flex-1 h-px mx-3" style={{ background: 'var(--border)' }} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="card p-6">
              <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Select Date</h2>
              <div className="flex gap-3 scroll-x pb-2">
                {dates.map((date) => (
                  <button key={date.iso} aria-pressed={selectedDate === date.iso} onClick={() => setSelectedDate(date.iso)} className="flex flex-col items-center gap-1 px-5 py-4 rounded-xl border transition-all flex-shrink-0" style={{ background: selectedDate === date.iso ? 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.1))' : 'var(--card-2)', border: selectedDate === date.iso ? '1px solid rgba(139,92,246,0.5)' : '1px solid var(--border)' }}>
                    <span className="text-xs" style={{ color: selectedDate === date.iso ? '#a78bfa' : '#5c5778' }}>{date.day}</span>
                    <span className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{date.date}</span>
                    <span className="text-xs" style={{ color: '#a09ab8' }}>{date.month}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Select Time Slot</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {times.map((time) => <button key={time} aria-pressed={selectedTime === time} onClick={() => setSelectedTime(time)} className="py-2.5 rounded-xl text-sm font-medium border transition-all" style={{ background: selectedTime === time ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'var(--card-2)', border: selectedTime === time ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border)', color: selectedTime === time ? '#fff' : '#a09ab8', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}>{time}</button>)}
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Duration</h2>
              <div className="flex gap-3">
                {durations.map((duration) => <button key={duration} aria-pressed={selectedDuration === duration} onClick={() => setSelectedDuration(duration)} className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all" style={{ background: selectedDuration === duration ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'var(--card-2)', border: selectedDuration === duration ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border)', color: selectedDuration === duration ? '#fff' : '#a09ab8' }}>{duration} {duration === 1 ? 'hr' : 'hrs'}</button>)}
              </div>
            </section>
          </div>

          <aside>
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Booking Summary</h3>
              <div className="flex items-center gap-4 p-4 rounded-xl mb-5" style={{ background: 'var(--bg-2)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(139,92,246,0.15)' }}>🎮</div>
                <div><div className="font-bold" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#a78bfa' }}>{booking.device}</div><div className="text-xs mt-1" style={{ color: '#a09ab8' }}>{booking.quantity} station{booking.quantity === 1 ? '' : 's'}</div><div className="text-xs mt-0.5" style={{ color: '#a09ab8' }}>{booking.arena}</div></div>
              </div>
              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between gap-4"><span style={{ color: '#5c5778' }}>Date</span><span className="text-right">{formatBookingDate(selectedDate)}</span></div>
                <div className="flex justify-between gap-4"><span style={{ color: '#5c5778' }}>Time</span><span className="text-right">{formatTimeRange(selectedTime, selectedDuration)}</span></div>
                <div className="flex justify-between"><span style={{ color: '#5c5778' }}>Duration</span><span>{selectedDuration} {selectedDuration === 1 ? 'hour' : 'hours'}</span></div>
                <div className="flex justify-between"><span style={{ color: '#5c5778' }}>Rate</span><span>₹{booking.rate}/hr</span></div>
              </div>
              <div className="py-4 mb-5" style={{ borderTop: '1px solid var(--border)' }}><div className="flex justify-between items-center"><span className="font-semibold">Estimated total</span><span className="text-2xl font-black" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#a78bfa' }}>₹{total}</span></div></div>
              <button className="btn-primary w-full py-3" onClick={continueToPayment}>Continue to checkout →</button>
              <p className="text-xs mt-3 leading-5" style={{ color: '#77718f' }}>Availability is a prototype preview. A live booking system must confirm the slot before payment.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
