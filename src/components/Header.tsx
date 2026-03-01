import type { Tab } from '../App'

const TAB_TITLE: Record<Tab, string> = {
  itinerario: 'Flor & Pato',
  checklist: 'Lista',
  gastos: 'Gastos',
  notas: 'Notas',
}

export function AppHeader({ active }: { active: Tab }) {
  return (
    <header style={{
      flexShrink: 0,
      background: 'rgba(253,252,248,0.85)',
      backdropFilter: 'blur(32px) saturate(180%)',
      WebkitBackdropFilter: 'blur(32px) saturate(180%)',
      borderBottom: '1px solid rgba(234,229,224,0.6)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 12,
      paddingBottom: 12,
      minHeight: 56,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }} />
      <p style={{ flex: 1, fontSize: 18, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--color-text)', lineHeight: 1.1 }}>
        {TAB_TITLE[active]}
      </p>
      <span style={{ fontSize: 20, lineHeight: 1, userSelect: 'none' }}>🇪🇸</span>
    </header>
  )
}
