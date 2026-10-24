import { useState } from 'react';

interface Badge {
  id: string;
  icon: string;
  name: string;
  desc: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

const BADGES: Badge[] = [
  { id: 'first', icon: '🎮', name: 'First Boot', desc: 'Completed your first booking', unlocked: true, rarity: 'common', unlockedAt: 'Jan 2026' },
  { id: 'nightowl', icon: '🦉', name: 'Night Owl', desc: 'Booked a session after 10 PM', unlocked: true, rarity: 'rare', unlockedAt: 'Feb 2026' },
  { id: 'gold', icon: '🥇', name: 'Gold Member', desc: 'Reached Gold membership tier', unlocked: true, rarity: 'epic', unlockedAt: 'Mar 2026' },
  { id: 'squad', icon: '👥', name: 'Squad Goals', desc: 'Used squad booking for 4+ stations', unlocked: true, rarity: 'rare', unlockedAt: 'Sep 2026' },
  { id: 'veteran', icon: '🏆', name: 'Tournament Veteran', desc: 'Registered for 3 tournaments', unlocked: false, rarity: 'epic' },
  { id: 'streak', icon: '🔥', name: 'On Fire', desc: 'Booked 5 sessions in a week', unlocked: false, rarity: 'legendary' },
  { id: 'vr', icon: '🥽', name: 'VR Pioneer', desc: 'Tried every device type', unlocked: false, rarity: 'rare' },
  { id: 'perfect', icon: '⭐', name: 'Perfect Score', desc: 'Received a 5-star review', unlocked: false, rarity: 'common' },
];

const RARITY_STYLES: Record<Badge['rarity'], { border: string; glow: string; label: string; color: string }> = {
  common:    { border: 'rgba(160,154,184,0.3)', glow: 'rgba(160,154,184,0.15)', label: 'Common', color: '#a09ab8' },
  rare:      { border: 'rgba(6,182,212,0.4)', glow: 'rgba(6,182,212,0.2)', label: 'Rare', color: '#06b6d4' },
  epic:      { border: 'rgba(139,92,246,0.5)', glow: 'rgba(139,92,246,0.25)', label: 'Epic', color: '#a78bfa' },
  legendary: { border: 'rgba(245,158,11,0.6)', glow: 'rgba(245,158,11,0.3)', label: 'Legendary', color: '#f59e0b' },
};

export default function AchievementBadges() {
  const [hovered, setHovered] = useState<string | null>(null);

  const unlocked = BADGES.filter(b => b.unlocked).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Achievements</h3>
          <p className="text-xs mt-0.5" style={{ color: '#5c5778' }}>{unlocked} / {BADGES.length} unlocked</p>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full" style={{ width: `${(unlocked / BADGES.length) * 100}%`, background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }} />
          </div>
          <span className="text-xs" style={{ fontFamily: 'IBM Plex Mono', color: '#5c5778' }}>{Math.round((unlocked / BADGES.length) * 100)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {BADGES.map(badge => {
          const rs = RARITY_STYLES[badge.rarity];
          const isHov = hovered === badge.id;

          return (
            <div
              key={badge.id}
              className="relative flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all"
              style={{
                background: badge.unlocked ? `${rs.glow}` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${badge.unlocked ? rs.border : 'rgba(255,255,255,0.06)'}`,
                boxShadow: badge.unlocked && isHov ? `0 0 20px ${rs.glow}, 0 4px 16px rgba(0,0,0,0.4)` : 'none',
                transform: isHov ? 'translateY(-3px)' : 'none',
                opacity: badge.unlocked ? 1 : 0.4,
                filter: badge.unlocked ? 'none' : 'grayscale(1)',
              }}
              onMouseEnter={() => setHovered(badge.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Rarity corner */}
              {badge.unlocked && (
                <div
                  className="absolute top-1.5 right-1.5 text-xs px-1 py-0.5 rounded"
                  style={{ background: `${rs.color}20`, color: rs.color, fontSize: 8, fontFamily: 'IBM Plex Mono', fontWeight: 600 }}
                >
                  {rs.label.toUpperCase()}
                </div>
              )}

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{
                  background: badge.unlocked ? `${rs.glow}` : 'rgba(255,255,255,0.05)',
                  boxShadow: badge.unlocked ? `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 12px ${rs.glow}` : 'none',
                }}
              >
                {badge.unlocked ? badge.icon : '🔒'}
              </div>

              <div className="text-center">
                <div className="text-xs font-bold leading-tight" style={{ fontFamily: 'Space Grotesk', color: badge.unlocked ? '#f0eeff' : '#3d3760' }}>{badge.name}</div>
                {badge.unlocked && badge.unlockedAt && (
                  <div className="text-xs mt-0.5" style={{ color: '#3d3760', fontFamily: 'IBM Plex Mono', fontSize: 9 }}>{badge.unlockedAt}</div>
                )}
              </div>

              {/* Tooltip */}
              {isHov && (
                <div
                  className="absolute z-30 rounded-xl p-3 whitespace-nowrap text-left pointer-events-none"
                  style={{
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(13,13,22,0.98)',
                    border: `1px solid ${rs.border}`,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.8)`,
                    backdropFilter: 'blur(12px)',
                    minWidth: 160,
                  }}
                >
                  <div className="font-bold text-sm mb-1" style={{ fontFamily: 'Space Grotesk', color: badge.unlocked ? rs.color : '#5c5778' }}>{badge.name}</div>
                  <div className="text-xs" style={{ color: '#a09ab8', lineHeight: 1.5 }}>{badge.desc}</div>
                  {!badge.unlocked && <div className="text-xs mt-1.5" style={{ color: '#3d3760' }}>Keep playing to unlock!</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
