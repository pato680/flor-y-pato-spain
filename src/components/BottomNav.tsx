import type { Tab } from '../App'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

const icons: Record<Tab, (active: boolean) => JSX.Element> = {
  itinerario: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  checklist: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  gastos: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="3" />
      <path d="M16 14a2 2 0 100-4 2 2 0 000 4z" />
      <path d="M2 10h20" />
    </svg>
  ),
  notas: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  ),
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'itinerario', label: 'VIAJE' },
  { id: 'checklist', label: 'LISTA' },
  { id: 'gastos', label: 'GASTOS' },
  { id: 'notas', label: 'NOTAS' },
]

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav style={{
      flexShrink: 0,
      background: '#FFFFFF',
      borderTop: '1px solid #DDDDD8',
      padding: '8px 0',
      paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
      position: 'relative',
      zIndex: 40,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    }}>
      {TABS.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="active:scale-[0.88]"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              padding: '0 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              transition: 'transform 150ms cubic-bezier(0.32,0.72,0,1)',
              position: 'relative',
            }}
          >
            {/* Active indicator line */}
            <span style={{
              width: 20,
              height: 2.5,
              borderRadius: 1,
              background: isActive ? '#E10600' : 'transparent',
              marginBottom: 4,
              transition: 'background 200ms ease',
            }} />

            <span style={{
              color: isActive ? '#E10600' : '#9A9A94',
              transition: 'color 200ms ease',
            }}>
              {icons[tab.id](isActive)}
            </span>

            <span style={{
              fontFamily: '"Azeret Mono", monospace',
              fontSize: 9,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#E10600' : '#9A9A94',
              letterSpacing: '0.06em',
              lineHeight: 1,
              marginTop: 1,
              transition: 'color 200ms ease',
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
