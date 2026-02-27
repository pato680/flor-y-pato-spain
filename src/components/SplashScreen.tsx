import { useEffect, useState } from 'react'

interface Props {
  onDone: () => void
}

export function SplashScreen({ onDone }: Props) {
  const [litCount, setLitCount] = useState(0)
  const [lightsOut, setLightsOut] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setLitCount(1), 600),
      setTimeout(() => setLitCount(2), 1100),
      setTimeout(() => setLitCount(3), 1600),
      setTimeout(() => setLitCount(4), 2100),
      setTimeout(() => setLitCount(5), 2600),
      // Todas apagan a la vez
      setTimeout(() => setLightsOut(true), 3400),
      setTimeout(() => setFading(true), 4000),
      setTimeout(() => onDone(), 4600),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        background: '#0F0F12',
        height: '100dvh',
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 600ms cubic-bezier(0.32,0.72,0,1)' : undefined,
      }}
    >
      <div className="f1-speedlines" style={{ opacity: 0.03 }} />

      <div className="relative z-10 flex flex-col items-center gap-10 px-8">

        {/* Title */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="f1-label" style={{ color: '#E10600', letterSpacing: 3 }}>
            Gran Premio de Barcelona
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Flor & Pato
          </h1>
          <p className="f1-sublabel" style={{ color: '#555', letterSpacing: 3 }}>España 2026</p>
        </div>

        {/* Gantry */}
        <div style={{
          background: '#181818',
          borderRadius: 20,
          padding: '22px 28px',
          border: '1px solid #282828',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}>
          <div className="flex items-center gap-5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Light key={n} lit={!lightsOut && litCount >= n} lightsOut={lightsOut} />
            ))}
          </div>

          {/* Label debajo de las luces */}
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: 4, color: '#333', textTransform: 'uppercase' }}>
            Formula 1
          </p>
        </div>

        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: 4, color: '#2A2A2A', textTransform: 'uppercase' }}>
          5 – 20 Jun 2026
        </p>
      </div>

    </div>
  )
}

function Light({ lit, lightsOut }: { lit: boolean; lightsOut: boolean }) {
  return (
    <div style={{
      width: 52,
      height: 52,
      borderRadius: '50%',
      background: lit ? '#E10600' : '#0D0D0D',
      border: `2.5px solid ${lit ? '#FF3020' : '#252525'}`,
      boxShadow: lit
        ? '0 0 14px #E10600, 0 0 32px rgba(225,6,0,0.8), 0 0 64px rgba(225,6,0,0.35)'
        : 'none',
      // Al encender: rápido. Al apagar: instantáneo (todos a la vez)
      transition: lit
        ? 'background 60ms ease, box-shadow 60ms ease, border-color 60ms ease, transform 60ms ease'
        : lightsOut
        ? 'background 80ms ease, box-shadow 80ms ease, border-color 80ms ease'
        : undefined,
      transform: lit ? 'scale(1.1)' : 'scale(1)',
    }} />
  )
}
