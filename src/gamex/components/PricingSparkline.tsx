interface Props {
  basePrice: number;
  isPeak?: boolean;
}

// 24-hour price curve (index = hour 0–23)
const hourlyMultipliers = [
  0.7, 0.6, 0.6, 0.6, 0.65, 0.7,
  0.8, 0.9, 1.0, 1.0, 1.0, 1.05,
  1.1, 1.0, 0.95, 1.0, 1.1, 1.2,
  1.35, 1.4, 1.3, 1.15, 0.95, 0.8,
];

export default function PricingSparkline({ basePrice, isPeak = false }: Props) {
  const currentHour = new Date().getHours();
  const currentMultiplier = hourlyMultipliers[currentHour];
  const currentPrice = Math.round(basePrice * currentMultiplier);
  const peakPrice = Math.round(basePrice * 1.4);

  const W = 120;
  const H = 36;
  const prices = hourlyMultipliers.map(m => m * basePrice);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);

  const pts = prices.map((p, i) => {
    const x = (i / 23) * W;
    const y = H - ((p - minP) / (maxP - minP)) * H;
    return `${x},${y}`;
  });

  const pathD = `M ${pts.join(' L ')}`;
  const fillD = `M 0,${H} L ${pts.join(' L ')} L ${W},${H} Z`;

  // Current position dot
  const dotX = (currentHour / 23) * W;
  const dotY = H - ((prices[currentHour] - minP) / (maxP - minP)) * H;

  const isActuallyPeak = currentMultiplier >= 1.2;

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl" style={{ background: isActuallyPeak ? 'rgba(239,68,68,0.07)' : 'rgba(16,185,129,0.07)', border: `1px solid ${isActuallyPeak ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}` }}>
      <div>
        <div className="flex items-center gap-1.5 mb-0.5">
          {isActuallyPeak && <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>PEAK</span>}
          <span className="text-xs" style={{ color: '#5c5778' }}>Now</span>
        </div>
        <div className="font-black text-lg" style={{ fontFamily: 'IBM Plex Mono, monospace', color: isActuallyPeak ? '#ef4444' : '#10b981' }}>
          ₹{currentPrice}<span className="text-xs font-normal" style={{ color: '#5c5778' }}>/hr</span>
        </div>
        <div className="text-xs mt-0.5" style={{ color: '#3d3760' }}>Peak: ₹{peakPrice}/hr</div>
      </div>

      <div className="flex flex-col">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isActuallyPeak ? '#ef4444' : '#10b981'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isActuallyPeak ? '#ef4444' : '#10b981'} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fillD} fill="url(#sparkGrad)" />
          <path d={pathD} fill="none" stroke={isActuallyPeak ? '#ef4444' : '#10b981'} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          {/* Current position */}
          <circle cx={dotX} cy={dotY} r={4} fill={isActuallyPeak ? '#ef4444' : '#10b981'} stroke="rgba(9,9,15,0.8)" strokeWidth={2} />
          <circle cx={dotX} cy={dotY} r={8} fill="none" stroke={isActuallyPeak ? '#ef4444' : '#10b981'} strokeWidth={1} opacity={0.3} />
        </svg>
        <div className="flex justify-between text-xs mt-1" style={{ color: '#3d3760' }}>
          <span>12AM</span><span>12PM</span><span>11PM</span>
        </div>
      </div>
    </div>
  );
}
