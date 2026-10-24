type Page = 'home' | 'arenas' | 'arena-detail' | 'booking' | 'payment' | 'confirmation' | 'events' | 'dashboard';

interface Props {
  onNavigate: (page: Page) => void;
}

const events = [
  {
    id: 1,
    name: 'Valorant Local Showdown',
    game: 'Valorant',
    date: '14 Sep',
    time: '5:00 PM',
    entry: '₹200',
    prize: '₹15,000',
    slots: '6 / 16 teams',
    progress: 6 / 16,
    accent: '#ec4899',
    glow: 'rgba(236,72,153,0.2)',
    tag: 'Team Event',
    img: 'https://images.unsplash.com/photo-1548003693-b55d51032288?w=700&h=400&fit=crop&auto=format',
    spots: 10,
  },
  {
    id: 2,
    name: 'FIFA 1v1 Friday Cup',
    game: 'FIFA',
    date: '19 Sep',
    time: '6:30 PM',
    entry: '₹100',
    prize: '₹4,000',
    slots: '22 / 32 players',
    progress: 22 / 32,
    accent: '#06b6d4',
    glow: 'rgba(6,182,212,0.2)',
    tag: '1v1',
    img: 'https://images.unsplash.com/photo-1558008258-7ff8888b42b0?w=700&h=400&fit=crop&auto=format',
    spots: 10,
  },
  {
    id: 3,
    name: 'CS2 Weekend League',
    game: 'CS2',
    date: '27 Sep',
    time: '3:00 PM',
    entry: '₹500',
    prize: '₹30,000',
    slots: '3 / 10 teams',
    progress: 3 / 10,
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.2)',
    tag: 'League',
    img: 'https://images.unsplash.com/photo-1558742619-fd82741daa99?w=700&h=400&fit=crop&auto=format',
    spots: 7,
  },
];

export default function Events({ onNavigate }: Props) {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
      {/* Header */}
      <div
        className="py-14 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.08) 0%, transparent 100%)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 60%)' }} />
        <div className="relative">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            🏆 Tournament Season 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Upcoming Events</h1>
          <p style={{ color: '#a09ab8', fontSize: 16 }}>Compete, connect and prove your skills.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="card card-hover overflow-hidden"
              style={{ borderColor: `${ev.accent}22` }}
            >
              <div className="grid md:grid-cols-5">
                {/* Image */}
                <div className="md:col-span-2 relative overflow-hidden" style={{ background: '#1a1a28', minHeight: 200 }}>
                  <img src={ev.img} alt={ev.name} className="w-full h-full object-cover absolute inset-0" />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to right, transparent 60%, rgba(19,19,30,0.95))` }}
                  />
                  <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to top, rgba(19,19,30,0.9) 0%, transparent 50%)' }} />

                  {/* Game tag */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${ev.accent}25`, color: ev.accent, border: `1px solid ${ev.accent}50` }}
                    >
                      {ev.tag}
                    </span>
                  </div>

                  {/* Prize overlay on mobile */}
                  <div className="absolute bottom-3 left-3 md:hidden">
                    <div className="text-xs" style={{ color: '#a09ab8' }}>Prize Pool</div>
                    <div className="text-xl font-black" style={{ fontFamily: 'IBM Plex Mono, monospace', color: ev.accent }}>{ev.prize}</div>
                  </div>
                </div>

                {/* Info */}
                <div className="md:col-span-3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-black mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{ev.name}</h3>
                        <div className="flex items-center gap-3 text-sm" style={{ color: '#5c5778' }}>
                          <span>📅 {ev.date} · {ev.time}</span>
                        </div>
                      </div>
                      <div className="hidden md:block text-right">
                        <div className="text-xs mb-0.5" style={{ color: '#5c5778' }}>Prize Pool</div>
                        <div className="text-2xl font-black" style={{ fontFamily: 'IBM Plex Mono, monospace', color: ev.accent }}>{ev.prize}</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Entry Fee', value: ev.entry },
                        { label: 'Registered', value: ev.slots },
                        { label: 'Spots Left', value: `${ev.spots}` },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="p-3 rounded-xl"
                          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
                        >
                          <div className="text-xs mb-1" style={{ color: '#5c5778' }}>{label}</div>
                          <div className="text-sm font-bold" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#f0eeff' }}>{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mb-5">
                      <div className="flex justify-between text-xs mb-1.5" style={{ color: '#5c5778' }}>
                        <span>Registration</span>
                        <span>{Math.round(ev.progress * 100)}% filled</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${ev.progress * 100}%`, background: `linear-gradient(90deg, ${ev.accent}, ${ev.accent}aa)` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="btn-primary px-6 py-2.5 text-sm"
                      style={{ background: `linear-gradient(135deg, ${ev.accent}, ${ev.accent}cc)`, borderColor: `${ev.accent}50` }}
                    >
                      Register Now
                    </button>
                    <button className="px-4 py-2.5 text-sm rounded-xl" style={{ color: '#a09ab8', border: '1px solid var(--border)' }}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Past events teaser */}
        <div className="mt-12 text-center">
          <p className="text-sm mb-3" style={{ color: '#5c5778' }}>Want to see past tournament results?</p>
          <button className="text-sm font-medium" style={{ color: '#a78bfa' }}>View Tournament History →</button>
        </div>
      </div>
    </div>
  );
}
