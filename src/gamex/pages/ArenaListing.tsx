import { useState } from 'react';

type Page = 'home' | 'arenas' | 'arena-detail' | 'booking' | 'payment' | 'confirmation' | 'events' | 'dashboard';

interface Props {
  onNavigate: (page: Page) => void;
}

const arenas = [
  {
    id: 1,
    name: 'Nexus Gaming Lounge',
    location: 'CG Road, Ahmedabad',
    rating: 4.8,
    reviews: 320,
    price: '₹80',
    facilities: [{ icon: 'PC', label: '12 PC' }, { icon: 'P5', label: '4 PS5' }, { icon: 'VR', label: '2 VR' }],
    popular: true,
    img: 'https://images.unsplash.com/photo-1696710257827-75e2e5954059?w=600&h=400&fit=crop&auto=format',
    tags: ['PC', 'PS5', 'VR'],
  },
  {
    id: 2,
    name: 'Pixel Palace Gaming',
    location: 'SG Highway, Ahmedabad',
    rating: 4.6,
    reviews: 214,
    price: '₹70',
    facilities: [{ icon: 'PC', label: '20 PC' }, { icon: 'P5', label: '6 PS5' }, { icon: 'VR', label: '3 VR' }],
    popular: true,
    img: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=600&h=400&fit=crop&auto=format',
    tags: ['PC', 'PS5', 'VR'],
  },
  {
    id: 3,
    name: 'Xtreme Zone',
    location: 'Bopal, Ahmedabad',
    rating: 4.5,
    reviews: 176,
    price: '₹60',
    facilities: [{ icon: 'PC', label: '8 PC' }, { icon: 'P5', label: '2 PS5' }],
    popular: false,
    img: 'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=600&h=400&fit=crop&auto=format',
    tags: ['PC', 'PS5'],
  },
  {
    id: 4,
    name: 'Alpha Esports Hub',
    location: 'Navrangpura, Ahmedabad',
    rating: 4.7,
    reviews: 98,
    price: '₹90',
    facilities: [{ icon: 'PC', label: '16 PC' }, { icon: 'P5', label: '8 PS5' }, { icon: 'VR', label: '4 VR' }],
    popular: false,
    img: 'https://images.unsplash.com/photo-1636489953081-c4ebbd50fa3a?w=600&h=400&fit=crop&auto=format',
    tags: ['PC', 'PS5', 'VR'],
  },
  {
    id: 5,
    name: 'StrikeZone Bowling Club',
    location: 'Prahlad Nagar, Ahmedabad',
    rating: 4.8,
    reviews: 264,
    price: '₹299',
    facilities: [{ icon: '10', label: '10 Lanes' }, { icon: 'AR', label: 'Arcade' }, { icon: 'FO', label: 'Food' }],
    popular: true,
    img: 'https://images.unsplash.com/photo-1650314200456-a19942fd1c19?w=600&h=400&fit=crop&auto=format',
    tags: ['Bowling'],
  },
  {
    id: 6,
    name: 'Velocity F1 Sim Arena',
    location: 'Sindhu Bhavan Road, Ahmedabad',
    rating: 4.9,
    reviews: 187,
    price: '₹350',
    facilities: [{ icon: 'F1', label: '6 F1 Rigs' }, { icon: 'VR', label: 'VR Racing' }, { icon: 'PR', label: 'Pro Setup' }],
    popular: true,
    img: 'https://images.unsplash.com/photo-1743649978995-c76212449e15?w=600&h=400&fit=crop&auto=format',
    tags: ['F1 Simulator', 'VR'],
  },
  {
    id: 7,
    name: 'Respawn Esports Cafe',
    location: 'Thaltej, Ahmedabad',
    rating: 4.7,
    reviews: 143,
    price: '₹100',
    facilities: [{ icon: 'PC', label: '24 PC' }, { icon: 'P5', label: '6 PS5' }, { icon: 'VR', label: '2 VR' }],
    popular: false,
    img: 'https://images.unsplash.com/photo-1633545505446-586bf83717f0?w=600&h=400&fit=crop&auto=format',
    tags: ['PC', 'PS5', 'VR'],
  },
  {
    id: 8,
    name: 'Neon Pins & Play',
    location: 'Science City, Ahmedabad',
    rating: 4.6,
    reviews: 119,
    price: '₹249',
    facilities: [{ icon: '08', label: '8 Lanes' }, { icon: 'AR', label: 'Arcade' }, { icon: 'P5', label: '4 PS5' }],
    popular: false,
    img: 'https://images.unsplash.com/photo-1650313525165-40c8132c0ae0?w=600&h=400&fit=crop&auto=format',
    tags: ['Bowling', 'PS5'],
  },
  {
    id: 9,
    name: 'Apex Racing Lounge',
    location: 'South Bopal, Ahmedabad',
    rating: 4.7,
    reviews: 92,
    price: '₹300',
    facilities: [{ icon: 'F1', label: '4 F1 Rigs' }, { icon: 'GT', label: 'GT Racing' }, { icon: 'PC', label: '8 PC' }],
    popular: false,
    img: 'https://images.unsplash.com/photo-1771440571270-e27b63085a48?w=600&h=400&fit=crop&auto=format',
    tags: ['F1 Simulator', 'PC'],
  },
  {
    id: 10,
    name: 'GameGrid Arena',
    location: 'Chandkheda, Ahmedabad',
    rating: 4.5,
    reviews: 84,
    price: '₹75',
    facilities: [{ icon: 'PC', label: '14 PC' }, { icon: 'P5', label: '4 PS5' }, { icon: 'VR', label: '2 VR' }],
    popular: false,
    img: 'https://images.unsplash.com/photo-1633545495735-25df17fb9f31?w=600&h=400&fit=crop&auto=format',
    tags: ['PC', 'PS5', 'VR'],
  },
  {
    id: 11,
    name: 'Level Up Gaming Hub',
    location: 'Maninagar, Ahmedabad',
    rating: 4.5,
    reviews: 76,
    price: '₹70',
    facilities: [{ icon: 'PC', label: '12 PC' }, { icon: 'P5', label: '6 PS5' }, { icon: 'AR', label: 'Arcade' }],
    popular: false,
    img: 'https://images.unsplash.com/photo-1633545491399-54a16aa6a871?w=600&h=400&fit=crop&auto=format',
    tags: ['PC', 'PS5'],
  },
  {
    id: 12,
    name: 'Eastside Esports Studio',
    location: 'Vastral, Ahmedabad',
    rating: 4.4,
    reviews: 61,
    price: '₹65',
    facilities: [{ icon: 'PC', label: '10 PC' }, { icon: 'P5', label: '4 PS5' }, { icon: 'VR', label: '2 VR' }],
    popular: false,
    img: 'https://images.unsplash.com/photo-1598550487031-0898b4852123?w=600&h=400&fit=crop&auto=format',
    tags: ['PC', 'PS5', 'VR'],
  },
  {
    id: 13,
    name: 'The Break Room Pool Club',
    location: 'Satellite, Ahmedabad',
    rating: 4.7,
    reviews: 138,
    price: '₹180',
    facilities: [{ icon: '8B', label: '8-Ball' }, { icon: '06', label: '6 Tables' }, { icon: 'PR', label: 'Pro Cues' }],
    popular: true,
    img: 'https://images.unsplash.com/photo-1575553939928-d03b21323afe?w=600&h=400&fit=crop&auto=format',
    tags: ['Pool'],
  },
  {
    id: 14,
    name: 'Green Baize Snooker Lounge',
    location: 'Motera, Ahmedabad',
    rating: 4.8,
    reviews: 104,
    price: '₹220',
    facilities: [{ icon: 'SN', label: 'Snooker' }, { icon: '04', label: '4 Tables' }, { icon: 'PR', label: 'Pro Cues' }],
    popular: false,
    img: 'https://images.unsplash.com/photo-1668367274956-f17df8a5ba19?w=600&h=400&fit=crop&auto=format',
    tags: ['Snooker'],
  },
];

const filters = ['All', 'PC', 'PS5', 'VR', 'Bowling', 'F1 Simulator', 'Pool', 'Snooker'];

export default function ArenaListing({ onNavigate }: Props) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = arenas.filter((a) => {
    const matchFilter = activeFilter === 'All' || a.tags.includes(activeFilter);
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
      {/* Page header */}
      <div
        className="py-12 px-4"
        style={{
          background: 'linear-gradient(180deg, rgba(139,92,246,0.08) 0%, transparent 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Ahmedabad Arenas</h1>
          <p style={{ color: '#a09ab8' }}>Explore gaming, bowling, racing, pool and snooker venues across the city</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + filters row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl flex-1"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#5c5778' }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Search city, area or arena name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ color: '#f0eeff' }}
            />
          </div>

          {/* Location */}
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <span style={{ color: '#5c5778' }}>📍</span>
            <span className="text-sm font-medium" style={{ color: '#f0eeff' }}>Ahmedabad · All Areas</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#5c5778' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Filter pills + sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 scroll-x">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  background: activeFilter === f ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'var(--card)',
                  color: activeFilter === f ? '#fff' : '#a09ab8',
                  border: activeFilter === f ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border)',
                  boxShadow: activeFilter === f ? '0 0 16px rgba(139,92,246,0.3)' : 'none',
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <span className="text-sm" style={{ color: '#5c5778' }}>Sort by:</span>
            <span className="text-sm font-medium" style={{ color: '#f0eeff' }}>Popular</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#5c5778' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Arena cards */}
        <div className="flex flex-col gap-5">
          {filtered.map((arena) => (
            <div
              key={arena.id}
              className="card card-hover grid grid-cols-1 cursor-pointer overflow-hidden md:grid-cols-[260px_minmax(0,1fr)]"
              onClick={() => onNavigate('arena-detail')}
            >
              {/* Image */}
              <div className="relative h-44 min-h-0 overflow-hidden bg-[#1a1a28] md:h-full md:min-h-[180px]">
                <img src={arena.img} alt={arena.name} className="w-full h-full object-cover absolute inset-0" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 70%, rgba(19,19,30,0.8))' }} />
                {arena.popular && (
                  <span
                    className="absolute top-3 left-3 badge-popular text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    🔥 Popular
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between p-4 sm:p-6">
                <div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="mb-1 break-words text-lg font-bold sm:text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{arena.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: '#5c5778' }}>
                        <span>📍</span> {arena.location}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xl font-bold sm:text-2xl" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#a78bfa' }}>{arena.price}</div>
                      <div className="text-xs" style={{ color: '#5c5778' }}>/hour</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-4">
                    <span style={{ color: '#f59e0b' }}>★</span>
                    <span className="font-semibold text-sm" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{arena.rating}</span>
                    <span className="text-sm" style={{ color: '#5c5778' }}>({arena.reviews} reviews)</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {arena.facilities.map((d) => (
                      <div
                        key={d.label}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm sm:px-3"
                        style={{ background: 'rgba(139,92,246,0.08)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.15)' }}
                      >
                        <span className="text-xs font-bold" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{d.icon}</span>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <button
                    className="btn-primary w-full px-6 py-2.5 text-sm sm:w-auto"
                    onClick={(e) => { e.stopPropagation(); onNavigate('arena-detail'); }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: '#5c5778' }}>
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">No arenas found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
