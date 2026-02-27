import type { Tab } from '../App'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'itinerario', label: 'Itinerario', icon: '🗺️' },
  { id: 'checklist', label: 'Lista', icon: '✅' },
  { id: 'gastos', label: 'Gastos', icon: '💶' },
  { id: 'notas', label: 'Notas', icon: '📝' },
]

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-gray-950/95 backdrop-blur border-t border-gray-800"
      style={{ paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))', paddingTop: '6px' }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[60px] relative"
          >
            <span
              className="text-xl transition-transform duration-200"
              style={{ transform: isActive ? 'scale(1.15)' : 'scale(1)' }}
            >
              {tab.icon}
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-gray-600'
              }`}
            >
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-full" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
