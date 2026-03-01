import { useEffect, useState } from 'react'

interface Props {
  onDone: () => void
}

export function SplashScreen({ onDone }: Props) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setFading(true), 1800),
      setTimeout(() => onDone(), 2400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-8"
      style={{
        background: 'var(--color-bg)',
        height: '100dvh',
        opacity: fading ? 0 : 1,
        transition: 'opacity 600ms cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      <div className="flex flex-col items-center gap-6 animate-card-enter">
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--color-accent)' }} />
        </div>
        <div className="text-center">
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-1px', lineHeight: 1.2, marginBottom: 8 }}>
            Flor & Pato
          </h1>
          <p style={{ color: 'var(--color-accent)', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>
            España 2026
          </p>
        </div>
      </div>
    </div>
  )
}
