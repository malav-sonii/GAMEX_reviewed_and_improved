import { useState } from 'react';
import AchievementBadges from '../components/AchievementBadges';
import type { ConfirmedBooking } from '../types';
import { formatBookingDate, formatTimeRange } from '../types';

type Page = 'home' | 'arenas' | 'arena-detail' | 'booking' | 'payment' | 'confirmation' | 'events' | 'dashboard';

export type DashboardSection = 'bookings' | 'profile' | 'notifications' | 'settings';

interface Props {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onSectionChange: (section: DashboardSection) => void;
  activeSection: DashboardSection;
  user: { email: string; name: string };
  bookings: ConfirmedBooking[];
}

export default function Dashboard({ onNavigate, onLogout, onSectionChange, activeSection, user, bookings: savedBookings }: Props) {
  const activeNav = activeSection;
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [settings, setSettings] = useState({ email: true, sms: false, tournaments: true, offers: false });

  const navItems: { id: DashboardSection; label: string; icon: string }[] = [
    { id: 'bookings', label: 'My Bookings', icon: '📋' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const bookings = savedBookings
    .filter((booking) => activeTab === 'upcoming' ? booking.status === 'Upcoming' : booking.status === 'Completed')
    .map((booking) => ({
      ...booking,
      date: formatBookingDate(booking.dateISO),
      time: formatTimeRange(booking.time, booking.durationHours),
      amount: `₹${booking.rate * booking.durationHours * booking.quantity}`,
      img: booking.img,
    }));

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 64 }} className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 flex-col border-r z-40 ${mobileMenu ? 'flex' : 'hidden md:flex'}`}
        style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}
      >
        {/* User */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{user.name}</div>
              <div className="text-xs" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#5c5778' }}>GAMEX PLAYER</div>
            </div>
          </div>
          {/* Membership */}
          <div
            className="flex items-center justify-between mt-4 p-3 rounded-xl"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            <div className="flex items-center gap-2">
              <span>🎮</span>
              <span className="text-sm font-semibold" style={{ color: '#a78bfa' }}>GAMEX Member</span>
            </div>
            <span className="text-xs font-medium" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#10b981' }}>{savedBookings.length} bookings</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left mb-1 transition-all"
              style={{
                background: activeNav === item.id ? 'rgba(139,92,246,0.1)' : 'transparent',
                color: activeNav === item.id ? '#a78bfa' : '#a09ab8',
                border: activeNav === item.id ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
            style={{ color: '#ef4444', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 14 }}
            onClick={onLogout}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-6">
        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex items-center gap-2 mb-4 text-sm"
          style={{ color: '#a09ab8' }}
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          ☰ Menu
        </button>

        {activeNav === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>My Bookings</h1>
              <button className="btn-primary px-4 py-2 text-sm" onClick={() => onNavigate('arenas')}>+ New Booking</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: 'var(--card)' }}>
              {(['upcoming', 'past'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className="px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                  style={{
                    background: activeTab === t ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
                    color: activeTab === t ? '#fff' : '#a09ab8',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="card p-5 flex items-center gap-5"
                >
                  <img
                    src={b.img}
                    alt={b.arena}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    style={{ background: '#1a1a28' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-base truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{b.arena}</h3>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ml-2 ${b.status === 'Upcoming' ? 'badge-upcoming' : 'badge-open'}`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: '#5c5778' }}>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{b.device}</span>
                      <span>📅 {b.date}</span>
                      <span>⏰ {b.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <span className="font-bold text-base" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#a78bfa' }}>{b.amount}</span>
                    <button
                      className="text-xs font-medium px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="text-center py-16" style={{ color: '#5c5778' }}>
                  <div className="text-5xl mb-4">🎮</div>
                  <p className="text-lg font-medium">No bookings yet</p>
                  <p className="text-sm mt-1 mb-6">Book your first gaming session!</p>
                  <button className="btn-primary px-6 py-3" onClick={() => onNavigate('arenas')}>Find an Arena</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeNav === 'profile' && (
          <div>
            <h1 className="text-2xl font-black mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>My Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile card */}
              <div className="lg:col-span-1">
                <div className="card p-6 text-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-black mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{user.name}</h2>
                  <p className="text-sm mb-3" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#5c5778' }}>GAMEX PLAYER</p>
                  <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
                    🎮 GAMEX Member
                  </div>
                  <p className="text-xs leading-5" style={{ color: '#77718f' }}>Booking history is stored locally in this browser for the prototype.</p>
                </div>
              </div>

              {/* Stats */}
              <div className="lg:col-span-2 space-y-4">
                <div className="card p-6">
                  <h3 className="font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Gaming Stats</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Hours Booked', value: `${savedBookings.reduce((total, booking) => total + booking.durationHours * booking.quantity, 0)} hrs`, color: '#a78bfa' },
                      { label: 'Arenas Booked', value: String(new Set(savedBookings.map((booking) => booking.arena)).size), color: '#06b6d4' },
                      { label: 'Tournaments', value: 'Not connected', color: '#ec4899' },
                    ].map((s) => (
                      <div key={s.label} className="p-4 rounded-xl" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                        <div className="text-2xl font-black mb-1" style={{ fontFamily: 'IBM Plex Mono, monospace', color: s.color }}>{s.value}</div>
                        <div className="text-xs" style={{ color: '#5c5778' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <AchievementBadges />
                </div>

                <div className="card p-6">
                  <h3 className="font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Account Details</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Email', value: user.email },
                      { label: 'Saved bookings', value: String(savedBookings.length) },
                    ].map((d) => (
                      <div key={d.label} className="flex justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                        <span className="text-sm" style={{ color: '#5c5778' }}>{d.label}</span>
                        <span className="text-sm font-medium" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#f0eeff', fontSize: 12 }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs mt-4" style={{ color: '#77718f' }}>Profile editing will be available when account updates are connected.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'notifications' && (
          <div>
            <h1 className="text-2xl font-black mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Notifications</h1>
            <div className="flex flex-col gap-3">
              {savedBookings.map((booking) => ({ icon: '✅', title: 'Demo booking created', sub: `${booking.device} at ${booking.arena} on ${formatBookingDate(booking.dateISO)}`, time: new Date(booking.createdAt).toLocaleDateString(), unread: true })).map((n, i) => (
                <div
                  key={i}
                  className="card p-4 flex items-start gap-4"
                  style={{ borderColor: n.unread ? 'rgba(139,92,246,0.2)' : 'var(--border)', background: n.unread ? 'rgba(139,92,246,0.03)' : 'var(--card)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'var(--bg-2)' }}>
                    {n.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{n.title}</span>
                      {n.unread && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#8b5cf6' }} />}
                    </div>
                    <p className="text-xs mt-0.5 mb-1" style={{ color: '#5c5778' }}>{n.sub}</p>
                    <span className="text-xs" style={{ color: '#3d3760' }}>{n.time}</span>
                  </div>
                </div>
              ))}
              {savedBookings.length === 0 && <div className="card p-6 text-sm" style={{ color: '#a09ab8' }}>No booking notifications yet. Your demo booking updates will appear here.</div>}
            </div>
          </div>
        )}

        {activeNav === 'settings' && (
          <div>
            <h1 className="text-2xl font-black mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Settings</h1>
            <div className="card p-6 max-w-lg">
              <div className="space-y-5">
                {[
                  { key: 'email' as const, label: 'Email Notifications', sub: 'Booking confirmations & reminders' },
                  { key: 'sms' as const, label: 'SMS Alerts', sub: 'Session start reminders' },
                  { key: 'tournaments' as const, label: 'Tournament Updates', sub: 'Get notified about new tournaments' },
                  { key: 'offers' as const, label: 'Promotional Offers', sub: 'Discounts and special events' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#5c5778' }}>{s.sub}</div>
                    </div>
                    <button
                      type="button"
                      className="w-12 h-6 rounded-full relative cursor-pointer flex-shrink-0 transition-all"
                      role="switch"
                      aria-checked={settings[s.key]}
                      aria-label={s.label}
                      onClick={() => setSettings((current) => ({ ...current, [s.key]: !current[s.key] }))}
                      style={{ background: settings[s.key] ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'var(--bg-2)', border: '1px solid var(--border)' }}
                    >
                      <span className="w-4 h-4 rounded-full absolute top-0.5 transition-all" style={{ left: settings[s.key] ? '26px' : '2px', background: '#fff' }} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-4" style={{ color: '#77718f' }}>These switches are prototype-only preferences and are not connected to email, SMS, or notification services.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
