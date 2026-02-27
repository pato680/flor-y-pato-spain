import { Header } from '../components/Header'
import { useNotes } from '../hooks/useNotes'

export function NotasPage() {
  const { notes, loading, saving, saveNotes } = useNotes()

  return (
    <div className="min-h-screen bg-app-bg">
      <Header
        title="Notas"
        subtitle="Ideas y recordatorios del viaje"
        right={
          <span className={`text-xs font-medium transition-opacity duration-300 ${saving ? 'text-yellow-400 opacity-100' : 'text-green-500 opacity-0'}`}>
            Guardando…
          </span>
        }
      />
      <div className="pt-header pb-nav px-4 flex flex-col h-screen">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-gray-600 text-sm">Cargando…</span>
          </div>
        ) : (
          <textarea
            className="flex-1 w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white text-sm leading-relaxed resize-none focus:outline-none focus:border-gray-600 placeholder-gray-700 mt-3"
            placeholder="Escribe aquí tus notas, ideas, recordatorios…&#10;&#10;Todo se guarda automáticamente en la nube 🌐"
            value={notes}
            onChange={(e) => saveNotes(e.target.value)}
            autoCorrect="on"
            spellCheck={true}
          />
        )}
      </div>
    </div>
  )
}
