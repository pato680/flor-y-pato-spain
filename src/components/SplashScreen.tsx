import { useState } from 'react'
import { useF1Lights } from '../hooks/useF1Lights'

interface Props {
  onDone: () => void
}

export function SplashScreen({ onDone }: Props) {
  const [fading, setFading] = useState(false)

  const lit = useF1Lights(400, () => {
    // After first full cycle (lights go out), fade and close
    setFading(true)
    setTimeout(() => onDone(), 600)
  })

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-8"
      style={{
        background: '#F5F5F3',
        height: '100dvh',
        opacity: fading ? 0 : 1,
        transition: 'opacity 600ms cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      <div className="flex flex-col items-center gap-6 animate-card-enter">
        {/* Red bar + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 3, height: 20, background: '#E10600', borderRadius: 1 }} />
          <span style={{
            fontFamily: '"Azeret Mono", monospace',
            fontSize: 10,
            color: '#E10600',
            letterSpacing: '0.1em',
            fontWeight: 600,
          }}>
            ESP · JUN 2026
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 24,
          fontWeight: 700,
          color: '#0F0F0F',
          letterSpacing: '-0.3px',
          lineHeight: 1.2,
        }}>
          Flor & Pato
        </h1>

        {/* F1 lights — larger for splash */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[1, 2, 3, 4, 5].map((n) => {
            const isOn = lit >= n
            return (
              <span
                key={n}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: isOn ? '#E10600' : '#EAEAE6',
                  border: isOn ? '2px solid #E10600' : '2px solid #DDDDD8',
                  boxShadow: isOn ? '0 0 8px #E10600, 0 0 18px rgba(225,6,0,0.6)' : 'none',
                  transition: isOn ? 'all 80ms ease' : 'none',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
