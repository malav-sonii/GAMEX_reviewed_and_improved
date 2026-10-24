type Page = 'home' | 'arenas' | 'arena-detail' | 'booking' | 'payment' | 'confirmation' | 'events' | 'dashboard';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const arenas = [
  {
    id: 1,
    name: 'Nexus Gaming Lounge',
    location: 'CG Road, Ahmedabad',
    rating: 4.8,
    price: '₹80',
    pc: 12, ps5: 4, vr: 2,
    img: 'https://images.unsplash.com/photo-1696710257827-75e2e5954059?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: 2,
    name: 'Pixel Palace Gaming',
    location: 'SG Highway, Ahmedabad',
    rating: 4.6,
    price: '₹70',
    pc: 20, ps5: 6, vr: 3,
    img: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&h=500&fit=crop&auto=format',
  },
  {
    id: 3,
    name: 'Velocity F1 Sim Arena',
    location: 'Sindhu Bhavan Road, Ahmedabad',
    rating: 4.9,
    price: '₹350',
    pc: 0, ps5: 0, vr: 6,
    img: 'https://images.unsplash.com/photo-1743649978995-c76212449e15?w=800&h=500&fit=crop&auto=format',
  },
];

const features = [
  { icon: '🖥️', title: 'High-End Setups', sub: 'PC · PS5 · VR' },
  { icon: '⚡', title: 'Easy Booking', sub: 'Book in under 60 seconds' },
  { icon: '🏆', title: 'Events & Tournaments', sub: 'Compete. Win. Belong.' },
  { icon: '🎮', title: 'Gaming Community', sub: 'Meet your squad' },
];

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ paddingTop: 80 }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop&auto=format"
            alt="Gaming arena"
            className="w-full h-full object-cover"
            style={{ opacity: 0.35 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(9,9,15,0.6) 0%, rgba(9,9,15,0.85) 60%, #09090f 100%)',
            }}
          />
          {/* Purple glow orb */}
          <div
            className="absolute"
            style={{
              top: '20%', left: '50%', transform: 'translateX(-50%)',
              width: 600, height: 400,
              background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', display: 'inline-block' }} />
            Ahmedabad&apos;s premium play destinations
          </div>

          <h1
            className="font-black mb-6 leading-none"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(56px, 10vw, 120px)', letterSpacing: '-2px' }}
          >
            <span style={{ display: 'block', color: '#f0eeff' }}>PLAY.</span>
            <span className="gradient-text" style={{ display: 'block' }}>BOOK.</span>
            <span style={{ display: 'block', color: '#f0eeff' }}>BELONG.</span>
          </h1>

          <p
            className="text-lg mb-10"
            style={{ color: '#a09ab8', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.6 }}
          >
            Gaming, bowling, racing, pool and snooker experiences across Ahmedabad.
          </p>

          {/* Search bar */}
          <div
            className="flex flex-col sm:flex-row items-center gap-3 p-2 rounded-2xl max-w-xl mx-auto"
            style={{
              background: 'rgba(19,19,30,0.9)',
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow: '0 0 40px rgba(139,92,246,0.1)',
            }}
          >
            <div className="flex items-center flex-1 gap-3 px-3 w-full">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#5c5778', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                className="flex-1 bg-transparent text-sm outline-none"
                placeholder="Search city or arena..."
                style={{ color: '#f0eeff', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <button
              className="btn-primary px-6 py-3 text-sm w-full sm:w-auto whitespace-nowrap"
              onClick={() => onNavigate('arenas')}
            >
              Find Arenas
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: '#3d3760' }}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #3d3760, transparent)' }} />
        </div>
      </section>

      {/* Feature strip */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                >
                  {f.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f0eeff' }}>{f.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#5c5778' }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Arenas */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Popular Arenas</h2>
            <p className="text-sm" style={{ color: '#5c5778' }}>Top-rated spots in your city</p>
          </div>
          <button
            onClick={() => onNavigate('arenas')}
            className="text-sm font-medium flex items-center gap-1 transition-all hover:gap-2"
            style={{ color: '#a78bfa' }}
          >
            View All <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {arenas.map((arena) => (
            <div
              key={arena.id}
              className="card card-hover overflow-hidden cursor-pointer"
              onClick={() => onNavigate('arena-detail')}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden" style={{ background: '#1a1a28' }}>
                <img src={arena.img} alt={arena.name} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(9,9,15,0.8) 0%, transparent 60%)' }}
                />
                <span
                  className="absolute top-3 left-3 badge-popular text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  🔥 Popular
                </span>
                <span
                  className="absolute bottom-3 right-3 text-sm font-bold"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#a78bfa' }}
                >
                  {arena.price}/hr
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-base mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{arena.name}</h3>
                <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: '#5c5778' }}>
                  <span>📍</span> {arena.location}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <span style={{ color: '#f59e0b' }}>★</span>
                    <span className="font-semibold" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{arena.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[{ label: 'PC', count: arena.pc }, { label: 'PS5', count: arena.ps5 }, { label: 'VR', count: arena.vr }].map((d) => (
                      <span
                        key={d.label}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}
                      >
                        {d.count} {d.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div
          className="rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.1) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <div
            className="absolute inset-0 rounded-3xl"
            style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
          />
          <h2 className="text-4xl font-black mb-4 relative" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Ready to Level Up?
          </h2>
          <p className="mb-8 relative" style={{ color: '#a09ab8' }}>
            Book your gaming session in under 60 seconds.
          </p>
          <button
            className="btn-primary px-8 py-4 text-base relative"
            onClick={() => onNavigate('arenas')}
          >
            Book a Session Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--border)', color: '#3d3760' }}>
        © 2026 GAMEX. All rights reserved. Built for gamers, by gamers.
      </footer>
    </div>
  );
}
