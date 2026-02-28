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
        label="Viaje completado"
        value="00"
        sub="España 2026 · Gracias por los recuerdos"
      />
    )
  }

  if (diff.state === 'during') {
    return (
      <TimingBoard
        label="En viaje · días restantes"
        value={String(diff.days).padStart(2, '0')}
        sub="Gran Premio de España · Barcelona"
      />
    )
  }

  return (
    <TimingBoard
      label="Lights Out In"
      value={String(diff.days).padStart(2, '0')}
      sub="Gran Premio de España · 5 Jun 2026"
    />
  )
}

function TimingBoard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div
      className="rounded-card overflow-hidden animate-card-enter"
      style={{ background: '#0D0D0F', border: '1px solid #1E1E22', position: 'relative' }}
    >
      {/* Franja roja superior */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #C8472A 70%, #E8A04A 100%)', position: 'relative', overflow: 'hidden' }}>
        <div className="animate-stripe-shimmer" style={{
          position: 'absolute', top: 0, bottom: 0, width: '30%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        }} />
      </div>

      {/* Speed lines sutiles */}
      <div style={{
        position: 'absolute', inset: '3px 0 0 0',
        pointerEvents: 'none', overflow: 'hidden', opacity: 0.04,
        background: 'repeating-linear-gradient(90deg, transparent, transparent 50px, #FFFFFF 50px, #FFFFFF 51px)',
        animation: 'race-stripe 0.7s linear infinite',
      }} />

      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1 }}>

        {/* Número grande */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
          <span className="animate-rev-up" style={{
            fontSize: 56, fontWeight: 900,
            color: '#FFFFFF',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-3px',
            textShadow: '0 0 20px rgba(200,71,42,0.5)',
          }}>
            {value}
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C8472A', marginTop: 3 }}>
            DÍAS
          </span>
        </div>

        {/* Separador */}
        <div style={{ width: 1, height: 48, background: '#2A2A2E', flexShrink: 0 }} />

        {/* Info derecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 2.5,
            textTransform: 'uppercase', color: '#C8472A',
          }}>
            {label}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#555560', letterSpacing: 0.5 }}>
            {sub}
          </span>
          {/* Barra decorativa */}
          <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
            {['#C8472A', '#E8A04A', '#2A2A2E', '#2A2A2E', '#2A2A2E'].map((c, i) => (
              <div key={i} style={{ height: 2, flex: 1, background: c, borderRadius: 1 }} />
            ))}
          </div>
        </div>

      </div>

      {/* Franja a cuadros inferior */}
      <div style={{
        height: 5,
        background: 'repeating-conic-gradient(#2A2A2A 0% 25%, #0D0D0F 0% 50%) 0 0 / 6px 6px',
      }} />

    </div>
  )
}
