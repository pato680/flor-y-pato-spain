import { useEffect, useState } from 'react'

const TRIP_START = new Date('2026-06-05T00:00:00')
const TRIP_END = new Date('2026-06-20T00:00:00')

function getDiff() {
  const now = new Date()
  if (now >= TRIP_END) return { state: 'past' as const, days: 0, hours: 0, minutes: 0 }
  if (now >= TRIP_START) {
    const diff = TRIP_END.getTime() - now.getTime()
    return { state: 'during' as const, days: Math.floor(diff / 86400000), hours: 0, minutes: 0 }
  }
  const diff = TRIP_START.getTime() - now.getTime()
  const totalMinutes = Math.floor(diff / 60000)
  return {
    state: 'before' as const,
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
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
      <div className="card animate-card-enter">
        <p className="f1-label mb-1" style={{ color: 'var(--color-accent)' }}>Viaje completado</p>
        <p className="text-card-title text-text">Qué bonita fue España 🇪🇸</p>
      </div>
    )
  }

  if (diff.state === 'during') {
    return (
      <div className="card animate-card-enter">
        <p className="f1-label mb-1" style={{ color: 'var(--color-accent)' }}>En viaje</p>
        <p className="text-card-title text-text">
          {diff.days === 0 ? 'Último día — ¡a disfrutar!' : `Quedan ${diff.days} día${diff.days > 1 ? 's' : ''}`}
        </p>
      </div>
    )
  }

  return (
    <div className="card animate-card-enter">
      <p className="f1-label mb-3" style={{ color: 'var(--color-accent)' }}>Faltan para el viaje</p>

      <div className="flex items-end gap-4">
        <Unit value={diff.days} label="días" large delay="0ms" />
        <Unit value={diff.hours} label="horas" delay="80ms" />
        <Unit value={diff.minutes} label="min" delay="160ms" />
      </div>

      <p className="text-label text-text-sub mt-3" style={{ letterSpacing: '0.5px' }}>
        5 de junio, 2026
      </p>
    </div>
  )
}

function Unit({ value, label, large, delay }: { value: number; label: string; large?: boolean; delay: string }) {
  return (
    <div className="flex flex-col animate-rev-up" style={{ animationDelay: delay }}>
      <span
        className="font-black text-text leading-none"
        style={{ fontSize: large ? '48px' : '28px', color: large ? 'var(--color-accent)' : 'var(--color-text)' }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-label text-text-sub mt-1">{label}</span>
    </div>
  )
}
