import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { AppHeader } from './components/Header'
import { SplashScreen } from './components/SplashScreen'
import { ItinerarioPage } from './pages/ItinerarioPage'
import { ChecklistPage } from './pages/ChecklistPage'
import { GastosPage } from './pages/GastosPage'
import { NotasPage } from './pages/NotasPage'

export type Tab = 'itinerario' | 'checklist' | 'gastos' | 'notas'

const PAGES: Record<Tab, JSX.Element> = {
  itinerario: <ItinerarioPage />,
  checklist: <ChecklistPage />,
  gastos: <GastosPage />,
  notas: <NotasPage />,
}

export default function App() {
  const [splash, setSplash] = useState(false) // TODO: re-enable splash screen
  const [active, setActive] = useState<Tab>('itinerario')
  const [pageKey, setPageKey] = useState(0)

  function handleTabChange(tab: Tab) {
    if (tab === active) return
    setActive(tab)
    setPageKey((k) => k + 1)
  }

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}

      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          background: '#FAF8F5',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          overflow: 'hidden',
          opacity: splash ? 0 : 1,
          transition: 'opacity 400ms ease',
        }}
      >
        <AppHeader active={active} />
        <main key={pageKey} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }} className="animate-page-enter">
          {PAGES[active]}
        </main>
        <BottomNav active={active} onChange={handleTabChange} />
      </div>
    </>
  )
}
