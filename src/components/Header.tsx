import type { Tab } from '../App'

const TAB_TITLE: Record<Tab, string> = {
  itinerario: 'Flor & Pato',
  checklist:  'Lista',
  gastos:     'Gastos',
  notas:      'Notas',
}

export function AppHeader({ active }: { active: Tab }) {
  return (
    <header style={{
      flexShrink: 0,
      background: 'rgba(250,248,245,0.88)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid rgba(231,226,220,0.7)',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
      paddingBottom: 10,
      minHeight: 52,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8472A', flexShrink: 0 }} />
      <p style={{ flex: 1, fontSize: 17, fontWeight: 800, letterSpacing: '-0.4px', color: '#1C1917', lineHeight: 1.1 }}>
        {TAB_TITLE[active]}
      </p>
      <span style={{ fontSize: 20, lineHeight: 1, userSelect: 'none' }}>🇪🇸</span>
    </header>
  )
}
