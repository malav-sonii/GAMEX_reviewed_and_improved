import { useEffect, useRef } from 'react';

type StationStatus = 'open' | 'booked' | 'maintenance';

interface Station {
  id: string;
  status: StationStatus;
  row: number;
  col: number;
}

interface Props {
  stations: Station[];
  selected: string[];
  onSelect: (id: string) => void;
  squadMode: boolean;
}

const STATUS_COLORS: Record<StationStatus, { top: string; side: string; front: string; text: string }> = {
  open:        { top: '#1a3a2a', side: '#0d2018', front: '#113025', text: '#10b981' },
  booked:      { top: '#3a1a1a', side: '#200d0d', front: '#301113', text: '#ef4444' },
  maintenance: { top: '#3a2e0d', side: '#201a05', front: '#302608', text: '#f59e0b' },
};

const SELECTED_COLORS = { top: '#2d1f5e', side: '#180f3a', front: '#221648', text: '#a78bfa' };

const TILE_W = 72;
const TILE_H = 36;
const TILE_DEPTH = 18;
const GAP = 8;

function toIso(col: number, row: number) {
  const x = (col - row) * ((TILE_W + GAP) / 2);
  const y = (col + row) * ((TILE_H + GAP) / 2);
  return { x, y };
}

export default function IsometricFloorMap({ stations, selected, onSelect, squadMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rows = Math.max(...stations.map(s => s.row)) + 1;
  const cols = Math.max(...stations.map(s => s.col)) + 1;

  // Compute canvas size
  const canvasW = (cols + rows) * ((TILE_W + GAP) / 2) + TILE_W;
  const canvasH = (cols + rows) * ((TILE_H + GAP) / 2) + TILE_DEPTH + TILE_H;
  const offsetX = rows * ((TILE_W + GAP) / 2);
  const offsetY = TILE_DEPTH + 10;

  // Sort for painter's algorithm (back to front)
  const sorted = [...stations].sort((a, b) => (a.row + a.col) - (b.row + b.col));

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = (canvasW - containerRef.current.offsetWidth) / 2;
    }
  }, [canvasW]);

  return (
    <div
      ref={containerRef}
      className="scroll-x rounded-2xl py-6"
      style={{ background: 'rgba(9,9,15,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <svg
        width={canvasW}
        height={canvasH}
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
      >
        {/* Floor grid */}
        {sorted.map((st) => {
          const { x, y } = toIso(st.col, st.row);
          const px = offsetX + x;
          const py = offsetY + y;
          return (
            <polygon
              key={`floor-${st.id}`}
              points={`
                ${px},${py}
                ${px + TILE_W / 2},${py + TILE_H / 2}
                ${px + TILE_W},${py}
                ${px + TILE_W / 2},${py - TILE_H / 2}
              `}
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
            />
          );
        })}

        {/* Stations */}
        {sorted.map((st) => {
          const { x, y } = toIso(st.col, st.row);
          const px = offsetX + x;
          const py = offsetY + y;
          const isSelected = selected.includes(st.id);
          const isClickable = st.status === 'open';
          const c = isSelected ? SELECTED_COLORS : STATUS_COLORS[st.status];

          // Isometric box: top face + left side + right side
          const tw = TILE_W * 0.78;
          const th = TILE_H * 0.78;
          const d = TILE_DEPTH;
          const bx = px + (TILE_W - tw) / 2;
          const by = py + (TILE_H - th) / 2 - d;

          // Top face
          const topPoints = `
            ${bx},${by + th / 2}
            ${bx + tw / 2},${by}
            ${bx + tw},${by + th / 2}
            ${bx + tw / 2},${by + th}
          `;
          // Left face
          const leftPoints = `
            ${bx},${by + th / 2}
            ${bx + tw / 2},${by + th}
            ${bx + tw / 2},${by + th + d}
            ${bx},${by + th / 2 + d}
          `;
          // Right face
          const rightPoints = `
            ${bx + tw / 2},${by + th}
            ${bx + tw},${by + th / 2}
            ${bx + tw},${by + th / 2 + d}
            ${bx + tw / 2},${by + th + d}
          `;

          // Glow filter id
          const glowId = `glow-${st.id}`;

          return (
            <g
              key={st.id}
              onClick={() => isClickable && onSelect(st.id)}
              style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
            >
              {/* Glow for selected */}
              {isSelected && (
                <defs>
                  <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              )}

              {/* Top */}
              <polygon
                points={topPoints}
                fill={c.top}
                stroke={isSelected ? '#8b5cf6' : 'rgba(255,255,255,0.06)'}
                strokeWidth={isSelected ? 1.5 : 0.5}
                filter={isSelected ? `url(#${glowId})` : undefined}
              />
              {/* Left */}
              <polygon points={leftPoints} fill={c.side} stroke="rgba(0,0,0,0.3)" strokeWidth={0.5} />
              {/* Right */}
              <polygon points={rightPoints} fill={c.front} stroke="rgba(0,0,0,0.3)" strokeWidth={0.5} />

              {/* Monitor icon on top */}
              <text
                x={bx + tw / 2}
                y={by + th / 2 + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={13}
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {st.status === 'maintenance' ? '🔧' : isSelected ? '✓' : '🖥'}
              </text>

              {/* ID label */}
              <text
                x={bx + tw / 2}
                y={by + th + d / 2 + 6}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                fill={c.text}
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="600"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {st.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
