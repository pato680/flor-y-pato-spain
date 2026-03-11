import { useEffect, useState } from 'react'

const TRIP_START = new Date('2026-06-05T00:00:00')
const TRIP_END   = new Date('2026-06-20T00:00:00')

function getDiff() {
  const now = new Date()
  if (now >= TRIP_END) return { state: 'past' as const, days: 0 }
  if (now >= TRIP_START) {
    const diff = TRIP_END.getTime() - now.getTime()
    return { state: 'during' as const, days: Math.floor(diff / 86400000) }
  }
  const diff = TRIP_START.getTime() - now.getTime()
  return {
    state: 'before' as const,
    days: Math.floor(diff / 86400000),
  }
}

export function Countdown() {
  const [diff, setDiff] = useState(getDiff)

  useEffect(() => {
    const id = setInterval(() => setDiff(getDiff()), 60000)
    return () => clearInterval(id)
  }, [])

  if (diff.state === 'past') {
    return (
      <TimingBoard
        topLabel="COMPLETADO"
        value="00"
        unit="DÍAS"
        dateRange="05.06 → 20.06"
        badge="ESPAÑA 2026"
      />
    )
  }

  if (diff.state === 'during') {
    return (
      <TimingBoard
        topLabel="EN VIAJE"
        value={String(diff.days).padStart(2, '0')}
        unit="DÍAS"
        dateRange="05.06 → 20.06"
        badge="GP ESPAÑA"
      />
    )
  }

  return (
    <TimingBoard
      topLabel="FALTAN"
      value={String(diff.days).padStart(2, '0')}
      unit="DÍAS"
      dateRange="05.06 → 20.06"
      badge="GP ESPAÑA"
    />
  )
}

function TimingBoard({ topLabel, value, unit, dateRange, badge }: {
  topLabel: string
  value: string
  unit: string
  dateRange: string
  badge: string
}) {
  return (
    <div
      className="animate-card-enter"
      style={{
        background: '#0F0F0F',
        borderRadius: 8,
        padding: '14px 18px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        overflow: 'hidden',
      }}>
        <div
          className="animate-shimmer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '30%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #E10600, transparent)',
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left — number */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: '"Azeret Mono", monospace',
              fontSize: 9,
              color: 'rgba(245,245,243,0.35)',
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}>
              {topLabel}
            </span>
            <span
              className="animate-count-up"
              style={{
                fontFamily: '"Azeret Mono", monospace',
                fontSize: 44,
                fontWeight: 700,
                color: '#F5F5F3',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-2px',
              }}
            >
              {value}
            </span>
          </div>
          <span style={{
            fontFamily: '"Azeret Mono", monospace',
            fontSize: 13,
            color: 'rgba(245,245,243,0.35)',
            fontWeight: 500,
          }}>
            {unit}
          </span>
        </div>

        {/* Right — info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{
            fontFamily: '"Azeret Mono", monospace',
            fontSize: 10,
            color: 'rgba(245,245,243,0.35)',
            fontWeight: 500,
          }}>
            {dateRange}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#E10600',
              animation: 'lights-glow 2s ease-in-out infinite',
              boxShadow: '0 0 4px #E10600',
            }} />
            <span style={{
              fontFamily: '"Azeret Mono", monospace',
              fontSize: 10,
              fontWeight: 700,
              color: '#E10600',
              letterSpacing: '0.05em',
            }}>
              {badge}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
