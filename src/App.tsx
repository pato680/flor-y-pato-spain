import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { ItinerarioPage } from './pages/ItinerarioPage'
import { ChecklistPage } from './pages/ChecklistPage'
import { GastosPage } from './pages/GastosPage'
import { NotasPage } from './pages/NotasPage'

export type Tab = 'itinerario' | 'checklist' | 'gastos' | 'notas'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('itinerario')

  return (
    <div className="min-h-screen bg-app-bg">
      <div className="animate-fade-in" key={activeTab}>
        {activeTab === 'itinerario' && <ItinerarioPage />}
        {activeTab === 'checklist' && <ChecklistPage />}
        {activeTab === 'gastos' && <GastosPage />}
        {activeTab === 'notas' && <NotasPage />}
      </div>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
