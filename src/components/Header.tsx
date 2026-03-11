import type { Tab } from '../App'
import { useF1Lights } from '../hooks/useF1Lights'

const TAB_TITLE: Record<Tab, string> = {
  itinerario: 'Flor & Pato',
  checklist: 'Lista',
  gastos: 'Gastos',
  notas: 'Notas',
}

export function AppHeader({ active }: { active: Tab }) {
  const lit = useF1Lights(800)

  return (
    <header style={{ flexShrink: 0, position: 'relative' }}>
      <div style={{
        background: 'rgba(245,245,243,0.9)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        borderBottom: '1px solid rgba(221,221,216,0.6)',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 3, height: 20, background: '#E10600', borderRadius: 1, flexShrink: 0,
            }} />
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
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.3px',
            color: '#0F0F0F',
            lineHeight: 1.1,
            marginTop: 2,
          }}>
            {TAB_TITLE[active]}
          </p>
        </div>

        {/* Right — F1 lights */}
        <div style={{ display: 'flex', gap: 6, paddingTop: 6 }}>
          {[1, 2, 3, 4, 5].map((n) => {
            const isOn = lit >= n
            return (
              <span
                key={n}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: isOn ? '#E10600' : '#EAEAE6',
                  border: isOn ? '1.5px solid #E10600' : '1.5px solid #DDDDD8',
                  boxShadow: isOn ? '0 0 6px #E10600, 0 0 14px rgba(225,6,0,0.6)' : 'none',
                  transition: isOn ? 'all 80ms ease' : 'none',
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Red gradient line */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, #E10600, rgba(225,6,0,0.25), transparent)',
      }} />
    </header>
  )
}
