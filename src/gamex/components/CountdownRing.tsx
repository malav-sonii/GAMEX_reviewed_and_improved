import { useEffect, useState } from 'react';

interface Props {
  seconds: number;
  onExpire: () => void;
}

export default function CountdownRing({ seconds, onExpire }: Props) {
  const [remaining, setRemaining] = useState(seconds);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / seconds;
  const offset = circumference * (1 - progress);

  const color = remaining > 60 ? '#10b981' : remaining > 30 ? '#f59e0b' : '#ef4444';

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  useEffect(() => {
    if (remaining <= 0) { onExpire(); return; }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onExpire]);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
      <svg width={56} height={56} viewBox="0 0 56 56">
        {/* Track */}
        <circle cx={28} cy={28} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
        {/* Progress */}
        <circle
          cx={28} cy={28} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
        />
        {/* Glow pulse when low */}
        {remaining <= 30 && (
          <circle
            cx={28} cy={28} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={2}
            opacity={0.25}
            style={{ animation: 'ping 1s ease-out infinite' }}
          />
        )}
        <text x={28} y={29} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight="700" fill={color} fontFamily="IBM Plex Mono, monospace">
          {mm}:{ss}
        </text>
      </svg>
      <div>
        <div className="text-xs font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif', color }}>Station Held</div>
        <div className="text-xs mt-0.5" style={{ color: '#5c5778' }}>Complete booking before it expires</div>
      </div>
    </div>
  );
}
