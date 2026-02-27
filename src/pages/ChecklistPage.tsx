import { useState } from 'react'
import { Header } from '../components/Header'
import { useChecklist } from '../hooks/useChecklist'

export function ChecklistPage() {
  const { items, loading, addItem, toggleItem, deleteItem, completed, total, progress } = useChecklist()
  const [input, setInput] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    const text = input.trim()
    if (!text) return
    setAdding(true)
    await addItem(text)
    setInput('')
    setAdding(false)
  }

  const pending = items.filter((i) => !i.completado)
  const done = items.filter((i) => i.completado)

  return (
    <div className="min-h-screen bg-app-bg">
      <Header
        title="Checklist"
        subtitle={total > 0 ? `${completed} de ${total} listo` : 'Organiza tu equipaje'}
      />
      <div className="pt-header pb-nav px-4">
        {/* Progress bar */}
        {total > 0 && (
          <div className="mt-3 mb-4 animate-card-in">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-gray-500 font-medium">Progreso</span>
              <span className="text-xs font-bold text-white">{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Add item input */}
        <div className="flex gap-2 mb-4 animate-card-in">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Agregar ítem…"
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-gray-600"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !input.trim()}
            className="bg-red-600 text-white px-4 py-3 rounded-xl font-bold text-sm disabled:opacity-40 transition-opacity"
          >
            +
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="text-gray-600 text-sm">Cargando…</span>
          </div>
        ) : total === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500 text-sm">Agrega ítems a tu checklist</p>
          </div>
        ) : (
          <>
            {/* Pending items */}
            {pending.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                  Pendiente — {pending.length}
                </p>
                <div className="flex flex-col gap-1.5">
                  {pending.map((item) => (
                    <CheckItem
                      key={item.id}
                      item={item}
                      onToggle={() => toggleItem(item.id, true)}
                      onDelete={() => deleteItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Done items */}
            {done.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                  Listo — {done.length}
                </p>
                <div className="flex flex-col gap-1.5">
                  {done.map((item) => (
                    <CheckItem
                      key={item.id}
                      item={item}
                      onToggle={() => toggleItem(item.id, false)}
                      onDelete={() => deleteItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface CheckItemProps {
  item: { id: string; texto: string; completado: boolean }
  onToggle: () => void
  onDelete: () => void
}

function CheckItem({ item, onToggle, onDelete }: CheckItemProps) {
  return (
    <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 animate-card-in group">
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          item.completado
            ? 'bg-green-500 border-green-500'
            : 'border-gray-600 bg-transparent'
        }`}
      >
        {item.completado && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span
        className={`flex-1 text-sm transition-all duration-200 ${
          item.completado ? 'text-gray-600 line-through' : 'text-white'
        }`}
      >
        {item.texto}
      </span>
      <button
        onClick={onDelete}
        className="text-gray-700 hover:text-red-500 transition-colors text-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        ×
      </button>
    </div>
  )
}
