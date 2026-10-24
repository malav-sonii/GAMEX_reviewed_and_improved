import { useState, useCallback } from 'react';
import IsometricFloorMap from '../components/IsometricFloorMap';
import CountdownRing from '../components/CountdownRing';
import PricingSparkline from '../components/PricingSparkline';

type Page = 'home' | 'arenas' | 'arena-detail' | 'booking' | 'payment' | 'confirmation' | 'events' | 'dashboard';

interface Props {
  onNavigate: (page: Page) => void;
  onStartBooking: (device: string, quantity: number) => void;
}

type StationStatus = 'open' | 'booked' | 'maintenance';

const pcStations: { id: string; status: StationStatus; row: number; col: number }[] = [
  { id: 'PC-1',  status: 'booked',       row: 0, col: 0 },
  { id: 'PC-2',  status: 'open',         row: 0, col: 1 },
  { id: 'PC-3',  status: 'open',         row: 0, col: 2 },
  { id: 'PC-4',  status: 'open',         row: 0, col: 3 },
  { id: 'PC-5',  status: 'maintenance',  row: 1, col: 0 },
  { id: 'PC-6',  status: 'open',         row: 1, col: 1 },
  { id: 'PC-7',  status: 'booked',       row: 1, col: 2 },
  { id: 'PC-8',  status: 'open',         row: 1, col: 3 },
  { id: 'PC-9',  status: 'open',         row: 2, col: 0 },
  { id: 'PC-10', status: 'booked',       row: 2, col: 1 },
  { id: 'PC-11', status: 'open',         row: 2, col: 2 },
  { id: 'PC-12', status: 'open',         row: 2, col: 3 },
];

const ps5Stations: { id: string; status: StationStatus; row: number; col: number }[] = [
  { id: 'PS5-1', status: 'booked', row: 0, col: 0 },
  { id: 'PS5-2', status: 'open',   row: 0, col: 1 },
  { id: 'PS5-3', status: 'open',   row: 1, col: 0 },
  { id: 'PS5-4', status: 'open',   row: 1, col: 1 },
];

const vrStations: { id: string; status: StationStatus; row: number; col: number }[] = [
  { id: 'VR-1', status: 'open',        row: 0, col: 0 },
  { id: 'VR-2', status: 'maintenance', row: 0, col: 1 },
];

const facilities = [
  { icon: '🖥️', count: '12 PC', sub: 'High-end rigs' },
  { icon: '🎮', count: '4 PS5', sub: 'Latest Gen' },
  { icon: '🥽', count: '2 VR', sub: 'Immersive' },
  { icon: '🍿', count: 'Snacks', sub: 'Available' },
  { icon: '❄️', count: 'AC', sub: 'Comfortable' },
  { icon: '🔊', count: 'Sound', sub: 'Surround' },
];

const imgs = [
  'https://images.unsplash.com/photo-1696710257827-75e2e5954059?w=800&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=300&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=300&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1636489953081-c4ebbd50fa3a?w=300&h=200&fit=crop&auto=format',
];

const MAX_SQUAD = 4;

export default function ArenaDetails({ onNavigate, onStartBooking }: Props) {
  const [activeTab, setActiveTab] = useState<'PC' | 'PS5' | 'VR'>('PC');
  const [selected, setSelected] = useState<string[]>([]);
  const [squadMode, setSquadMode] = useState(false);
  const [squadSize, setSquadSize] = useState(2);
  const [holdActive, setHoldActive] = useState(false);
  const [mapView, setMapView] = useState<'iso' | 'flat'>('iso');

  const currentStations = activeTab === 'PC' ? pcStations : activeTab === 'PS5' ? ps5Stations : vrStations;

  const handleSelect = useCallback((id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (squadMode && prev.length >= squadSize) return [...prev.slice(1), id];
      if (!squadMode && prev.length >= 1) return [id];
      const next = [...prev, id];
      if (next.length > 0 && !holdActive) setHoldActive(true);
      return next;
    });
  }, [squadMode, squadSize, holdActive]);

  const handleExpire = useCallback(() => {
    setSelected([]);
    setHoldActive(false);
  }, []);

  const openCount = currentStations.filter(s => s.status === 'open').length;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back */}
        <button onClick={() => onNavigate('arenas')} className="flex items-center gap-2 mb-6 text-sm transition-all" style={{ color: '#a09ab8' }}>
          <span>←</span> Back to Arenas
        </button>

        {/* Gallery */}
        <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '260px 140px' }}>
          <div className="relative overflow-hidden rounded-2xl row-span-2" style={{ background: '#1a1a28', gridRow: '1 / 3' }}>
            <img src={imgs[0]} alt="Main" className="w-full h-full object-cover" />
          </div>
          {imgs.slice(1).map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl" style={{ background: '#1a1a28' }}>
              <img src={img} alt={`Gallery ${i + 2}`} className="w-full h-full object-cover" />
              {i === 2 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(9,9,15,0.7)' }}>
                  <span className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>+12</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Nexus Gaming Lounge</h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span style={{ color: '#f59e0b' }}>★</span>
                    <span className="font-semibold" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>4.8</span>
                    <span className="text-sm" style={{ color: '#5c5778' }}>(320 reviews)</span>
                  </div>
                  <span style={{ color: '#3d3760' }}>•</span>
                  <span className="text-sm" style={{ color: '#5c5778' }}>📍 CG Road, Ahmedabad</span>
                </div>
              </div>
            </div>

            {/* Dynamic pricing sparkline */}
            <div className="mb-6">
              <PricingSparkline basePrice={80} />
            </div>

            <p className="text-sm mb-8" style={{ color: '#a09ab8', lineHeight: 1.7 }}>
              Premium gaming space with high-performance PCs, latest consoles and immersive VR setups. State-of-the-art hardware, ultra-fast internet, and a dedicated gaming atmosphere for both casual players and serious competitors.
            </p>

            {/* Facilities */}
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Facilities</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
              {facilities.map((f) => (
                <div key={f.count} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center" style={{ background: 'var(--card-2)', border: '1px solid var(--border)' }}>
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-xs font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{f.count}</span>
                  <span className="text-xs" style={{ color: '#5c5778' }}>{f.sub}</span>
                </div>
              ))}
            </div>

            {/* Device tabs */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Live Floor Map</h2>
              {/* Map view toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--card)' }}>
                {(['iso', 'flat'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setMapView(v)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: mapView === v ? 'rgba(139,92,246,0.2)' : 'transparent',
                      color: mapView === v ? '#a78bfa' : '#5c5778',
                      fontFamily: 'Space Grotesk',
                    }}
                  >
                    {v === 'iso' ? '3D View' : 'Grid View'}
                  </button>
                ))}
              </div>
            </div>

            {/* Device + Squad controls */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex gap-2">
                {(['PC', 'PS5', 'VR'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setSelected([]); setHoldActive(false); }}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: activeTab === tab ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'var(--card)',
                      color: activeTab === tab ? '#fff' : '#a09ab8',
                      border: activeTab === tab ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border)',
                      boxShadow: activeTab === tab ? '0 0 16px rgba(139,92,246,0.3)' : 'none',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    {tab} ({tab === 'PC' ? 12 : tab === 'PS5' ? 4 : 2})
                  </button>
                ))}
              </div>

              {/* Squad mode toggle */}
              <button
                onClick={() => { setSquadMode(!squadMode); setSelected([]); setHoldActive(false); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ml-auto"
                style={{
                  background: squadMode ? 'rgba(236,72,153,0.15)' : 'var(--card)',
                  color: squadMode ? '#ec4899' : '#a09ab8',
                  border: squadMode ? '1px solid rgba(236,72,153,0.4)' : '1px solid var(--border)',
                  boxShadow: squadMode ? '0 0 16px rgba(236,72,153,0.2)' : 'none',
                  fontFamily: 'Space Grotesk',
                }}
              >
                👥 Squad Mode {squadMode ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Squad size picker */}
            {squadMode && (
              <div
                className="flex items-center gap-4 p-4 rounded-xl mb-5"
                style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}
              >
                <span className="text-sm font-medium" style={{ fontFamily: 'Space Grotesk', color: '#ec4899' }}>Party Size</span>
                <div className="flex items-center gap-2">
                  {[2, 3, 4].map(n => (
                    <button
                      key={n}
                      onClick={() => { setSquadSize(n); setSelected([]); setHoldActive(false); }}
                      className="w-9 h-9 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: squadSize === n ? 'rgba(236,72,153,0.25)' : 'var(--bg-2)',
                        color: squadSize === n ? '#ec4899' : '#5c5778',
                        border: squadSize === n ? '1px solid rgba(236,72,153,0.5)' : '1px solid var(--border)',
                        fontFamily: 'IBM Plex Mono',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <span className="text-xs" style={{ color: '#5c5778' }}>Select up to {squadSize} adjacent stations</span>
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: '#5c5778' }}>
              {[
                { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: 'Open' },
                { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'Booked' },
                { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', label: 'Maintenance' },
                { color: '#a78bfa', bg: 'rgba(139,92,246,0.15)', border: '#8b5cf6', label: 'Selected' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ background: l.bg, border: `1px solid ${l.border}` }} />
                  <span style={{ color: l.color }}>{l.label}</span>
                </div>
              ))}
              <span className="ml-auto" style={{ fontFamily: 'IBM Plex Mono', color: '#3d3760' }}>{openCount} open · {currentStations.length} total</span>
            </div>

            {/* Floor map */}
            {mapView === 'iso' ? (
              <IsometricFloorMap
                stations={currentStations}
                selected={selected}
                onSelect={handleSelect}
                squadMode={squadMode}
              />
            ) : (
              // Flat grid fallback
              <div className="grid gap-3 p-4 rounded-2xl" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', background: 'rgba(9,9,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {currentStations.map((st) => {
                  const isSel = selected.includes(st.id);
                  let topColor = '#10b981', bg = 'rgba(16,185,129,0.05)', border = 'rgba(16,185,129,0.3)';
                  if (isSel) { topColor = '#a78bfa'; bg = 'rgba(139,92,246,0.15)'; border = '#8b5cf6'; }
                  else if (st.status === 'booked') { topColor = '#ef4444'; bg = 'rgba(239,68,68,0.05)'; border = 'rgba(239,68,68,0.3)'; }
                  else if (st.status === 'maintenance') { topColor = '#f59e0b'; bg = 'rgba(245,158,11,0.05)'; border = 'rgba(245,158,11,0.3)'; }

                  return (
                    <div
                      key={st.id}
                      onClick={() => st.status === 'open' && handleSelect(st.id)}
                      className="rounded-xl p-3 text-center transition-all"
                      style={{ background: bg, border: `1px solid ${border}`, cursor: st.status === 'open' ? 'pointer' : 'default', boxShadow: isSel ? `0 0 16px rgba(139,92,246,0.4)` : 'none' }}
                    >
                      <div className="font-bold text-xs mb-0.5" style={{ fontFamily: 'IBM Plex Mono', color: '#f0eeff' }}>{st.id}</div>
                      <div className="text-xs" style={{ color: topColor }}>{isSel ? '✓ Sel.' : st.status === 'open' ? 'Open' : st.status === 'booked' ? 'Booked' : 'Maint.'}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: booking card */}
          <div>
            <div className="rounded-2xl p-6 sticky top-24 space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Book a Session</h3>

              {/* Selected stations */}
              {selected.length > 0 ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selected.map(id => (
                      <div
                        key={id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                        style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}
                      >
                        <span className="text-xs font-bold" style={{ fontFamily: 'IBM Plex Mono', color: '#a78bfa' }}>{id}</span>
                        <button
                          onClick={() => setSelected(prev => prev.filter(s => s !== id))}
                          className="text-xs leading-none"
                          style={{ color: '#5c5778' }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                  {/* Countdown */}
                  <CountdownRing key={selected[0]} seconds={180} onExpire={handleExpire} />
                </div>
              ) : (
                <div className="p-3 rounded-xl text-sm text-center" style={{ background: 'var(--bg-2)', color: '#5c5778', border: '1px dashed var(--border)' }}>
                  {squadMode ? `Select ${squadSize} stations for your squad` : 'Select a station from the floor map'}
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#5c5778' }}>Rate</span>
                  <span style={{ fontFamily: 'IBM Plex Mono', color: '#f0eeff' }}>₹80/hr</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#5c5778' }}>Stations</span>
                  <span style={{ fontFamily: 'IBM Plex Mono', color: selected.length > 0 ? '#a78bfa' : '#3d3760' }}>
                    {selected.length > 0 ? `${selected.length} selected` : '—'}
                  </span>
                </div>
                {selected.length > 0 && (
                  <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <span className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Est. Total</span>
                    <span className="font-black" style={{ fontFamily: 'IBM Plex Mono', color: '#a78bfa', fontSize: 16 }}>₹{80 * selected.length}/hr</span>
                  </div>
                )}
              </div>

              <button
                className="btn-primary w-full py-3 text-sm"
                disabled={selected.length === 0}
                style={{ opacity: selected.length > 0 ? 1 : 0.5, cursor: selected.length > 0 ? 'pointer' : 'not-allowed' }}
                onClick={() => selected.length > 0 && onStartBooking(selected.join(', '), selected.length)}
              >
                {selected.length > 0
                  ? squadMode ? `Book Squad (${selected.length} stations)` : `Book ${selected[0]}`
                  : 'Select a Station'}
              </button>

              {squadMode && selected.length < squadSize && selected.length > 0 && (
                <p className="text-xs text-center" style={{ color: '#f59e0b' }}>
                  Select {squadSize - selected.length} more station{squadSize - selected.length > 1 ? 's' : ''}
                </p>
              )}

              <p className="text-xs text-center" style={{ color: '#3d3760' }}>Free cancellation up to 1 hr before</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
